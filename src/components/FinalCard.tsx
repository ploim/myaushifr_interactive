import { forwardRef } from 'react'
import type { Step } from '../data/scenarios'

const MARK: Record<string, string> = {
  pass: '✓',
  warn: '▲',
  unknown: '?',
  block: '✕',
  deliver: '✓',
  info: '·',
}

interface FinalCardProps {
  step: Step
}

/** Итоговая карточка сценария: вердикт и резюме всех проверок. */
export const FinalCard = forwardRef<HTMLDivElement, FinalCardProps>(function FinalCard({ step }, ref) {
  const { scenario } = step
  const danger = scenario.verdictTone === 'danger'
  return (
    <div
      className={`finalcard${danger ? ' finalcard--danger' : ' finalcard--success'}`}
      ref={ref}
      tabIndex={-1}
    >
      <h2 className="visually-hidden">Итог сценария</h2>
      <p className="finalcard__banner px-text" role="status">
        {scenario.verdictTitle}
      </p>
      <p className="finalcard__subtitle">{scenario.verdictSubtitle}</p>

      <ul className="finalcard__list">
        {scenario.summary.map((point, i) => (
          <li key={i} className="finalcard__point" data-status={point.status}>
            <span className="finalcard__mark" aria-hidden="true">
              {MARK[point.status] ?? '·'}
            </span>
            <span>{point.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
