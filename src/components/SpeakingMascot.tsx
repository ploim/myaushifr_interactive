import { Mascot } from './Mascot'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useTypewriter } from '../hooks/useTypewriter'
import type { Mood } from '../data/scenarios'

interface SpeakingMascotProps {
  mood?: Mood
  quote: string
  size?: number
}

/** Мяушифр говорит вне сценария: реплика печатается по буквам,
 *  рот открывается в такт печати — как в прогонах сценариев. */
export function SpeakingMascot({ mood = 'idle', quote, size = 170 }: SpeakingMascotProps) {
  const reducedMotion = usePrefersReducedMotion()
  const typing = useTypewriter(quote, !reducedMotion)
  const talking = !typing.done

  return (
    <div className="speaker">
      <div className="bubble speaker__bubble">
        <p className="bubble__text" aria-hidden="true">
          «{typing.shown}»
          {!typing.done && <span className="bubble__caret" />}
        </p>
        {/* полный текст — сразу, посимвольная печать озвучке мешает */}
        <p className="visually-hidden">«{quote}»</p>
      </div>
      <div className="speaker__catwrap">
        <Mascot mood={mood} talking={talking} size={size} />
        <p className="speaker__name px-text">Мяушифр</p>
      </div>
    </div>
  )
}
