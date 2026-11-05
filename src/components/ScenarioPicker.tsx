import { Mascot } from './Mascot'
import { SCENARIOS, flatten, type Scenario } from '../data/scenarios'

interface ScenarioPickerProps {
  onStart: (scenario: Scenario) => void
  onTheory: () => void
  onPrize: () => void
  /** Сколько сценариев уже пройдено (до финальной сцены). */
  doneCount: number
}

/** Выбор сценария: сверху — прогресс приключения и приз. */
export function ScenarioPicker({ onStart, onTheory, onPrize, doneCount }: ScenarioPickerProps) {
  const prizeReady = doneCount >= 3

  return (
    <div className="picker">
      <div className="picker__hero">
        <Mascot mood="idle" size={148} className="picker__cat" />
        <div className="picker__intro">
          <h1 className="picker__title px-text">Сценарии</h1>
          <p className="picker__lead">
            Интерактивные истории о том, как средства защиты информации ловят атаки:
            от вредоносной почты до брутфорса. Выберите сценарий и идите по шагам.
          </p>
          <button type="button" className="btn btn--primary btn--pixel" onClick={onTheory}>
            ← Азбука защиты
          </button>
        </div>
      </div>

      <div className="progress" role="status" aria-live="polite">
        <div className="progress__info">
          <p className="progress__label px-text">Прогресс приключения</p>
          <p className="progress__count">
            {prizeReady
              ? `Пройдено сценариев: ${doneCount} — приз ждёт!`
              : `Пройдено сценариев: ${doneCount} из 3 — и сладкий приз твой`}
          </p>
        </div>
        <div className="progress__bar" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`progress__cell${i < doneCount ? ' progress__cell--on' : ''}`} />
          ))}
        </div>
        {prizeReady && (
          <button type="button" className="btn btn--primary btn--pixel" onClick={onPrize}>
            Забрать сладкий приз
          </button>
        )}
      </div>

      <div className="picker__cards">
        {SCENARIOS.map((scenario) => {
          const steps = flatten(scenario)
          const high = scenario.threatLevel === 'high'
          return (
            <article
              key={scenario.id}
              className={`scenariocard${high ? ' scenariocard--danger' : ' scenariocard--warn'}`}
            >
              <div className="scenariocard__top">
                <span className={`px-chip ${high ? 'st-block' : 'st-warn'}`}>{scenario.threat}</span>
                <span className="px-chip">
                  {scenario.acts.length} акта · {steps.length} сцен
                </span>
              </div>
              <h2 className="scenariocard__title">{scenario.title}</h2>
              <p className="scenariocard__tagline">{scenario.tagline}</p>
              <p className="scenariocard__outcome">
                Исход: <strong>{scenario.outcomeText}</strong>
              </p>
              <button type="button" className="btn btn--primary" onClick={() => onStart(scenario)}>
                Начать сценарий
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
