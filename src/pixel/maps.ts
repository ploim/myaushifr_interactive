// Пиксельные карты: символ → цвет по палитре в PixelSprite.
// '.' — прозрачный пиксель. Карты выверены по ASCII-превью (scripts/preview.mjs).

export type PixelMap = readonly string[]
export type PixelPatch = readonly (readonly [number, number, string])[]

/** Палитра маскота (16-бит криптокот). */
export const CAT_PALETTE: Record<string, string> = {
  o: '#12152b', // контур
  d: '#454b85', // тёмная шерсть
  f: '#656cb3', // шерсть
  l: '#c3c7ee', // светлая шерсть (морда, живот)
  e: '#7df9a6', // глаза (неон)
  w: '#f4f6ff', // блик, усы
  p: '#e8788f', // внутренние уши, нос, румянец
  k: '#f2c14e', // бейдж ошейника (золото)
  c: '#62e8d4', // «код» над головой (циан)
  r: '#ff5d6e', // тревога
}

/** Базовый кот 20×18: сидит, глаза открыты. */
export const CAT_IDLE: PixelMap = [
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

/** Кадр моргания (анимация idle). */
export const CAT_BLINK: PixelPatch = [
  [6, 6, 'f'], [7, 6, 'f'], [12, 6, 'f'], [13, 6, 'f'],
  [6, 7, 'd'], [7, 7, 'd'], [12, 7, 'd'], [13, 7, 'd'],
]

/** Радость: прищур, открытая улыбка, румянец, искры. */
export const CAT_HAPPY: PixelPatch = [
  [6, 6, 'e'], [7, 6, 'f'], [12, 6, 'e'], [13, 6, 'f'],
  [6, 7, 'f'], [7, 7, 'e'], [12, 7, 'f'], [13, 7, 'e'],
  [9, 9, 'p'], [10, 9, 'p'],
  [5, 8, 'p'], [14, 8, 'p'],
  [9, 0, 'w'], [11, 0, 'c'],
]

/** Анализ: прищур-фокус и пиксели сканирования над головой. */
export const CAT_ANALYZE: PixelPatch = [
  [6, 7, 'f'], [7, 7, 'f'], [12, 7, 'f'], [13, 7, 'f'],
  [8, 0, 'c'], [10, 0, 'e'], [12, 0, 'c'],
]

/** Тревога: «!», распахнутые глаза, открытый рот. */
export const CAT_ALARM: PixelPatch = [
  [9, 0, 'r'], [10, 0, 'r'], [9, 1, 'r'], [10, 1, 'r'],
  [9, 2, 'r'], [10, 2, 'r'],
  [6, 6, 'w'], [7, 6, 'w'], [12, 6, 'w'], [13, 6, 'w'],
  [9, 9, 'o'], [10, 9, 'o'],
]

/** Иконки узлов конвейера, 12×12. Раскрашиваются CSS-переменными по состоянию узла. */
export const ICON_PALETTE: Record<string, string> = {
  o: 'var(--px-o)',
  f: 'var(--px-f)',
  e: 'var(--px-e)',
  w: 'var(--px-w)',
  k: 'var(--px-k)',
}

export const ICON_MONITOR: PixelMap = [
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

export const ICON_GLOBE: PixelMap = [
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

export const ICON_SHIELD: PixelMap = [
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

export const ICON_MAGNIFIER: PixelMap = [
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

export const ICON_FLASK: PixelMap = [
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

export const ICON_ENVELOPE: PixelMap = [
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

/** Конверт-спрайт на треке, 12×8. */
export const LETTER_PALETTE: Record<string, string> = {
  o: '#12152b',
  w: '#f4f6ff',
  d: '#9aa3d8',
  c: '#62e8d4',
  k: '#f2c14e',
  r: '#ff5d6e',
}

export const LETTER: PixelMap = [
  '..oooooooo..',
  '.ocwwwwwwwo.',
  '.owdwwwwdwo.',
  '.owwdwwdwwo.',
  '.owwwddwwwo.',
  '.owwwwwwwwo.',
  '..oooooooo..',
  '............',
]

/** Конверт под арестом: замок поверх. */
export const LETTER_LOCKED: PixelPatch = [
  [4, 2, 'o'], [5, 2, 'o'], [6, 2, 'o'], [7, 2, 'o'],
  [4, 3, 'o'], [5, 3, 'k'], [6, 3, 'k'], [7, 3, 'o'],
  [4, 4, 'o'], [5, 4, 'k'], [6, 4, 'k'], [7, 4, 'o'],
  [4, 5, 'o'], [5, 5, 'k'], [6, 5, 'k'], [7, 5, 'o'],
]

/** Применяет точечный патч к карте (возвращает новую карту). */
export function applyPatch(map: PixelMap, patch: PixelPatch): PixelMap {
  const rows = [...map]
  for (const [x, y, ch] of patch) {
    rows[y] = rows[y].slice(0, x) + ch + rows[y].slice(x + 1)
  }
  return rows
}
