import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Mascot } from './components/Mascot'
import { Controls } from './components/Controls'
import { FinalCard } from './components/FinalCard'
import { QuoteEditor } from './components/QuoteEditor'
import { ScenarioPicker } from './components/ScenarioPicker'
import { ScenePanel } from './components/ScenePanel'
import { StageMap } from './components/StageMap'
import { flatten, type Scenario } from './data/scenarios'
import { useQuotes } from './hooks/useQuotes'

export default function App() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [index, setIndex] = useState(0)
  const [editorOpen, setEditorOpen] = useState(false)
  const quotes = useQuotes()

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
    if (!step || editorOpen) return
    titleRef.current?.focus()
  }, [step, editorOpen])

  // Клавиатура: ←/→ двигают сценарий, Esc закрывает редактор (внутри QuoteEditor).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (editorOpen) return
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
  }, [editorOpen, step, next, back])

  const openEditor = useCallback(() => {
    quotes.beginEditing()
    setEditorOpen(true)
  }, [quotes])

  const actQuote = step ? quotes.quote(step.act.id) : ''
  const sceneQuote = step ? quotes.quote(step.scene.id) : ''
  const quoteDirty = step ? quotes.isDraftDirty(step.scene.id) : false

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        К содержимому
      </a>

      <header className="app__header">
        <div className="app__brand">
          <Mascot mood="idle" size={44} className="app__logo" />
          <div>
            <p className="app__title px-text">Путь письма</p>
            <p className="app__subtitle">демо защиты от вредоносных вложений</p>
          </div>
        </div>
        <button type="button" className="btn btn--ghost" onClick={openEditor}>
          ✎ Реплики кота
        </button>
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
                  <ScenePanel step={step} actQuote={actQuote} ref={titleRef} />
                )}
              </div>

              <aside className="run__mascot" aria-label="Комментарий Мяушифра">
                <Mascot mood={step.scene.mood} size={190} className="run__cat" />
                <p className="run__catname px-text">Мяушифр</p>
                <div className={`bubble${quoteDirty ? ' bubble--dirty' : ''}`}>
                  <p>«{sceneQuote}»</p>
                  <button
                    type="button"
                    className="bubble__edit"
                    onClick={openEditor}
                    aria-label="Редактировать реплику текущей сцены"
                  >
                    ✎ править
                  </button>
                </div>
                {quoteDirty && <p className="run__unsaved">реплика не сохранена</p>}
              </aside>
            </div>

            <Controls step={step} onBack={back} onNext={next} onRestart={restart} onExit={exit} />
          </>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Учебная демонстрация: события и вердикты концептуальные. Реплики кота можно менять — они
          сохраняются в этом браузере.
        </p>
      </footer>

      {editorOpen && (
        <QuoteEditor quotes={quotes} currentSceneId={step?.scene.id} onClose={() => setEditorOpen(false)} />
      )}
    </div>
  )
}
