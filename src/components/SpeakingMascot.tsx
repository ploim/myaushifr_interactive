import { Mascot } from './Mascot'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useTypewriter } from '../hooks/useTypewriter'
import type { Mood } from '../data/scenarios'
import type { ReactNode } from 'react'

interface SpeakingMascotProps {
  mood?: Mood
  quote: string
  size?: number
  /** Декор поверх кота (колпак, подарок): абсолют поверх PNG. */
  overlay?: ReactNode
  /** Класс-модификатор для точечной стилизации на конкретном экране. */
  className?: string
}

/** Мяушифр говорит вне сценария: реплика печатается по буквам,
 *  рот открывается в такт печати — как в прогонах сценариев. */
export function SpeakingMascot({
  mood = 'idle',
  quote,
  size = 170,
  overlay,
  className,
}: SpeakingMascotProps) {
  const reducedMotion = usePrefersReducedMotion()
  const typing = useTypewriter(quote, !reducedMotion)
  const talking = !typing.done

  return (
    <div className={`speaker${className ? ` ${className}` : ''}`}>
      <div className="bubble speaker__bubble">
        <p className="bubble__text" aria-hidden="true">
          «{typing.shown}»
          {!typing.done && <span className="bubble__caret" />}
        </p>
        {/* полный текст — сразу, посимвольная печать озвучке мешает */}
        <p className="visually-hidden">«{quote}»</p>
      </div>
      <div className="speaker__catwrap">
        <div className="speaker__cat">
          <Mascot mood={mood} talking={talking} size={size} />
          {overlay && (
            <div className="speaker__overlay" aria-hidden="true">
              {overlay}
            </div>
          )}
        </div>
        <p className="speaker__name px-text">Мяушифр</p>
      </div>
    </div>
  )
}
