// Пиксельные карты: символ → цвет по палитре в PixelSprite.
// '.' — прозрачный пиксель. Карты выверены по ASCII-превью (scripts/preview.mjs).
// Сам маскот — PNG-спрайты из src/assets/mascot/ (генератор scripts/mascot-frames.mjs);
// карты здесь — только значки и пиктограммы.

export type PixelMap = readonly string[]
export type PixelPatch = readonly (readonly [number, number, string])[]

/** Палитра значков настроений маскота (поверх PNG-спрайта). */
export const BADGE_PALETTE: Record<string, string> = {
  o: 'var(--px-o)', // контур
  f: 'var(--px-w)', // плашка
  e: 'var(--cyan)', // блик
  r: 'var(--red)', // тревога
  k: 'var(--gold)', // искры
}

/** Тревога: кружок с «!». 10×10. */
export const BADGE_ALARM: PixelMap = [
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

/** Радость: золотые искры. 10×10. */
export const BADGE_HAPPY: PixelMap = [
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
