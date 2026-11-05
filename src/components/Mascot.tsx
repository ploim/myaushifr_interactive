import closedSrc from '../assets/mascot/mascot-closed.png'
import openSrc from '../assets/mascot/mascot-open.png'
import { PixelSprite } from '../pixel/PixelSprite'
import { BADGE_ALARM, BADGE_HAPPY, BADGE_PALETTE, ICON_MAGNIFIER } from '../pixel/maps'
import type { Mood } from '../data/scenarios'
import type { CSSProperties } from 'react'

// Значки настроений поверх фото-маскота: сам PNG один, настроение — бейджем.
const MOOD_BADGE = {
  idle: null,
  happy: BADGE_HAPPY,
  analyze: ICON_MAGNIFIER,
  alarm: BADGE_ALARM,
} as const

const MOOD_ALT: Record<Mood, string> = {
  idle: 'Кот-защитник Мяушифр со щитом стоит и наблюдает',
  happy: 'Кот-защитник Мяушифр радуется — над головой искры',
  analyze: 'Кот-защитник Мяушифр анализирует — рядом лупа',
  alarm: 'Кот-защитник Мяушифр в тревоге — рядом восклицательный знак',
}

interface MascotProps {
  mood?: Mood
  /** Говорит: рот открывается в такт печати реплики (mouth-flap). */
  talking?: boolean
  size?: number
  className?: string
  style?: CSSProperties
}

/** Маскот из PNG-спрайтов (пикселизация исходной картинки).
 *  В покое рот закрыт; при talking чередует кадры «открыт/закрыт»
 *  с резкими пиксельными переключениями. Глобальный prefers-reduced-motion
 *  гасит анимацию, а хук печати и вовсе не включает talking. */
export function Mascot({ mood = 'idle', talking = false, size = 180, className, style }: MascotProps) {
  const badge = MOOD_BADGE[mood]
  const cls = ['mascot', `mascot--${mood}`, talking ? 'mascot--talking' : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <span className={cls} style={{ width: size, ...style }}>
      {/* базовый кадр задаёт размер и alt; открытый рот — накладной */}
      <img className="mascot__frame mascot__frame--closed" src={closedSrc} alt={MOOD_ALT[mood]} />
      <img className="mascot__frame mascot__frame--open" src={openSrc} alt="" aria-hidden="true" />
      {badge && (
        <span className="mascot__badge-wrap" aria-hidden="true">
          <PixelSprite map={badge} palette={BADGE_PALETTE} className="mascot__badge" />
        </span>
      )}
    </span>
  )
}
