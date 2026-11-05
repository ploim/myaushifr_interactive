import type { Step } from '../data/scenarios'

interface ControlsProps {
  step: Step
  onBack: () => void
  onNext: () => void
  onRestart: () => void
  onExit: () => void
}

/** Нижняя панель управления прогоном. */
export function Controls({ step, onBack, onNext, onRestart, onExit }: ControlsProps) {
  const { index, total, scene } = step
  const atStart = index === 0
  const atEnd = index === total - 1
  const nextLabel = index === total - 2 ? 'К итогу' : 'Далее'

  return (
    <nav className="controls" aria-label="Управление сценарием">
      <div className="controls__nav">
        <button type="button" className="btn" onClick={onBack} disabled={atStart}>
          ← Назад
        </button>
        {!atEnd && (
          <button type="button" className="btn btn--primary" onClick={onNext}>
            {nextLabel} →
          </button>
        )}
      </div>

      <p className="controls__hint" aria-hidden="true">
        {scene.finale ? 'Забег завершён' : 'Подсказка: работают стрелки ← →'}
      </p>

      <div className="controls__meta">
        <button type="button" className="btn btn--ghost" onClick={onRestart}>
          ⟲ Сначала
        </button>
        <button type="button" className="btn btn--ghost" onClick={onExit}>
          Сменить сценарий
        </button>
      </div>
    </nav>
  )
}
