import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Mascot } from './components/Mascot'
import { Controls } from './components/Controls'
import { FinalCard } from './components/FinalCard'
import { PrizeScreen } from './components/PrizeScreen'
import { ScenarioPicker } from './components/ScenarioPicker'
import { ScenePanel } from './components/ScenePanel'
import { StageMap } from './components/StageMap'
import { TheoryScreen } from './components/TheoryScreen'
import { WelcomeScreen } from './components/WelcomeScreen'
import { flatten, type Scenario } from './data/scenarios'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useTypewriter } from './hooks/useTypewriter'

/** Какой экран показывать вне прогона сценария. */
type Screen = 'welcome' | 'theory' | 'picker' | 'prize'

/** Сколько сценариев открывают приз. */
const PRIZE_GOAL = 3
const PROGRESS_KEY = 'meaw-progress'

function loadProgress(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState<string[]>(() => loadProgress())
  const reducedMotion = usePrefersReducedMotion()

  const steps = useMemo(() => (scenario ? flatten(scenario) : []), [scenario])
  const step = steps[index]

  const titleRef = useRef<HTMLHeadingElement | HTMLDivElement>(null)
  const theoryRef = useRef<HTMLDivElement>(null)

  const start = useCallback((next: Scenario) => {
    setScenario(next)
    setIndex(0)
  }, [])

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, steps.length - 1)), [steps.length])
  const back = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])
  const restart = useCallback(() => setIndex(0), [])
  const exit = useCallback(() => {
    setScenario(null)
    setIndex(0)
  }, [])

  // Сценарий считается пройденным, когда игрок дошёл до финальной сцены.
  useEffect(() => {
    if (!step?.scene.finale) return
    const id = step.scenario.id
    setDone((prev) => {
      if (prev.includes(id)) return prev
      const nextDone = [...prev, id]
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(nextDone))
      } catch {
        // localStorage недоступен — прогресс живёт до перезагрузки
      }
      return nextDone
    })
  }, [step])

  // Фокус на начало теормодуля при входе в него.
  useEffect(() => {
    if (!scenario && screen === 'theory') theoryRef.current?.focus()
  }, [scenario, screen])

  // Фокус на заголовок при смене шага — скринридер озвучит новую сцену.
  useEffect(() => {
    if (!step) return
    titleRef.current?.focus()
  }, [step])

  // Клавиатура: ←/→ двигают сценарий.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (!step) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        back()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [step, next, back])

  const sceneQuote = step?.scene.quote ?? ''

  // Реплика печатается по буквам, кот «говорит» — открывает рот в такт печати.
  // При reduced-motion текст появляется целиком.
  const typing = useTypewriter(sceneQuote, Boolean(step) && !reducedMotion)
  const talking = !typing.done

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        К содержимому
      </a>

      <main id="main" className="app__main">
        {!scenario || !step ? (
          screen === 'welcome' ? (
            <WelcomeScreen onStart={() => setScreen('theory')} doneCount={done.length} />
          ) : screen === 'theory' ? (
            <TheoryScreen ref={theoryRef} onStart={() => setScreen('picker')} />
          ) : screen === 'prize' && done.length >= PRIZE_GOAL ? (
            <PrizeScreen onBack={() => setScreen('picker')} />
          ) : (
            <ScenarioPicker
              onStart={start}
              onTheory={() => setScreen('theory')}
              onPrize={() => setScreen('prize')}
              doneCount={done.length}
            />
          )
        ) : (
          <>
            <StageMap steps={steps} step={step} />

            <div className="run">
              <div className="run__scene">
                <p className="run__live" role="status" aria-live="polite">
                  {step.scene.finale
                    ? `Сценарий завершён: ${step.scenario.verdictTitle.toLowerCase()}`
                    : `${step.act.title} — ${step.scene.title}`}
                </p>
                {step.scene.finale ? (
                  <FinalCard step={step} ref={titleRef} />
                ) : (
                  <ScenePanel step={step} ref={titleRef} />
                )}
              </div>

              <aside className="run__mascot" aria-label="Комментарий Мяушифра">
                <div className="bubble">
                  <p className="bubble__text" aria-hidden="true">
                    «{typing.shown}»
                    {!typing.done && <span className="bubble__caret" />}
                  </p>
                  {/* полный текст — сразу, посимвольная печать озвучке мешает */}
                  <p className="visually-hidden">«{sceneQuote}»</p>
                </div>
                <Mascot mood={step.scene.mood} talking={talking} size={190} className="run__cat" />
                <p className="run__catname px-text">Мяушифр</p>
              </aside>
            </div>

            <Controls step={step} onBack={back} onNext={next} onRestart={restart} onExit={exit} />
          </>
        )}
      </main>
    </div>
  )
}
