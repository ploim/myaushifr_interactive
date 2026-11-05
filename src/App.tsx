import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Mascot } from './components/Mascot'
import { Controls } from './components/Controls'
import { FinalCard } from './components/FinalCard'
import { ScenarioPicker } from './components/ScenarioPicker'
import { ScenePanel } from './components/ScenePanel'
import { StageMap } from './components/StageMap'
import { flatten, type Scenario } from './data/scenarios'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useTypewriter } from './hooks/useTypewriter'

export default function App() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [index, setIndex] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  const steps = useMemo(() => (scenario ? flatten(scenario) : []), [scenario])
  const step = steps[index]

  const titleRef = useRef<HTMLHeadingElement | HTMLDivElement>(null)

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

      <header className="app__header">
        <div className="app__brand">
          <Mascot mood="idle" size={44} className="app__logo" />
          <div>
            <p className="app__title px-text">Стенд СЗИ</p>
            <p className="app__subtitle">демо работы средств защиты информации</p>
          </div>
        </div>
      </header>

      <main id="main" className="app__main">
        {!scenario || !step ? (
          <ScenarioPicker onStart={start} />
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
                  {/* id реплики — якорь для правок в src/data/scenarios.ts */}
                  <p className="bubble__id">реплика {step.scene.id}</p>
                </div>
                <Mascot mood={step.scene.mood} talking={talking} size={190} className="run__cat" />
                <p className="run__catname px-text">Мяушифр</p>
              </aside>
            </div>

            <Controls step={step} onBack={back} onNext={next} onRestart={restart} onExit={exit} />
          </>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Учебная демонстрация: события и вердикты концептуальные. Реплики Мяушифра задаются в
          исходном коде — их id видны в интерфейсе под репликами.
        </p>
      </footer>
    </div>
  )
}
