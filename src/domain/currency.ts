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

export const findCurrencyMeta = (code: string): CurrencyMeta | undefined => {
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
  if (amount == null || !Number.isFinite(amount)) return null;
  const { decimals } = getCurrency(code);
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor);
}

// User-typed string ("19.99", "1,234.50") → minor units. Strips commas;
// period is the decimal separator. Returns null on blank or unparseable input.
// For use in Zod .transform() at form boundaries.
export function parseMoneyToMinorUnits(
  input: string,
  code: string,
): number | null {
  const cleaned = input.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return null;
  return toMinorUnits(parsed, code);
}