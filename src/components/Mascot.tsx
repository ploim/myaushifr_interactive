import { PixelSprite } from '../pixel/PixelSprite'
import {
  applyPatch,
  CAT_ALARM,
  CAT_ANALYZE,
  CAT_BLINK,
  CAT_HAPPY,
  CAT_IDLE,
  CAT_PALETTE,
} from '../pixel/maps'
import type { Mood } from '../data/scenarios'
import type { CSSProperties } from 'react'

const MOOD_PATCH = {
  idle: null,
  happy: CAT_HAPPY,
  analyze: CAT_ANALYZE,
  alarm: CAT_ALARM,
} as const

const MOOD_ALT: Record<Mood, string> = {
  idle: 'Криптокот Мяушифр сидит и наблюдает',
  happy: 'Криптокот Мяушифр радуется: прищур, улыбка, искры',
  analyze: 'Криптокот Мяушифр анализирует: прищур и пиксели сканирования над головой',
  alarm: 'Криптокот Мяушифр в тревоге: восклицательный знак над головой',
}

interface MascotProps {
  mood: Mood
  size?: number
  className?: string
  style?: CSSProperties
}

/** Пиксельный криптокот. В покое медленно моргает (отключается при reduced motion). */
export function Mascot({ mood, size = 180, className, style }: MascotProps) {
  const patch = MOOD_PATCH[mood]
  const open = patch ? applyPatch(CAT_IDLE, patch) : CAT_IDLE
  const blinks = mood === 'idle' || mood === 'analyze'
  return (
    <div className={`mascot mascot--${mood}${className ? ` ${className}` : ''}`} style={style}>
      <PixelSprite
        map={open}
        palette={CAT_PALETTE}
        title={MOOD_ALT[mood]}
        className="mascot__sprite mascot__sprite--open"
        style={{ width: size, height: 'auto' }}
      />
      {blinks && (
        <PixelSprite
          map={applyPatch(open, CAT_BLINK)}
          palette={CAT_PALETTE}
          className="mascot__sprite mascot__sprite--blink"
          style={{ width: size, height: 'auto' }}
        />
      )}
    </div>
  )
}
