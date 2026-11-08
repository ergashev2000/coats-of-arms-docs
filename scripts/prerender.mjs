// Runs after `vite build` and `vite build --ssr`: puts the rendered page into dist/index.html
// and writes robots.txt and sitemap.xml for the configured site URL.
import { createHash } from 'node:crypto'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const env = loadEnv('production', root, 'VITE_')
const site = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || '').replace(/\/+$/, '')
if (!/^https:\/\/[^/]+$/.test(site)) throw new Error(`VITE_SITE_URL must be an https origin, got "${site}"`)

const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const appHtml = render()

const indexPath = join(dist, 'index.html')
const template = readFileSync(indexPath, 'utf8')
if (!template.includes('<!--app-->')) throw new Error('index.html is missing the <!--app--> marker')
writeFileSync(indexPath, template.replace('<!--app-->', appHtml))

const today = new Date().toISOString().slice(0, 10)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
)

// The Content-Security-Policy in vercel.json allows inline scripts by hash.
// Fail the build if an inline script changed and its hash was not updated there.
const csp = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'))
  .headers.flatMap((h) => h.headers)
  .find((h) => h.key === 'Content-Security-Policy').value
const html = readFileSync(indexPath, 'utf8')
for (const [, attrs, body] of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (/type="application\/ld\+json"/.test(attrs)) continue // data, not executed
  const hash = `sha256-${createHash('sha256').update(body).digest('base64')}`
  if (!csp.includes(`'${hash}'`)) throw new Error(`Inline script hash ${hash} is missing from the CSP in vercel.json`)
}

rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: ${Math.round(appHtml.length / 1024)} KB of HTML for ${site}`)
