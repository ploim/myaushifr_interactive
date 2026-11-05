// Генератор кадров маскота из исходного PNG.
// Исходник — сглаженная иллюстрация с прозрачным фоном. Пайплайн:
// 1) декод PNG → 2) пикселизация (медиана по ячейкам, порог альфы)
// → 3) связный кластер «рта» по цвету → 4) кадр «рот закрыт»
// → 5) два PNG в src/assets/mascot/ + отладочный лист.
//
// Запуск: node scripts/mascot-frames.mjs /путь/до/mascot-dod.png
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { deflateSync, inflateSync } from 'node:zlib'

const SRC = process.argv[2]
const OUT_DIR = new URL('../src/assets/mascot/', import.meta.url).pathname
const TARGET = 96 // клеток по большей стороне

// ---------------------------------------------------------------- декодирование

function parsePng(file) {
  const buf = readFileSync(file)
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('не PNG')
  let off = 8
  let ihdr = null
  const idat = []
  while (off < buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.toString('ascii', off + 4, off + 8)
    const data = buf.subarray(off + 8, off + 8 + len)
    if (type === 'IHDR') ihdr = data
    else if (type === 'IDAT') idat.push(data)
    off += 12 + len
  }
  const w = ihdr.readUInt32BE(0)
  const h = ihdr.readUInt32BE(4)
  const depth = ihdr[8]
  const colorType = ihdr[9]
  const interlace = ihdr[12]
  if (depth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error(`ожидался 8-бит RGBA без чересстрочности, получено depth=${depth} color=${colorType}`)
  }
  const raw = inflateSync(Buffer.concat(idat))
  const stride = w * 4
  const out = Buffer.alloc(h * stride)
  const paeth = (a, b, c) => {
    const p = a + b - c
    const pa = Math.abs(p - a)
    const pb = Math.abs(p - b)
    const pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }
  let ptr = 0
  for (let y = 0; y < h; y++) {
    const filter = raw[ptr++]
    for (let x = 0; x < stride; x++) {
      const idx = y * stride + x
      const v = raw[ptr++]
      const left = x >= 4 ? out[idx - 4] : 0
      const up = y > 0 ? out[idx - stride] : 0
      const ul = x >= 4 && y > 0 ? out[idx - stride - 4] : 0
      let val
      if (filter === 0) val = v
      else if (filter === 1) val = v + left
      else if (filter === 2) val = v + up
      else if (filter === 3) val = v + ((left + up) >> 1)
      else val = v + paeth(left, up, ul)
      out[idx] = val & 0xff
    }
  }
  return { w, h, px: out }
}

// ---------------------------------------------------------------- пикселизация

function pixelize(img, target) {
  const cell = Math.max(1, Math.round(Math.max(img.w, img.h) / target))
  const gw = Math.max(1, Math.round(img.w / cell))
  const gh = Math.max(1, Math.round(img.h / cell))
  const grid = new Array(gw * gh)
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const rs = [], gs = [], bs = []
      let opaque = 0
      let total = 0
      for (let y = gy * cell; y < (gy + 1) * cell && y < img.h; y++) {
        for (let x = gx * cell; x < (gx + 1) * cell && x < img.w; x++) {
          const i = (y * img.w + x) * 4
          total++
          if (img.px[i + 3] >= 128) {
            opaque++
            rs.push(img.px[i])
            gs.push(img.px[i + 1])
            bs.push(img.px[i + 2])
          }
        }
      }
      const median = (arr) => {
        arr.sort((a, b) => a - b)
        return arr[arr.length >> 1]
      }
      grid[gy * gw + gx] =
        opaque / Math.max(1, total) >= 0.5 && opaque > 0
          ? [median(rs), median(gs), median(bs), 255]
          : [0, 0, 0, 0]
    }
  }
  return { gw, gh, grid, cell }
}

// -------------------------------------------------------------- поиск рта

// связные кластеры «лососевых» клеток (открытый рот с языком, r≥225).
// нос того же оттенка лежит выше (y≈31) и уши содержат похожий розовый —
// берём только кластеры НИЖЕ мордовой линии y≥34, из них крупнейший.
const isMouthColor = ([r, g, b, a]) =>
  a > 0 && r >= 225 && g >= 85 && g <= 140 && b >= 80 && b <= 140

