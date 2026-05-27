import {
  findCurrency,
  formatAmount,
  formatMinorUnits,
  getCurrency,
  parseMoneyToMinorUnits,
  resolveCurrencyForTrip,
  sumByCurrency,
  toMinorUnits,
} from '@/domain/currency';

describe('getCurrency / findCurrency', () => {
  test('getCurrency returns meta for supported code', () => {
    expect(getCurrency('USD')).toEqual({
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      decimals: 2,
    });
  });

  test('getCurrency throws on unsupported code', () => {
    expect(() => getCurrency('XYZ')).toThrow('Unsupported currency code: XYZ');
  });

  test('findCurrency returns undefined for unsupported code', () => {
    expect(findCurrency('XYZ')).toBeUndefined();
  });
});

describe('toMinorUnits', () => {
  test('converts decimal to minor units', () => {
    expect(toMinorUnits(19.99, 'USD')).toBe(1999);
  });

  test('returns null for null/undefined/NaN', () => {
    expect(toMinorUnits(null, 'USD')).toBeNull();
    expect(toMinorUnits(undefined, 'USD')).toBeNull();
    expect(toMinorUnits(NaN, 'USD')).toBeNull();
  });

  test('throws when currency is unsupported', () => {
    expect(() => toMinorUnits(10, 'XYZ')).toThrow();
  });
});

describe('parseMoneyToMinorUnits', () => {
  test('parses plain decimal string', () => {
    expect(parseMoneyToMinorUnits('19.99', 'USD')).toBe(1999);
  });

  test('strips commas as thousands separator', () => {
    expect(parseMoneyToMinorUnits('1,234.50', 'USD')).toBe(123450);
  });

  test('returns null for blank or unparseable input', () => {
    expect(parseMoneyToMinorUnits('   ', 'USD')).toBeNull();
    expect(parseMoneyToMinorUnits('abc', 'USD')).toBeNull();
  });
});

describe('resolveCurrencyForTrip', () => {
  test('store override wins over global default', () => {
    expect(
      resolveCurrencyForTrip({ currency_code_override: 'JPY' }, { global_currency_code: 'USD' }),
    ).toBe('JPY');
  });

  test('falls back to global when override is null', () => {
    expect(
      resolveCurrencyForTrip({ currency_code_override: null }, { global_currency_code: 'PHP' }),
    ).toBe('PHP');
  });

  test('falls back to global when override is blank string', () => {
    expect(
      resolveCurrencyForTrip({ currency_code_override: '   ' }, { global_currency_code: 'USD' }),
    ).toBe('USD');
  });

  test('uppercases the resolved code', () => {
    expect(
      resolveCurrencyForTrip({ currency_code_override: 'jpy' }, { global_currency_code: 'usd' }),
    ).toBe('JPY');
  });
});

describe('formatMinorUnits', () => {
  test('returns em dash for null/undefined', () => {
    expect(formatMinorUnits(null, 'USD')).toBe('—');
    expect(formatMinorUnits(undefined, 'USD')).toBe('—');
  });

  test('formats USD with symbol and decimals', () => {
    expect(formatMinorUnits(1999, 'USD')).toContain('19.99');
  });
});

describe('formatAmount', () => {
  test('returns em dash for null', () => {
    expect(formatAmount(null, 'USD')).toBe('—');
  });

  test('round-trips a decimal through minor units', () => {
    expect(formatAmount(19.99, 'USD')).toBe(formatMinorUnits(1999, 'USD'));
  });
});

describe('sumByCurrency', () => {
  test('groups and sums by uppercased currency code', () => {
    expect(
      sumByCurrency([
        { minor: 1999, currencyCode: 'USD' },
        { minor: 5000, currencyCode: 'PHP' },
        { minor: 1001, currencyCode: 'usd' },
      ]),
    ).toEqual({ USD: 3000, PHP: 5000 });
  });

  test('returns empty object for empty input', () => {
    expect(sumByCurrency([])).toEqual({});
  });
});
