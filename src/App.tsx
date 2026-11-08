import { Coat, Flag, hasCoat, type CoatSize, type FlagRadius, type FlagSize } from 'coat-of-arms'
import { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react'
import { COATS, FLAGS, countryName, displayCode, fold, type Country } from './countries'
import { useTheme, type ThemeChoice } from './useTheme'

const INSTALL = 'npm i coat-of-arms'
const REPO = 'https://github.com/ergashev2000'
const NPM = 'https://www.npmjs.com/package/coat-of-arms'

type CopyState = 'idle' | 'copied' | 'failed'

function useCopy() {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef<number | undefined>(undefined)
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1800)
  }, [])
  return { state, copy }
}

const copyLabel = (s: CopyState, idle = 'Copy') =>
  s === 'copied' ? 'Copied' : s === 'failed' ? 'Copy failed' : idle

/* ---------- Header ---------- */

const THEME_LABEL: Record<ThemeChoice, string> = {
  system: 'Theme: system',
  light: 'Theme: light',
  dark: 'Theme: dark',
}

function ThemeIcon({ choice }: { choice: ThemeChoice }) {
  if (choice === 'light')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
      </svg>
    )
  if (choice === 'dark')
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" className="fill" />
    </svg>
  )
}

function Header() {
  const { choice, cycle } = useTheme()
  return (
    <header className="site-header">
      <a className="wordmark" href="#top">
        <svg viewBox="0 0 32 32" aria-hidden="true" className="wordmark-shield">
          <path d="M4 4h24v11c0 7.2-5.3 11.6-12 13-6.7-1.4-12-5.8-12-13Z" />
          <path d="M16 4v24M4 13h24" className="wordmark-cross" />
        </svg>
        coat-of-arms
      </a>
      <nav aria-label="Main">
        <a href="#try">Try it</a>
        <a href="#gallery">Gallery</a>
        <a href={NPM} target="_blank" rel="noreferrer">npm</a>
        <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
        <button type="button" className="icon-btn" onClick={cycle} aria-label={THEME_LABEL[choice]} title={THEME_LABEL[choice]}>
          <ThemeIcon choice={choice} />
        </button>
      </nav>
    </header>
  )
}

/* ---------- Hero ---------- */

function Hero({ code, onPick }: { code: string; onPick: (code: string) => void }) {
  const { state, copy } = useCopy()
  const index = COATS.findIndex((c) => c.code === code)
  const step = (d: number) => onPick(COATS[(index + d + COATS.length) % COATS.length].code)
  const random = () => {
    let next = code
    while (next === code) next = COATS[Math.floor(Math.random() * COATS.length)].code
    onPick(next)
  }

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <h1>Every nation's emblem, ready as a React component.</h1>
        <p className="lede">
          {COATS.length} country coats of arms and {FLAGS.length} flags as crisp SVG components for React.
          Pass a country code and the image, size and styles are handled for you.
        </p>
        <div className="install">
          <code>{INSTALL}</code>
          <button type="button" className="btn btn-gold" onClick={() => copy(INSTALL)}>
            {copyLabel(state)}
          </button>
        </div>
        <ul className="facts">
          <li>TypeScript types</li>
          <li>ESM and CommonJS</li>
          <li>Server rendering</li>
          <li>Lazy loading</li>
          <li>MIT license</li>
        </ul>
      </div>

      <figure className="vitrine" aria-live="polite">
        <div className="halo" aria-hidden="true" />
        <div className="vitrine-stage" key={code}>
          {hasCoat(code) ? (
            <Coat country={code} size="2xl" />
          ) : (
            <div className="no-coat">
              <Flag country={code} size="2xl" radius="lg" />
              <p>No coat of arms for {countryName(code)} in the set yet.</p>
            </div>
          )}
        </div>
        <figcaption>
          <Flag country={code} size="lg" radius="sm" />
          <span className="caption-name">{countryName(code)}</span>
          <span className="caption-code">{displayCode(code)}</span>
        </figcaption>
        <div className="vitrine-controls">
          <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="Previous country">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="btn btn-ghost" onClick={random}>Show another</button>
          <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="Next country">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </figure>
    </section>
  )
}

/* ---------- Playground ---------- */

