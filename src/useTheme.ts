import { useEffect, useState } from 'react'

export type ThemeChoice = 'system' | 'light' | 'dark'

const KEY = 'coa-theme'

function readChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

/**
 * Light/dark theme that follows the OS unless the visitor picks one.
 * The saved choice is applied before first paint by a script in index.html; this hook reads it
 * after mount, so the prerendered HTML and the first client render match.
 */
export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice | null>(null)

  useEffect(() => {
    setChoice(readChoice())
  }, [])

  useEffect(() => {
    if (choice === null) return
    const root = document.documentElement
    if (choice === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', choice)
    try {
      if (choice === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, choice)
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  }, [choice])

  const cycle = () =>
    setChoice((c) => (c === 'light' ? 'dark' : c === 'dark' ? 'system' : 'light'))

  return { choice: choice ?? 'system', cycle }
}
