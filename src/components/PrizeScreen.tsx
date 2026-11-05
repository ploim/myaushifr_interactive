import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { GIFT, GIFT_PALETTE } from '../pixel/maps'
import { SpeakingMascot } from './SpeakingMascot'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const SPARK_COLORS = ['#59e3e0', '#f2c14e', '#ff5d6e', '#4ee58a', '#8d8ef0', '#ffffff', '#ff9f43', '#ff8ccf'] as const
const SPARK_SHAPES = ['sq', 'plus', 'mini'] as const
const BURST_LIFETIME = 2000
const BURST_INTERVAL = 850

type SparkShape = (typeof SPARK_SHAPES)[number]

interface Spark {
  left: number
  tx: number
  ty: number
  color: string
  delay: number
  size: number
  shape: SparkShape
}

interface Burst {
  id: number
  sparks: Spark[]
}

interface PrizeScreenProps {
  onBack: () => void
}

/** Финал приключения: поздравление, пиксельные салюты и призовое
 *  сообщение для ведущего. */
export function PrizeScreen({ onBack }: PrizeScreenProps) {
  const [claimed, setClaimed] = useState(false)
  const [bursts, setBursts] = useState<Burst[]>([])
  const modalRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef(0)
  const timeoutsRef = useRef<number[]>([])
  const reducedMotion = usePrefersReducedMotion()

  // Фокус внутрь модалки, чтобы скринридер озвучил призовое сообщение
  useEffect(() => {
    if (claimed) modalRef.current?.focus()
  }, [claimed])

  // Салюты продолжаются, пока открыта модалка: залп за залпом из случайной
  // точки внизу. При reduced-motion залпы не спавним — анимация всё равно
  // заморожена глобальным CSS.
  useEffect(() => {
    if (!claimed || reducedMotion) return

    const spawn = () => {
      const id = seqRef.current + 1
      seqRef.current = id
      const origin = 6 + Math.random() * 88
      const count = 22 + Math.floor(Math.random() * 12)
      const sparks: Spark[] = Array.from({ length: count }, () => {
        const angle = (Math.random() - 0.5) * 2.4 // ±69° от вертикали
        const dist = 180 + Math.random() * 320
        return {
          left: Math.round(origin + (Math.random() - 0.5) * 10),
          tx: Math.round(Math.sin(angle) * dist),
          ty: -Math.round(80 + Math.cos(angle) * dist * 0.9),
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          delay: Math.round(Math.random() * 35) / 100,
          size: 6 + Math.floor(Math.random() * 4) * 3,
          shape: SPARK_SHAPES[Math.floor(Math.random() * SPARK_SHAPES.length)],
        }
      })
      setBursts((prev) => [...prev, { id, sparks }])
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setBursts((prev) => prev.filter((burst) => burst.id !== id))
        }, BURST_LIFETIME),
      )
    }

    spawn()
    const timer = window.setInterval(spawn, BURST_INTERVAL)
    return () => {
      window.clearInterval(timer)
      timeoutsRef.current.forEach((t) => window.clearTimeout(t))
      timeoutsRef.current = []
      setBursts([])
    }
  }, [claimed, reducedMotion])

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
        overlay={<PixelSprite map={GIFT} palette={GIFT_PALETTE} className="speaker-overlay--gift" />}
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
          {/* пиксельные салюты: залпы из низа экрана, залп за залпом,
              пока модалка открыта */}
          <div className="salute" aria-hidden="true">
            {bursts.map((burst) =>
              burst.sparks.map((spark, i) => (
                <span
                  key={`${burst.id}-${i}`}
                  className="salute__spark"
                  style={
                    {
                      left: `${spark.left}%`,
                      animationDelay: `${spark.delay}s`,
                      '--tx': `${spark.tx}px`,
                      '--ty': `${spark.ty}px`,
                    } as CSSProperties
                  }
                >
                  <span
                    className={`salute__shape salute__shape--${spark.shape}`}
                    style={{ width: spark.size, height: spark.size, '--spark-color': spark.color } as CSSProperties}
                  />
                </span>
              )),
            )}
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
              <button type="button" className="btn btn--primary btn--pixel" onClick={onBack}>
                Назад к сценариям
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
