// ASCII-превью пиксельных карт (спрайты кота, иконки узлов, конверт).
// Запуск: node scripts/preview.mjs
const GLYPHS = {
  '.': ' ', o: '#', f: '%', d: '+', l: '-', e: 'O', w: '*', p: 'o', k: '$', c: '@', r: '!',
}

function show(title, rows) {
  const w = Math.max(...rows.map((r) => r.length))
  const bad = rows.filter((r) => r.length !== w)
  console.log(`\n=== ${title} (${w}x${rows.length})${bad.length ? `  !!! строк не той длины: ${bad.length}` : ''}`)
  console.log(rows.map((r) => r.split('').map((ch) => GLYPHS[ch] ?? '?').join('')).join('\n'))
}

function applyPatch(rows, patch) {
  const next = [...rows]
  for (const [x, y, ch] of patch) {
    next[y] = next[y].slice(0, x) + ch + next[y].slice(x + 1)
  }
  return next
}

// ---------------- Кот 20x18 ----------------
const CAT_IDLE = [
  '....oo........oo....',
  '...oppo......oppo...',
  '...offo......offo...',
  '..offffooooooffffo..',
  '..offffffffffffffo..',
  '..offffffffffffffo..',
  '..offfweffffwefffo..',
  '..offfeeffffeefffo..',
  '.woffffffppffffffow.',
  '.woffflldlldllfffow.',
  '..offfllllllllfffo..',
  '...oddddddddddddo...',
  '...offfffkkfffffoo..',
  '...offffllllffffofo.',
  '...offffllllffffofo.',
  '...ofllllddllllfofo.',
  '...oooooooooooooofo.',
  '....................',
]

const CAT_BLINK = [
  [6, 6, 'f'], [7, 6, 'f'], [12, 6, 'f'], [13, 6, 'f'],
  [6, 7, 'd'], [7, 7, 'd'], [12, 7, 'd'], [13, 7, 'd'],
]

const CAT_HAPPY = [
  [6, 6, 'e'], [7, 6, 'f'], [12, 6, 'e'], [13, 6, 'f'],
  [6, 7, 'f'], [7, 7, 'e'], [12, 7, 'f'], [13, 7, 'e'],
  [9, 9, 'p'], [10, 9, 'p'],
  [5, 8, 'p'], [14, 8, 'p'],
  [9, 0, 'w'], [11, 0, 'c'],
]

const CAT_ANALYZE = [
  [6, 7, 'f'], [7, 7, 'f'], [12, 7, 'f'], [13, 7, 'f'],
  [8, 0, 'c'], [10, 0, 'e'], [12, 0, 'c'],
]

const CAT_ALARM = [
  [9, 0, 'r'], [10, 0, 'r'], [9, 1, 'r'], [10, 1, 'r'],
  [9, 2, 'r'], [10, 2, 'r'],
  [6, 6, 'w'], [7, 6, 'w'], [12, 6, 'w'], [13, 6, 'w'],
  [9, 9, 'o'], [10, 9, 'o'],
]

show('CAT idle', CAT_IDLE)
show('CAT blink', applyPatch(CAT_IDLE, CAT_BLINK))
show('CAT happy', applyPatch(CAT_IDLE, CAT_HAPPY))
show('CAT analyze', applyPatch(CAT_IDLE, CAT_ANALYZE))
show('CAT alarm', applyPatch(CAT_IDLE, CAT_ALARM))

// ---------------- Иконки узлов 12x12 ----------------
const ICON_MONITOR = [
  '..oooooooo..',
  '.offffffffo.',
  '.offeeffffo.',
  '.offffffffo.',
  '.offffffffo.',
  '.oooooooooo.',
  '.....oo.....',
  '.....oo.....',
  '..oooooooo..',
  '............',
  '............',
  '............',
]

const ICON_GLOBE = [
  '...oooooo...',
  '..o......o..',
  '.o...oo...o.',
  '.o...oo...o.',
  '.oooooooooo.',
  '.o...oo...o.',
  '.o...oo...o.',
  '..o......o..',
  '...oooooo...',
  '............',
  '............',
  '............',
]

const ICON_SHIELD = [
  '.oooooooooo.',
  '.offffffffo.',
  '.offfeefffo.',
  '.offfeefffo.',
  '.offffffffo.',
  '..offffffo..',
  '..offffffo..',
  '...offffo...',
  '....offo....',
  '.....oo.....',
  '............',
  '............',
]

const ICON_MAGNIFIER = [
  '..oooo......',
  '.offffo.....',
  'offefffo....',
  'offefffo....',
  '.offffo.....',
  '..oooo......',
  '......oo....',
  '.......oo...',
  '........oo..',
  '.........oo.',
  '............',
  '............',
]

const ICON_FLASK = [
  '...ooooo....',
  '....o.o.....',
  '....o.o.....',
  '...o...o....',
  '..o.....o...',
  '..o.....o...',
  '.oeeeeeeeo..',
  '.oeeeeeeeo..',
  '.oeewceeeo..',
  '.ooooooooo..',
  '............',
  '............',
]

const ICON_ENVELOPE = [
  '............',
  '..oooooooo..',
  '.owwwwwwwwo.',
  '.owdwwwwdwo.',
  '.owwdwwdwwo.',
  '.owwwddwwwo.',
  '.owwwwwwwwo.',
  '.owwwwwwwwo.',
  '..oooooooo..',
  '............',
  '............',
  '............',
]

show('ICON monitor', ICON_MONITOR)
show('ICON globe', ICON_GLOBE)
show('ICON shield', ICON_SHIELD)
show('ICON magnifier', ICON_MAGNIFIER)
show('ICON flask', ICON_FLASK)
show('ICON envelope', ICON_ENVELOPE)

// ---------------- Конверт на треке 12x8 ----------------
const LETTER = [
  '..oooooooo..',
  '.ocwwwwwwwo.',
  '.owdwwwwdwo.',
  '.owwdwwdwwo.',
  '.owwwddwwwo.',
  '.owwwwwwwwo.',
  '..oooooooo..',
  '............',
]

const LETTER_LOCKED = [
  [4, 2, 'o'], [5, 2, 'o'], [6, 2, 'o'], [7, 2, 'o'],
  [4, 3, 'o'], [5, 3, 'k'], [6, 3, 'k'], [7, 3, 'o'],
  [4, 4, 'o'], [5, 4, 'k'], [6, 4, 'k'], [7, 4, 'o'],
  [4, 5, 'o'], [5, 5, 'k'], [6, 5, 'k'], [7, 5, 'o'],
]

show('LETTER', LETTER)
show('LETTER locked', applyPatch(LETTER, LETTER_LOCKED))