const COAT_SIZES: CoatSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl']
const FLAG_SIZES: FlagSize[] = ['sm', 'md', 'lg', 'xl', '2xl']
const RADII: FlagRadius[] = ['sm', 'md', 'lg']

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="field">
      <legend>{label}</legend>
      <div className="segmented">
        {options.map((o) => (
          <label key={o} className={o === value ? 'on' : undefined}>
            <input type="radio" name={label} value={o} checked={o === value} onChange={() => onChange(o)} />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Playground({ code, onPick }: { code: string; onPick: (code: string) => void }) {
  const [kind, setKind] = useState<'Coat' | 'Flag'>('Coat')
  const [coatSize, setCoatSize] = useState<CoatSize>('lg')
  const [flagSize, setFlagSize] = useState<FlagSize>('xl')
  const [radius, setRadius] = useState<FlagRadius>('md')
  const [square, setSquare] = useState(false)
  const { state, copy } = useCopy()

  const list = kind === 'Coat' ? COATS : FLAGS
  const current = list.some((c) => c.code === code) ? code : list[0].code
  const shown = displayCode(current)

  const snippet =
    kind === 'Coat'
      ? `<Coat country="${shown}" size="${coatSize}" />`
      : `<Flag country="${shown}" size="${flagSize}" radius="${radius}"${square ? ' square' : ''} />`

  return (
    <section className="section" id="try" aria-labelledby="try-title">
      <h2 id="try-title">Try it</h2>
      <p className="section-lede">Change the props and copy the code.</p>

      <div className="playground">
        <div className="controls">
          <Segmented label="Component" options={['Coat', 'Flag'] as const} value={kind} onChange={setKind} />
          <div className="field">
            <label htmlFor="country-select" className="legend">Country</label>
            <select id="country-select" value={current} onChange={(e) => onPick(e.target.value)}>
              {list.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({displayCode(c.code)})
                </option>
              ))}
            </select>
          </div>
          {kind === 'Coat' ? (
            <Segmented label="Size" options={COAT_SIZES} value={coatSize} onChange={setCoatSize} />
          ) : (
            <>
              <Segmented label="Size" options={FLAG_SIZES} value={flagSize} onChange={setFlagSize} />
              <Segmented label="Radius" options={RADII} value={radius} onChange={setRadius} />
              <label className="check">
                <input type="checkbox" checked={square} onChange={(e) => setSquare(e.target.checked)} />
                Square (1:1)
              </label>
            </>
          )}
        </div>

        <div className="result">
          <div className="preview">
            {kind === 'Coat' ? (
              <Coat country={current} size={coatSize} />
            ) : (
              <Flag country={current} size={flagSize} radius={radius} square={square} />
            )}
          </div>
          <div className="code">
            <pre>
              <code>
                <span className="tok-k">import</span> {'{ '}{kind}{' }'} <span className="tok-k">from</span>{' '}
                <span className="tok-s">'coat-of-arms'</span>
                {'\n\n'}
                {snippet}
              </code>
            </pre>
            <button type="button" className="btn btn-ghost btn-small" onClick={() => copy(snippet)}>
              {copyLabel(state)}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Gallery ---------- */

function Gallery({ code, onPick }: { code: string; onPick: (code: string) => void }) {
  const [tab, setTab] = useState<'coats' | 'flags'>('coats')
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const list = tab === 'coats' ? COATS : FLAGS

  const results = useMemo(() => {
    const q = fold(deferred.trim())
    if (!q) return list
    return list.filter((c) => c.code.includes(q) || fold(c.name).includes(q))
  }, [list, deferred])

  const pick = (c: Country) => {
    onPick(c.code)
    document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section" id="gallery" aria-labelledby="gallery-title">
      <div className="gallery-head">
        <div>
          <h2 id="gallery-title">All coats of arms and flags</h2>
          <p className="section-lede">Pick any entry to see it in the viewer at the top.</p>
        </div>
        <div className="gallery-tools">
          <div className="tabs" role="tablist" aria-label="Collection">
            <button type="button" role="tab" aria-selected={tab === 'coats'} onClick={() => setTab('coats')}>
              Coats of arms <span className="count">{COATS.length}</span>
            </button>
            <button type="button" role="tab" aria-selected={tab === 'flags'} onClick={() => setTab('flags')}>
              Flags <span className="count">{FLAGS.length}</span>
            </button>
          </div>
          <input
            type="search"
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or code"
            aria-label="Search countries"
          />
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {results.length === list.length
          ? `Showing all ${list.length}`
          : results.length === 0
            ? `Nothing matches “${deferred.trim()}”. Try a country name like “Japan” or a code like “JP”.`
            : `${results.length} of ${list.length}`}
      </p>

      <ul className={`grid grid-${tab}`}>
        {results.map((c) => (
          <li key={c.code}>
            <button
              type="button"
              className={`tile${c.code === code ? ' current' : ''}`}
              onClick={() => pick(c)}
              aria-label={`Show ${c.name} in the viewer`}
            >
              {tab === 'coats' ? (
                <Coat country={c.code} size="sm" lazy alt="" aria-hidden />
              ) : (
                <Flag country={c.code} size="xl" radius="sm" alt="" aria-hidden />
              )}
              <span className="tile-name">{c.name}</span>
              <span className="tile-meta">
                {tab === 'coats' ? (
                  <Flag country={c.code} size="sm" radius="sm" alt="" aria-hidden />
                ) : !c.hasCoat ? (
                  <span className="muted">No coat yet</span>
                ) : null}
                <span className="tile-code">{displayCode(c.code)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- Page ---------- */

export default function App() {
  const [code, setCode] = useState('uz')
  const pickForViewer = useCallback((c: string) => setCode(c), [])

  return (
    <>
      <a className="skip" href="#try">Skip to the playground</a>
      <Header />
      <main>
        <Hero code={code} onPick={pickForViewer} />
        <Playground code={code} onPick={pickForViewer} />
        <Gallery code={code} onPick={pickForViewer} />
      </main>
      <footer className="site-footer">
        <p>
          Code under the MIT license. Flags from flag-icons (MIT). Coats of arms are official state symbols; check the
          rules of each country before commercial use.
        </p>
        <p>
          <a href={NPM} target="_blank" rel="noreferrer">npm</a>
          <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
        </p>
      </footer>
    </>
  )
}
