import type { CSSProperties } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { ICON_PALETTE, MARKER_LOCK, MARKER_PALETTE, applyPatch } from '../pixel/maps'
import type { NodeState } from '../data/stages'
import type { Step } from '../data/scenarios'

const STATE_TEXT: Record<NodeState, string> = {
  future: 'ожидание',
  current: 'проверка…',
  passed: 'пройдено',
  blocked: 'заблокировано',
  quarantine: 'карантин',
  delivered: 'доставлено',
  defended: 'защищено',
}

const STATE_MARK: Record<NodeState, string> = {
  future: '·',
  current: '●',
  passed: '✓',
  delivered: '✓',
  defended: '✓',
  blocked: '✕',
  quarantine: '✕',
}

/**
 * Состояния узлов выводим из истории шагов: каждый узел помнит собственный
 * итог (поимка остаётся «заблокированной»), финал — состояние сценария.
 */
function nodeStates(steps: readonly Step[], index: number): Record<string, NodeState> {
  const { scenario } = steps[index]
  const stages = scenario.stages
  const lastStageId = stages[stages.length - 1].id
  const states = Object.fromEntries(stages.map((s) => [s.id, 'future' as NodeState]))
  for (let i = 0; i <= index; i++) {
    const { scene } = steps[i]
    const stage = scene.stage
    if (stage === lastStageId) {
      states[lastStageId] = scenario.finalNodeState
      continue
    }
    const next: NodeState = scene.status === 'block' ? 'blocked' : i === index ? 'current' : 'passed'
    if (states[stage] !== 'blocked') states[stage] = next
  }
  return states
}

interface StageMapProps {
  steps: readonly Step[]
  step: Step
}

export function StageMap({ steps, step }: StageMapProps) {
  const { scenario, scene, index } = step
  const stages = scenario.stages
  const states = nodeStates(steps, index)
  const locked = steps.slice(0, index + 1).some((s) => s.scene.markerLocked)
  const markerCol = stages.findIndex((s) => s.id === scene.stage)

  return (
    <section className="stagemap" aria-label="Схема инфраструктуры">
      <div className="stagemap__head">
        <span className="px-chip px-chip--scenario">{scenario.title}</span>
        <span className="px-chip">
          Шаг {index + 1}/{step.total}
        </span>
      </div>

      <div className="rail" style={{ '--nodes': stages.length } as CSSProperties}>
        <ol className="rail__nodes">
          {stages.map((stage) => {
            const state = states[stage.id]
            return (
              <li key={stage.id} className="node" data-state={state} data-evil={stage.evil || undefined}>
                <span className="node__icon">
                  <PixelSprite map={stage.icon} palette={ICON_PALETTE} className="node__sprite" />
                  <span className="node__mark" aria-hidden="true">
                    {STATE_MARK[state]}
                  </span>
                </span>
                <span className="node__label">{stage.label}</span>
                <span className="node__state" aria-hidden="true">
                  {STATE_TEXT[state]}
                </span>
                <span className="visually-hidden">{`${stage.label}: ${STATE_TEXT[state]}`}</span>
              </li>
            )
          })}
        </ol>

        <div
          className="marker"
          data-locked={locked || undefined}
          style={{ '--col': Math.max(markerCol, 0) } as CSSProperties}
          aria-hidden="true"
        >
          <PixelSprite
            map={locked ? applyPatch(scenario.marker, MARKER_LOCK) : scenario.marker}
            palette={MARKER_PALETTE}
            className="marker__sprite"
          />
        </div>
      </div>
    </section>
  )
}
