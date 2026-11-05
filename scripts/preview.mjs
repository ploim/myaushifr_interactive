// ASCII-превью пиксельных карт (значки настроений, иконки узлов, конверт).
// Сам маскот — PNG-спрайты (scripts/mascot-frames.mjs), тут его нет.
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

// ---------------- Значки настроений маскота 10x10 ----------------
const BADGE_ALARM = [
  '...oooo...',
  '..offffo..',
  '.offffffo.',
  'offfrrfffo',
  'offfrrfffo',
  'offfrrfffo',
  '.offffffo.',
  '..orrrro..',
  '...oooo...',
  '..........',
]

const BADGE_HAPPY = [
  '..........',
  '....k.....',
  '....k.....',
  '..kkkkk...',
  '....k.....',
  '....k.....',
  '.......k..',
  '......kkk.',
  '.......k..',
  '..........',
]

show('BADGE alarm', BADGE_ALARM)
show('BADGE happy', BADGE_HAPPY)

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
