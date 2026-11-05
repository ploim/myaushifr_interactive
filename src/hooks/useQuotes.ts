import { useCallback, useEffect, useMemo, useState } from 'react'
import { collectQuotes } from '../data/scenarios'

const STORAGE_KEY = 'dod-mail-journey.quotes.v1'

/** Все редактируемые реплики (акты + сцены) с исходными текстами. */
const ALL_ITEMS = collectQuotes()

type Overrides = Record<string, string>

function loadOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Overrides
    }
    return {}
  } catch {
    // Приватный режим или повреждённые данные — работаем без сохранений.
    return {}
  }
}

function persist(overrides: Overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Хранилище недоступно — правки живут только в памяти сессии.
  }
}

export interface QuotesApi {
  /** Реплика с учётом сохранённых правок и открытого черновика. */
  quote(id: string): string
  /** Есть ли у реплики несохранённая правка в черновике. */
  isDraftDirty(id: string): boolean
  /** Есть ли что сохранять в черновике вообще. */
  draftDirtyCount: number
  /** Черновик открыт (режим редактирования активен). */
  editing: boolean
  beginEditing(): void
  setDraft(id: string, text: string): void
  /** Черновик → сохранённые правки + localStorage. */
  save(): void
  /** Черновик отбрасывается, остаются сохранённые правки. */
  cancel(): void
  /** Полный сброс:localStorage очищается, все реплики исходные. */
  resetAll(): void
  /** Сохранённые правки существуют (реплики кастомизированы). */
  hasOverrides: boolean
}

export function useQuotes(): QuotesApi {
  const [saved, setSaved] = useState<Overrides>(() => loadOverrides())
  const [draft, setDraftState] = useState<Overrides | null>(null)

  useEffect(() => {
    persist(saved)
  }, [saved])

  const originals = useMemo(() => {
    const map: Record<string, string> = {}
    for (const { items } of ALL_ITEMS) {
      for (const item of items) map[item.id] = item.original
    }
    return map
  }, [])

  const quote = useCallback(
    (id: string) => draft?.[id] ?? saved[id] ?? originals[id] ?? '',
    [draft, saved, originals],
  )

  const beginEditing = useCallback(() => {
    setDraftState((current) => {
      if (current) return current
      // Черновик стартует с актуальных значений всех реплик.
      const seeded: Overrides = { ...originals }
      for (const key of Object.keys(saved)) seeded[key] = saved[key]
      return seeded
    })
  }, [originals, saved])

  const updateDraft = useCallback((id: string, text: string) => {
    setDraftState((current) => (current ? { ...current, [id]: text } : current))
  }, [])

  const save = useCallback(() => {
    setDraftState((current) => {
      if (!current) return null
      // Храним только отличия от исходников — так сброс и миграции остаются простыми.
      const next: Overrides = {}
      for (const { items } of ALL_ITEMS) {
        for (const item of items) {
          const value = current[item.id]
          if (value !== undefined && value !== item.original) next[item.id] = value
        }
      }
      setSaved(next)
      return null
    })
  }, [])

  const cancel = useCallback(() => setDraftState(null), [])

  const resetAll = useCallback(() => {
    setSaved({})
    setDraftState(null)
  }, [])

  const draftDirtyCount = useMemo(() => {
    if (!draft) return 0
    let count = 0
    for (const { items } of ALL_ITEMS) {
      for (const item of items) {
        const value = draft[item.id]
        const base = saved[item.id] ?? item.original
        if (value !== undefined && value !== base) count++
      }
    }
    return count
  }, [draft, saved])

  const isDraftDirty = useCallback(
    (id: string) => {
      if (!draft) return false
      const value = draft[id]
      if (value === undefined) return false
      return value !== (saved[id] ?? originals[id])
    },
    [draft, saved, originals],
  )

  return {
    quote,
    isDraftDirty,
    draftDirtyCount,
    editing: draft !== null,
    beginEditing,
    setDraft: updateDraft,
    save,
    cancel,
    resetAll,
    hasOverrides: Object.keys(saved).length > 0,
  }
}
