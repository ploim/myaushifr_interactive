import { useEffect, useId, useRef, useState } from 'react'
import type { QuotesApi } from '../hooks/useQuotes'
import { collectQuotes } from '../data/scenarios'

const EDITABLE = collectQuotes()

interface QuoteEditorProps {
  quotes: QuotesApi
  currentSceneId?: string
  onClose: () => void
}

/**
 * Боковой редактор реплик маскота. Черновик живёт в useQuotes и не теряется
 * при переключении шагов; «Сохранить» пишет в localStorage, «Отменить» — откат.
 */
export function QuoteEditor({ quotes, currentSceneId, onClose }: QuoteEditorProps) {
  const headingId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    const node = dialogRef.current
    if (!node) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const first = node.querySelector<HTMLElement>('textarea, button')
    first?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = node.querySelectorAll<HTMLElement>('button, textarea, [href]')
      if (focusables.length === 0) return
      const firstEl = focusables[0]
      const lastEl = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus()
    }
  }, [onClose])

  const dirty = quotes.draftDirtyCount

  return (
    <div className="editor__overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        ref={dialogRef}
      >
        <header className="editor__head">
          <div>
            <h2 id={headingId} className="editor__title">
              Реплики Мяушифра
            </h2>
            <p className="editor__note">
              Правки видно сразу в сюжете. «Сохранить» оставит их в браузере, «Отменить» вернёт как
              было до правок.
            </p>
          </div>
          <button type="button" className="btn btn--ghost editor__close" onClick={onClose}>
            Закрыть ✕
          </button>
        </header>

        <div className="editor__actions">
          <button type="button" className="btn btn--primary" onClick={quotes.save} disabled={dirty === 0}>
            Сохранить{dirty > 0 ? ` (${dirty})` : ''}
          </button>
          <button type="button" className="btn" onClick={quotes.cancel} disabled={dirty === 0}>
            Отменить правки
          </button>
          {confirmReset ? (
            <span className="editor__confirm">
              Сбросить всё к исходным?
              <button type="button" className="btn btn--danger" onClick={() => { quotes.resetAll(); setConfirmReset(false) }}>
                Да, сбросить
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
                Нет
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setConfirmReset(true)}
              disabled={!quotes.hasOverrides}
            >
              Сбросить всё к исходным
            </button>
          )}
        </div>

        <div className="editor__list">
          {EDITABLE.map(({ scenario, items }) => (
            <section key={scenario.id} className="editor__scenario">
              <h3 className="editor__scenario-title px-text">
                {scenario.outcome === 'blocked' ? '☢' : '✉'} {scenario.title}
              </h3>
              {items.map((item) => {
                const value = quotes.quote(item.id)
                const modified = value !== item.original
                const unsaved = quotes.isDraftDirty(item.id)
                const isCurrent = item.id === currentSceneId
                return (
                  <div
                    key={item.id}
                    className={`editor__item${isCurrent ? ' editor__item--current' : ''}`}
                    data-kind={item.kind}
                  >
                    <div className="editor__item-head">
                      <span className="editor__item-owner">
                        {item.kind === 'act' ? 'Акт · ' : ''}
                        {item.owner}
                      </span>
                      <span className="editor__flags">
                        {unsaved && <span className="editor__flag editor__flag--unsaved">не сохранено</span>}
                        {modified && !unsaved && <span className="editor__flag">изменено</span>}
                        {modified && (
                          <button
                            type="button"
                            className="editor__reset"
                            title="Вернуть исходную реплику"
                            aria-label={`Вернуть исходную реплику: ${item.owner}`}
                            onClick={() => quotes.setDraft(item.id, item.original)}
                          >
                            ↺
                          </button>
                        )}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={value}
                      aria-label={`Реплика для «${item.owner}»`}
                      onChange={(e) => quotes.setDraft(item.id, e.target.value)}
                    />
                    {isCurrent && <p className="editor__current-note">← текущая сцена</p>}
                  </div>
                )
              })}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
