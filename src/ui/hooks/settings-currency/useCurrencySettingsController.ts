import { useMemo, useState } from 'react';
import { SUPPORTED_CURRENCIES } from '@/domain/currency';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
import { useSettings, useUpdateSettings } from '@/ui/hooks/useSettings';

export function useCurrencySettingsController() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 120);

  const { data: settings } = useSettings();
  const update = useUpdateSettings();

  const current = settings?.global_currency_code ?? 'USD';

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return SUPPORTED_CURRENCIES;
    return SUPPORTED_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q),
    );
  }, [debouncedQuery]);

  function select(code: string) {
    if (code === current) return;
    update.mutate({ global_currency_code: code });
  }

  return {
    query,
    setQuery,
    debouncedQuery,
    list: filtered,
    current,
    saving: update.isPending,
    select,
  } as const;
}
