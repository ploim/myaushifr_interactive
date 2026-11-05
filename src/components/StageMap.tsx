import type { CSSProperties } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { ICON_PALETTE, LETTER, LETTER_LOCKED, LETTER_PALETTE, applyPatch } from '../pixel/maps'
import { STAGES, STAGE_ORDER, type StageId } from '../data/stages'
import type { Step } from '../data/scenarios'

export type NodeState = 'future' | 'current' | 'passed' | 'blocked' | 'quarantine' | 'delivered'

const STATE_TEXT: Record<NodeState, string> = {
  future: 'ожидание',
  current: 'проверка…',
  passed: 'пройдено',
  blocked: 'заблокировано',
  quarantine: 'карантин',
  delivered: 'доставлено',
}

/**
 * Состояния узлов выводим из истории шагов: узлы до текущего — пройдены,
 * узел поимки навсегда «заблокирован», финал — карантин или доставка.
 */
function nodeStates(steps: readonly Step[], index: number): Record<StageId, NodeState> {
  const states = Object.fromEntries(
    STAGES.map((s) => [s.id, 'future' as NodeState]),
  ) as Record<StageId, NodeState>
  let caughtAt: StageId | null = null
  for (let i = 0; i <= index; i++) {
    const { scene } = steps[i]
    const stage = scene.stage
    if (stage === 'endpoint') {
      states.endpoint = steps[i].scenario.outcome === 'blocked' ? 'quarantine' : 'delivered'
      continue
    }
    if (i === index) {
      states[stage] = scene.status === 'block' ? 'blocked' : 'current'
    } else {
      states[stage] = 'passed'
    }
    if (scene.status === 'block' && caughtAt === null) caughtAt = stage
  }
  if (caughtAt) states[caughtAt] = 'blocked'
  return states
}

interface StageMapProps {
  steps: readonly Step[]
  step: Step
}

export function StageMap({ steps, step }: StageMapProps) {
  const { scenario, scene, index } = step
  const states = nodeStates(steps, index)
  const locked = steps.slice(0, index + 1).some((s) => s.scene.letterLocked)

  return (
    <section className="stagemap" aria-label="Схема инфраструктуры: путь письма">
      <div className="stagemap__head">
        <span className="px-chip px-chip--scenario">{scenario.title}</span>
        <span className="px-chip">
          Шаг {index + 1}/{step.total}
        </span>
      </div>

      <div className="rail" style={{ '--nodes': STAGES.length } as CSSProperties}>
        <ol className="rail__nodes">
          {STAGES.map((stage) => {
            const state = states[stage.id]
            const label = scenario.stageLabels[stage.id] ?? stage.label
            const evil = scenario.id === 'malicious' && stage.id === 'sender'
            return (
              <li key={stage.id} className="node" data-state={state} data-evil={evil || undefined}>
                <span className="node__icon">
                  <PixelSprite map={stage.icon} palette={ICON_PALETTE} className="node__sprite" />
                  <span className="node__mark" aria-hidden="true">
                    {state === 'passed' || state === 'delivered'
                      ? '✓'
                      : state === 'current'
                        ? '●'
                        : state === 'blocked' || state === 'quarantine'
                          ? '✕'
                          : '·'}
                  </span>
                </span>
                <span className="node__label">{label}</span>
                <span className="node__state" aria-hidden="true">
                  {STATE_TEXT[state]}
                </span>
                <span className="visually-hidden">{`${label}: ${STATE_TEXT[state]}`}</span>
              </li>
            )
          })}
        </ol>

        <div
          className="letter"
          data-locked={locked || undefined}
          style={{ '--col': STAGE_ORDER[scene.stage] } as CSSProperties}
          aria-hidden="true"
        >
          <PixelSprite
            map={locked ? applyPatch(LETTER, LETTER_LOCKED) : LETTER}
            palette={LETTER_PALETTE}
            className="letter__sprite"
          />
        </div>
      </div>
    </section>
  )
}
