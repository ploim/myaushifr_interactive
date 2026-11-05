import { Mascot } from './Mascot'
import { SCENARIOS, flatten, type Scenario } from '../data/scenarios'

interface ScenarioPickerProps {
  onStart: (scenario: Scenario) => void
}

/** Пустое состояние: выбор сценария. */
export function ScenarioPicker({ onStart }: ScenarioPickerProps) {
  return (
    <div className="picker">
      <div className="picker__hero">
        <Mascot mood="idle" size={148} className="picker__cat" />
        <div className="picker__intro">
          <h1 className="picker__title px-text">Путь письма</h1>
          <p className="picker__lead">
            Интерактивная демонстрация: как инфраструктура защиты проверяет почту и ловит
            вредоносные вложения. Выберите сценарий и идите по шагам.
          </p>
          <p className="picker__hint">
            Управление: кнопки «Далее» и «Назад» или стрелки ←&nbsp;→ на клавиатуре.
          </p>
        </div>
      </div>

      <div className="picker__cards">
        {SCENARIOS.map((scenario) => {
          const steps = flatten(scenario)
          const acts = scenario.acts.length
          const blocked = scenario.outcome === 'blocked'
          return (
            <article key={scenario.id} className={`scenariocard${blocked ? ' scenariocard--danger' : ''}`}>
              <div className="scenariocard__top">
                <span className={`px-chip ${blocked ? 'st-block' : 'st-pass'}`}>{scenario.threat}</span>
                <span className="px-chip">{acts} акта · {steps.length} сцен</span>
              </div>
              <h2 className="scenariocard__title">{scenario.title}</h2>
              <p className="scenariocard__tagline">{scenario.tagline}</p>
              <p className="scenariocard__outcome">
                Исход: <strong>{blocked ? 'письмо будет заблокировано' : 'письмо будет доставлено'}</strong>
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
