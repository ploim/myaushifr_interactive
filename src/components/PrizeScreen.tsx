import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { SpeakingMascot } from './SpeakingMascot'

const SPARK_COLORS = ['#59e3e0', '#f2c14e', '#ff5d6e', '#4ee58a', '#8d8ef0'] as const
const SPARK_COUNT = 36

interface Spark {
  side: 'left' | 'right'
  tx: number
  ty: number
  color: string
  delay: number
  size: number
}

interface PrizeScreenProps {
  onBack: () => void
}

/** Финал приключения: поздравление, пиксельные салюты и призовое
 *  сообщение для ведущего. */
export function PrizeScreen({ onBack }: PrizeScreenProps) {
  const [claimed, setClaimed] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // параметры разлёта частиц считаем один раз — состав фиксированный
  const sparks = useMemo<Spark[]>(
    () =>
      Array.from({ length: SPARK_COUNT }, (_, i): Spark => {
        const side = i % 2 === 0 ? 'left' : 'right'
        const angle = 0.35 + Math.random() * 0.75 // рад, от вертикали
        const dist = 160 + Math.random() * 260
        const dir = side === 'left' ? 1 : -1
        return {
          side,
          tx: Math.round(dir * Math.sin(angle) * dist),
          ty: -Math.round(60 + Math.cos(angle) * dist),
          color: SPARK_COLORS[i % SPARK_COLORS.length],
          delay: (i % 6) * 0.14,
          size: 8 + (i % 3) * 4,
        }
      }),
    [],
  )

  // фокус внутрь модалки, чтобы скринридер озвучил призовое сообщение
  useEffect(() => {
    if (claimed) modalRef.current?.focus()
  }, [claimed])

  return (
    <div className="prize">
      <header className="prize__hero">
        <p className="prize__eyebrow px-text">Киберприключение пройдено</p>
        <h1 className="prize__title px-text">Сладкий приз!</h1>
        <p className="prize__lead">
          Три сценария позади: атаки отражены, секреты целы. Мяушифр
          поздравляет — и приготовил подарок.
        </p>
      </header>

      <SpeakingMascot
        mood="happy"
        quote="Мяу-мяу! Ты справился: три атаки — как три мыши в зубах! Забирай подарок, ты честно его поймал!"
        size={170}
      />

      <div className="prize__actions">
        {!claimed ? (
          <button type="button" className="btn btn--primary btn--pixel" onClick={() => setClaimed(true)}>
            Забрать подарок
          </button>
        ) : (
          <button type="button" className="btn" onClick={onBack}>
            Вернуться к сценариям
          </button>
        )}
      </div>

      {claimed && (
        <>
          {/* пиксельные салюты: клетки разлетаются из нижних углов прыжками */}
          <div className="salute" aria-hidden="true">
            {sparks.map((spark, i) => (
              <span
                key={i}
                className="salute__spark"
                style={
                  {
                    left: spark.side === 'left' ? '4%' : 'auto',
                    right: spark.side === 'right' ? '4%' : 'auto',
                    width: spark.size,
                    height: spark.size,
                    background: spark.color,
                    animationDelay: `${spark.delay}s`,
                    '--tx': `${spark.tx}px`,
                    '--ty': `${spark.ty}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div
            className="prizemodal"
            role="dialog"
            aria-modal="true"
            aria-label="Призовое сообщение"
            ref={modalRef}
            tabIndex={-1}
          >
            <div className="prizemodal__panel">
              <p className="prizemodal__text px-text">
                Покажи это сообщение ведущему и получи свой приз!
              </p>
              <p className="prizemodal__secret px-text">
                Не забудь посетить тайное собрание Мяушифра!
              </p>
              <button type="button" className="btn btn--primary" onClick={onBack}>
                Весело! К сценариям
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
