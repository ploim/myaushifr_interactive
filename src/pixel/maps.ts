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

/** Сотрудник: голова и плечи. 12×12. */
export const ICON_USER: PixelMap = [
  '............',
  '....oooo....',
  '...offffo...',
  '...ofeffo...',
  '...offffo...',
  '....oooo....',
  '..oooooooo..',
  '.offffffffo.',
  '.offkffkffo.',
  '.offffffffo.',
  '..oooooooo..',
  '............',
]

/** EDR: щит с глазом — наблюдение за конечной точкой. 12×12. */
export const ICON_EDR: PixelMap = [
  '.oooooooooo.',
  '.offffffffo.',
  '.offwwwwffo.',
  '.offwffwffo.',
  '.offwwwwffo.',
  '.offffffffo.',
  '..offffffo..',
  '..offffffo..',
  '...offffo...',
  '....offo....',
  '.....oo.....',
  '............',
]

/** Сервер: стойка с прорезями и индикаторами. 12×12. */
export const ICON_SERVER: PixelMap = [
  '..oooooooo..',
  '.owwwwwwwwo.',
  '.owfwwwwfwo.',
  '.oewwwwwweo.',
  '..oooooooo..',
  '..oooooooo..',
  '.owwwwwwwwo.',
  '.owfwwwwfwo.',
  '.owwwwwwwwo.',
  '.oewwwwwweo.',
  '..oooooooo..',
  '............',
]

/** Радар-прицел: круг с перекрестием. 12×12. */
export const ICON_RADAR: PixelMap = [
  '............',
  '....oooo....',
  '..oo....oo..',
  '.o........o.',
  '.o...ee...o.',
  'oo...ee...oo',
  'oo........oo',
  '.o........o.',
  '..oo....oo..',
  '....oooo....',
  '.....oo.....',
  '............',
]

/** Межсетевой экран: кирпичная кладка. 12×12. */
export const ICON_WALL: PixelMap = [
  'oooooooooooo',
  'offfofffofff',
  'offfofffofff',
  'oooooooooooo',
  'ffofffofffof',
  'ffofffofffof',
  'oooooooooooo',
  'offfofffofff',
  'offfofffofff',
  'oooooooooooo',
  'ffofffofffof',
  'ffofffofffof',
]

/** Чип: процессор с ногами — рабочая станция / сегмент сети. 12×12. */
export const ICON_CHIP: PixelMap = [
  '............',
  '...o....o...',
  '..oooooooo..',
  '.ooffffffoo.',
  '.oofeffefoo.',
  '.oofeffefoo.',
  '.ooffffffoo.',
  '.ooffffffoo.',
  '..oooooooo..',
  '...o....o...',
  '...o....o...',
  '............',
]

/** Глаз: наблюдение SOC. 12×12. */
export const ICON_EYE: PixelMap = [
  '............',
  '............',
  '............',
  '...oooooo...',
  '..offffffo..',
  '.offfeefffo.',
  '.offfeefffo.',
  '..offffffo..',
  '...oooooo...',
  '............',
  '............',
  '............',
]

/** Воронка: DLP просеивает потоки данных. 12×12. */
export const ICON_FUNNEL: PixelMap = [
  '............',
  '.oooooooooo.',
  '.offeeffffo.',
  '..offeeffo..',
  '...offffo...',
  '....offo....',
  '.....oo.....',
  '.....oo.....',
  '.....oo.....',
  '............',
  '............',
  '............',
]

/** Ключ: точка входа с аутентификацией. 12×12. */
export const ICON_KEY: PixelMap = [
  '............',
  '............',
  '............',
  '..oooo......',
  '.offffo.....',
  '.offffoooooo',
  '.offffo.o.o.',
  '..oooo..o.o.',
  '............',
  '............',
  '............',
  '............',
]

/** График: рост и всплески — анализ аномалий. 12×12. */
export const ICON_CHART: PixelMap = [
  '............',
  '........ee..',
  '........ff..',
  '........ff..',
  '.....ee.ff..',
  '.....ff.ff..',
  '.....ff.ff..',
  '..ee.ff.ff..',
  '..ff.ff.ff..',
  '..ff.ff.ff..',
  '............',
  '............',
]

/** Замок: блокировка / ликвидация. 12×12. */
export const ICON_LOCK: PixelMap = [
  '............',
  '....oooo....',
  '...o....o...',
  '...o....o...',
  '..oooooooo..',
  '.offffffffo.',
  '.offfkkfffo.',
  '.offfkkfffo.',
  '.offffffffo.',
  '..oooooooo..',
  '............',
  '............',
]

/** Телефон: MFA и вторые факторы. 12×12. */
export const ICON_PHONE: PixelMap = [
  '...oooooo...',
  '...offffo...',
  '...owwwwo...',
  '...owwwwo...',
  '...owwwwo...',
  '...owwwwo...',
  '...offffo...',
  '...offffo...',
  '...ofeffo...',
  '...offffo...',
  '...oooooo...',
  '............',
]

/** Сейф: хранилище привилегированных доступов (PAM). 12×12. */
export const ICON_VAULT: PixelMap = [
  '............',
  '..oooooooo..',
  '.offffffffo.',
  '.offeeeeffo.',
  '.offeekkffo.',
  '.offeekkffo.',
  '.offeeeeffo.',
  '.offffffffo.',
  '..oooooooo..',
  '............',
  '............',
  '............',
]

/** Удостоверение: каталог учётных записей (IAM). 12×12. */
export const ICON_IDCARD: PixelMap = [
  '............',
  'oooooooooooo',
  'ofeeefwwwwfo',
  'ofeeefwwwwfo',
  'ofeeefwwwwfo',
  'offffffffffo',
  'ofwwwwwwwwfo',
  'offffffffffo',
  'oooooooooooo',
  '............',
  '............',
  '............',
]