function findMouth(q) {
  const { gw, gh, grid } = q
  const seen = new Uint8Array(gw * gh)
  let best = null
  for (let i = 0; i < grid.length; i++) {
    if (seen[i] || !isMouthColor(grid[i])) continue
    const stack = [i]
    seen[i] = 1
    const cells = []
    while (stack.length) {
      const c = stack.pop()
      cells.push(c)
      const x = c % gw
      const y = (c / gw) | 0
      const push = (nx, ny) => {
        const n = ny * gw + nx
        if (!seen[n] && isMouthColor(grid[n])) {
          seen[n] = 1
          stack.push(n)
        }
      }
      if (x > 0) push(x - 1, y)
      if (x < gw - 1) push(x + 1, y)
      if (y > 0) push(x, y - 1)
      if (y < gh - 1) push(x, y + 1)
    }
    const minY = Math.min(...cells.map((c) => (c / gw) | 0))
    if (minY < 34) continue // нос или внутренность ушей — не рот
    if (!best || cells.length > best.cells.length) best = { cells }
  }
  if (!best || best.cells.length < 3) throw new Error('лососевый кластер рта не найден')
  let minX = gw, maxX = 0, minY = 1e9, maxY = 0
  for (const c of best.cells) {
    const x = c % gw
    const y = (c / gw) | 0
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { minX, minY, maxX, maxY, count: best.cells.length }
}

// ------------------------------------------------ кадр «рот закрыт»

function makeClosed(q, mouth, outlineColor) {
  const { gw, grid } = q
  const next = grid.map((c) => [...c])
  const x0 = Math.max(0, mouth.minX - 1)
  const x1 = Math.min(gw - 1, mouth.maxX + 1)
  const y0 = Math.max(0, mouth.minY - 1)
  const y1 = Math.min(Math.round(grid.length / gw) - 1, mouth.maxY + 2) // вниз + язык

  // цвет морды: самый частый в полосе над ртом (лососевые клетки носа не считаем)
  const freq = new Map()
  for (let y = Math.max(0, y0 - 5); y < y0; y++) {
    for (let x = x0; x <= x1; x++) {
      const c = grid[y * gw + x]
      if (c[3] > 0 && !isMouthColor(c)) {
        const k = c.join(',')
        freq.set(k, (freq.get(k) ?? 0) + 1)
      }
    }
  }
  const furKey = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0]
  const fur = furKey.split(',').map(Number)
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const [r, g, b, a] = grid[y * gw + x]
      // не затираем контурные клетки по краю — они образуют обводку морды
      const isOutline = a > 0 && r < 70 && g < 70 && b < 100
      if (!isOutline) next[y * gw + x] = [...fur, 255]
    }
  }
  // линия закрытого рта: прямая с опущенными уголками
  const cx = Math.round((mouth.minX + mouth.maxX) / 2)
  const width = Math.max(3, Math.round((mouth.maxX - mouth.minX + 1) * 0.7))
  const ly = y0 + Math.max(1, Math.round((y1 - y0) * 0.35))
  const half = Math.floor((width - 1) / 2)
  for (let dx = -half; dx <= half; dx++) {
    next[ly * gw + cx + dx] = [...outlineColor, 255]
  }
  next[(ly + 1) * gw + cx - half] = [...outlineColor, 255]
  next[(ly + 1) * gw + cx + half] = [...outlineColor, 255]
  return { grid: next, fur }
}

function dominantOutline(q) {
  const freq = new Map()
  for (const [r, g, b, a] of q.grid) {
    if (a > 0 && r < 60 && g < 60 && b < 90) {
      const k = `${r},${g},${b}`
      freq.set(k, (freq.get(k) ?? 0) + 1)
    }
  }
  const key = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0]
  return key.split(',').map(Number)
}

// --------------------------------------------------------------- кодирование

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function encodePng(gw, gh, grid) {
  const raw = Buffer.alloc(gh * (1 + gw * 4))
  let p = 0
  for (let y = 0; y < gh; y++) {
    raw[p++] = 0 // filter none
    for (let x = 0; x < gw; x++) {
      const [r, g, b, a] = grid[y * gw + x]
      raw[p++] = r; raw[p++] = g; raw[p++] = b; raw[p++] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(gw, 0)
  ihdr.writeUInt32BE(gh, 4)
  ihdr[8] = 8; ihdr[9] = 6
  const chunk = (type, data) => {
    const head = Buffer.from(type, 'ascii')
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([head, data])))
    return Buffer.concat([len, head, data, crc])
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ------------------------------------------------------------ отладка

function debugSheet(q, closed, scale = 6) {
  const { gw, gh } = q
  const pad = 2
  const w = (gw * 2 + pad * 3) * scale
  const h = (gh + pad * 2) * scale
  const grid = []
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cx = Math.floor(x / scale)
      const cy = Math.floor(y / scale)
      let c = (cx + cy) % 2 === 0 ? [70, 60, 90, 255] : [46, 38, 64, 255]
      const inA = cx >= pad && cx < pad + gw && cy >= pad && cy < pad + gh
      const inB = cx >= pad * 2 + gw && cx < pad * 2 + gw * 2 && cy >= pad && cy < pad + gh
      if (inA) {
        const s = q.grid[(cy - pad) * gw + (cx - pad)]
        if (s[3] > 0) c = s
      } else if (inB) {
        const s = closed[(cy - pad) * gw + (cx - pad - gw - pad)]
        if (s[3] > 0) c = s
      }
      grid.push([...c, 255])
    }
  }
  return encodePng(w, h, grid)
}

// ------------------------------------------------------------------ запуск

const img = parsePng(SRC)
const q = pixelize(img, TARGET)
const unique = new Set(q.grid.filter((c) => c[3] > 0).map((c) => c.join(','))).size
const corner = q.grid[0]
console.log(`исходник ${img.w}×${img.h} → сетка ${q.gw}×${q.gh} (клетка ${q.cell}px), уникальных цветов ${unique}, угол rgba(${corner.join(',')})`)

const mouth = findMouth(q)
console.log(`рот: клетки x ${mouth.minX}..${mouth.maxX}, y ${mouth.minY}..${mouth.maxY} (${mouth.count} шт.)`)

const outline = dominantOutline(q)
const closed = makeClosed(q, mouth, outline)
console.log(`цвет контура rgb(${outline.join(',')}), цвет морды rgb(${closed.fur.join(',')})`)

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(`${OUT_DIR}mascot-open.png`, encodePng(q.gw, q.gh, q.grid))
writeFileSync(`${OUT_DIR}mascot-closed.png`, encodePng(q.gw, q.gh, closed.grid))
writeFileSync('/tmp/mascot-debug.png', debugSheet(q, closed.grid))
console.log('готово: src/assets/mascot/{mascot-open,mascot-closed}.png + /tmp/mascot-debug.png (слева открыт, справа закрыт)')
