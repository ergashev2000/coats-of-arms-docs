import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

/** Renders the page to HTML at build time, so crawlers see the content without running JS. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
