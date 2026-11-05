import { useEffect, useState } from 'react'

const CHAR_MS = 22
const START_DELAY_MS = 350

/**
 * Печатает текст по символам (~45 символов/с, стартовая пауза на смене реплики).
 * enabled=false — редактор открыт или prefers-reduced-motion — текст целиком.
 */
export function useTypewriter(text: string, enabled: boolean) {
  const [count, setCount] = useState(() => (enabled ? 0 : text.length))

  useEffect(() => {
    if (!enabled) {
      setCount(text.length)
      return
    }
    setCount(0)
    let i = 0
    let interval: number | undefined
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i = Math.min(i + 1, text.length)
        setCount(i)
        if (i >= text.length) {
          window.clearInterval(interval)
          interval = undefined
        }
      }, CHAR_MS)
    }, START_DELAY_MS)
    return () => {
      window.clearTimeout(start)
      if (interval !== undefined) window.clearInterval(interval)
    }
  }, [text, enabled])

  return { shown: text.slice(0, count), done: count >= text.length }
}
