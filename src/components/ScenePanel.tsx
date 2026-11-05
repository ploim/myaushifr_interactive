import { forwardRef } from 'react'
import { PixelSprite } from '../pixel/PixelSprite'
import { ICON_PALETTE } from '../pixel/maps'
import type { Step } from '../data/scenarios'

const STATUS_CLASS: Record<string, string> = {
  info: 'st-info',
  pass: 'st-pass',
  warn: 'st-warn',
  unknown: 'st-unknown',
  block: 'st-block',
  deliver: 'st-pass',
}

interface ScenePanelProps {
  step: Step
}

/** Сюжетная панель: заголовок акта/сцены, карточка участника и результат проверки. */
export const ScenePanel = forwardRef<HTMLDivElement, ScenePanelProps>(function ScenePanel(
  { step },
  ref,
) {
  const { act, actIndex, actFirstScene, scene } = step
  return (
    <div className="scenepanel" ref={ref} tabIndex={-1}>
      <p className="scenepanel__act px-text">
        Акт {actIndex + 1} · {act.title}
      </p>
      {actFirstScene && <p className="scenepanel__actquote">«{act.quote}»</p>}

      <h2 className="scenepanel__title">{scene.title}</h2>

      <article
        className={`szicard ${scene.speaker.tone === 'outside' ? 'szicard--outside' : ''}`}
        data-status={scene.status}
      >
        <header className="szicard__head">
          <PixelSprite
            map={scene.speaker.icon}
            palette={scene.speaker.evil ? { ...ICON_PALETTE, e: 'var(--red)' } : ICON_PALETTE}
            className="szicard__icon"
          />
          <div className="szicard__who">
            <span className="px-chip px-chip--mini">{scene.speaker.badge}</span>
            <h3 className="szicard__name">{scene.speaker.name}</h3>
          </div>
          <span className={`szicard__status px-chip ${STATUS_CLASS[scene.status] ?? ''}`}>
            {scene.statusLabel}
          </span>
        </header>

        {scene.sziRole && <p className="szicard__role">{scene.sziRole}</p>}

        <blockquote className="szicard__narration">
          <p>{scene.narration}</p>
        </blockquote>
      </article>
    </div>
  )
})