/** Волны трафика: сенсор NDR слушает сеть. 12×12. */
export const ICON_WAVES: PixelMap = [
  '............',
  '............',
  '.ee..ee..ee.',
  '..........o.',
  '.ww..ww..woo',
  '..........o.',
  '.ee..ee..ee.',
  '............',
  '............',
  '............',
  '............',
  '............',
]

/** Кодовые скобки: WAF бережёт веб-приложения. 12×12. */
export const ICON_CODE: PixelMap = [
  '............',
  '............',
  '..o......o..',
  '.o.o....o.o.',
  '..oo....oo..',
  '...o.ee.o...',
  '..oo....oo..',
  '.o.o....o.o.',
  '..o......o..',
  '............',
  '............',
  '............',
]

/** Горшок мёда: honeypot-ловушка. 12×12. */
export const ICON_HONEYPOT: PixelMap = [
  '...oooooo...',
  '..ooffffoo..',
  '.oooooooooo.',
  '.offffffffo.',
  '.offeeeeffo.',
  '.offeeeeffo.',
  '.offeeeeffo.',
  '..offffffo..',
  '...oooooo...',
  '............',
  '............',
  '............',
]

/** Шестерёнка: оркестрация и автоматизация (SOAR). 12×12. */
export const ICON_GEAR: PixelMap = [
  '............',
  '...oo..oo...',
  '..oooooooo..',
  '.ooffffffoo.',
  'oofffeefffoo',
  'oofffeefffoo',
  '.ooffffffoo.',
  '..oooooooo..',
  '...oo..oo...',
  '............',
  '............',
  '............',
]

/** Граф связей: корреляция событий (XDR). 12×12. */
export const ICON_GRAPH: PixelMap = [
  '............',
  '....oooo....',
  '...offffo...',
  '...offffo...',
  '....oooo....',
  '...e....e...',
  '..e......e..',
  '.oooo..oooo.',
  '.offo..offo.',
  '.oooo..oooo.',
  '............',
  '............',
]

/** Палитра маркеров на треке, 12×8. */
export const MARKER_PALETTE: Record<string, string> = {
  o: '#12152b',
  w: '#f4f6ff',
  d: '#9aa3d8',
  c: '#62e8d4',
  k: '#f2c14e',
  r: '#ff5d6e',
}

/** Маркер «письмо» — путь письма по конвейеру. 12×8. */
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

/** Маркер «вредонос» — красный жук. 12×8. */
export const BUG: PixelMap = [
  '............',
  '..o..oo..o..',
  '...oooooo...',
  '..orrrrrro..',
  '.oorrrrrroo.',
  '..orwrrwro..',
  '...oooooo...',
  '..o.o..o.o..',
]

/** Маркер «данные» — документ со строками. 12×8. */
export const FILE: PixelMap = [
  '..oooooooo..',
  '.owwwwwwwwo.',
  '.owddddwwwo.',
  '.owwwwwwwwo.',
  '.owddddddwo.',
  '.owwwwwwwwo.',
  '..oooooooo..',
  '............',
]

/** Маркер «ключ» — украденный секрет доступа (PAM). 12×8. */
export const KEYMARKER: PixelMap = [
  '............',
  '..kkk.......',
  '.k...k......',
  '.k...kkkkkk.',
  '..kkk..k..k.',
  '............',
  '............',
  '............',
]

/** Маркер «пропуск» — учётная запись сотрудника (IAM). 12×8. */
export const CARD: PixelMap = [
  '............',
  '.kkkkkkkkkk.',
  '.kwccwwwwwk.',
  '.kwccwwdwwk.',
  '.kwwwwwwwwk.',
  '.kwddddwwwk.',
  '.kkkkkkkkkk.',
  '............',
]

/** Палитра академического колпака. */
export const CAP_PALETTE: Record<string, string> = {
  b: '#8d8ef0',
  d: '#5658c4',
  g: '#f2c14e',
  w: '#e9ecff',
}

/** Академический колпак для Мяушифра: плоская доска-ромб
 *  со светлой окантовкой, золотой пуговкой и кисточкой на шнурке. 18×7.
 *  Кладётся поверх макушки маскота (см. .speaker-overlay--cap). */
export const CAP: PixelMap = [
  '........gg........',
  '......wwbbww......',
  '....wwbbbbbbww....',
  '..wwbbbbbbbbbbww..',
  '....bbbbbbbbbb.d..',
  '.....dddddddd..d..',
  '.....dddddddd..d..',
  '.....dddddddd.ggg.',
  '.....dddddddd.....',
]

/** Палитра подарка. */
export const GIFT_PALETTE: Record<string, string> = {
  r: '#ff5d6e',
  g: '#f2c14e',
  d: '#3d2447',
  w: '#ffe9ec',
}

/** Сладкий приз Мяушифра: коробка с бантом и золотой лентой. 12×12.
 *  Перекрывает щит в лапе маскота (см. .speaker-overlay--gift). */
export const GIFT: PixelMap = [
  '..gg....gg..',
  '...gggggg...',
  '.dddddddddd.',
  '.drrrrrrrrd.',
  '.dddddddddd.',
  'dddddddddddd',
  'drrrrggrrrrd',
  'drrrrggrrrrd',
  'drrwwggwwrrd',
  'drrrrggrrrrd',
  'drrrrggrrrrd',
  'dddddddddddd',
]

/** Замок поверх любого маркера: объект поимки «под арестом». */
export const MARKER_LOCK: PixelPatch = [
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
