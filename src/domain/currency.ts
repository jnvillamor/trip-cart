import { Settings, Store } from './entities'

export interface CurrencyMeta {
  code: string
  name: string
  symbol: string
  decimals: number
}
export const SUPPORTED_CURRENCIES: readonly CurrencyMeta[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimals: 2 },
] as const

const currencyByCode = new Map(
  SUPPORTED_CURRENCIES.map((currency) => [currency.code, currency]),
)

export const getCurrency = (code: string): CurrencyMeta => {
  const meta = currencyByCode.get(code)
  if (!meta) {
    throw new Error(`Unsupported currency code: ${code}`)
  }
  return meta
}

export const findCurrency = (code: string): CurrencyMeta | undefined => {
  return currencyByCode.get(code)
}
/**
 * Decimal amount → integer minor units. Returns null for null/undefined/non-finite.
 * Uses JS Math.round (half away from zero) — fine for personal accounting.
 *
 * @example
 *   toMinorUnits(19.99, 'USD')  // 1999
 *   toMinorUnits(100, 'JPY')    // 100  (JPY has 0 decimals)
 *   toMinorUnits(1.005, 'USD')  // 100  (banker's rounding: 1.005 → 1.00, not 1.01)
 */
export function toMinorUnits(
  amount: number | null | undefined,
  code: string,
): number | null {
  if (amount == null || !Number.isFinite(amount)) return null
  const { decimals } = getCurrency(code)
  const factor = Math.pow(10, decimals)
  return Math.round(amount * factor)
}

// User-typed string ("19.99", "1,234.50") → minor units. Strips commas;
// period is the decimal separator. Returns null on blank or unparseable input.
// For use in Zod .transform() at form boundaries.
export function parseMoneyToMinorUnits(
  input: string,
  code: string,
): number | null {
  const cleaned = input.trim().replace(/,/g, '')
  if (cleaned === '') return null
  const parsed = Number(cleaned)
  if (!Number.isFinite(parsed)) return null
  return toMinorUnits(parsed, code)
}

export function resolveCurrencyForTrip(
  store: Pick<Store, 'currency_code_override'>,
  settings: Pick<Settings, 'global_currency_code'>,
): string {
  const override = store.currency_code_override?.trim()
  if (override) return override.toUpperCase()
  return settings.global_currency_code.toUpperCase()
}

/** ========================================== */
/** Formatting                                 */
/** ========================================== */

/**
 * Format minor units for display. Falls back to manual format when
 * Intl.NumberFormat doesn't recognize the currency code.
 *
 * @example
 *   formatMinorUnits(1999, 'USD')   // "$19.99"
 *   formatMinorUnits(1999, 'PHP')   // "₱19.99"
 *   formatMinorUnits(100, 'JPY')    // "¥100"
 *   formatMinorUnits(null, 'USD')   // "—"
 */
export function formatMinorUnits(
  minor: number | null | undefined,
  code: string,
  locale: string = 'en-US',
): string {
  if (minor == null || !Number.isFinite(minor)) return '—'

  const meta = findCurrency(code)
  const decimals = meta?.decimals ?? 2
  const amount = minor / Math.pow(10, decimals)

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
  } catch {
    const symbol = meta?.symbol ?? code + ' '
    const fixed = amount.toFixed(decimals)
    const withThousands = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${symbol}${withThousands}`
  }
}

// Format a decimal amount (not minor units). Prefer `formatMinorUnits`;
// use this only when you already have a decimal in hand.
export function formatAmount(
  amount: number | null | undefined,
  code: string,
  locale: string = 'en-US',
): string {
  if (amount == null) return '—'
  return formatMinorUnits(toMinorUnits(amount, code), code, locale)
}

/* -------------------------------------------------------------------------- */
/* Aggregation                                                                */
/* -------------------------------------------------------------------------- */

// Minor-unit amounts grouped by currency code. v1 does not auto-convert.
export type CurrencyBuckets = Record<string, number>

/**
 * Sum minor-unit amounts into per-currency buckets.
 *
 * @example
 *   sumByCurrency([
 *     { minor: 1999, currencyCode: 'USD' },
 *     { minor: 5000, currencyCode: 'PHP' },
 *     { minor: 1001, currencyCode: 'USD' },
 *   ])
 *   // { USD: 3000, PHP: 5000 }
 */
export function sumByCurrency(
  entries: ReadonlyArray<{ minor: number; currencyCode: string }>,
): CurrencyBuckets {
  const buckets: CurrencyBuckets = {}
  for (const { minor, currencyCode } of entries) {
    const key = currencyCode.toUpperCase()
    buckets[key] = (buckets[key] ?? 0) + minor
  }
  return buckets
}
