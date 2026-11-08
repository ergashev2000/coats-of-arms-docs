import { COAT_CODES, FLAG_CODES } from 'coat-of-arms'
import { COUNTRY_NAMES } from './country-names'

export interface Country {
  /** Lowercase code as used by the package ("uz", "gb-eng"). */
  code: string
  name: string
  hasCoat: boolean
}

export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code.toUpperCase()
}

/** Lowercase and strip accents, so "turk" finds "Türkiye" and "cote" finds "Côte d'Ivoire". */
export const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

// Plain comparison instead of localeCompare, so the order is identical on the server and in every browser.
const byName = (a: Country, b: Country) => {
  const x = fold(a.name)
  const y = fold(b.name)
  return x < y ? -1 : x > y ? 1 : 0
}

const coatSet = new Set(COAT_CODES)

export const COATS: Country[] = COAT_CODES.map((code) => ({
  code,
  name: countryName(code),
  hasCoat: true,
})).sort(byName)

export const FLAGS: Country[] = FLAG_CODES.filter((c) => c !== 'xx')
  .map((code) => ({ code, name: countryName(code), hasCoat: coatSet.has(code) }))
  .sort(byName)

export const displayCode = (code: string) => code.toUpperCase()
