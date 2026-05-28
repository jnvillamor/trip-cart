import { useMemo, useState } from 'react';
import { suggestCategoryByName } from '@/domain/category-suggest';
import { Category, Good } from '@/domain/entities';
import { useCategories } from '@/ui/hooks/useCategories';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
import {
  useCreateGood,
  useGoods,
  useGoodSuggestionsForStore,
} from '@/ui/hooks/useGoods';
import { useTrip } from '@/ui/hooks/useTrips';
import {
  useCreateTripItem,
  useRemoveTripItem,
  useTripItems,
} from '@/ui/hooks/useTripItems';

const MAX_SUGGESTIONS = 6;

export type Row =
  | { kind: 'section'; key: string; label: string }
  | { kind: 'good'; key: string; good: Good };

export type CreateSuggestion = {
  query: string;
  suggestedCategory?: Category;
};

export function useAddItemsController(tripId: number) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 150);

  const { data: trip } = useTrip(tripId);
  const { data: goods = [], isLoading } = useGoods({ nameQuery: debouncedQuery });
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useTripItems(tripId);
  const { data: suggestionCounts } = useGoodSuggestionsForStore(trip?.store_id, tripId);
  const createGood = useCreateGood();
  const createItem = useCreateTripItem(tripId);
  const removeItem = useRemoveTripItem(tripId);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const itemByGoodId = useMemo(
    () => new Map(items.map((i) => [i.good_id, i])),
    [items],
  );

  const trimmedQuery = debouncedQuery.trim();
  const isSearching = trimmedQuery.length > 0;

  const createSuggestion = useMemo<CreateSuggestion | undefined>(() => {
    if (!isSearching) return undefined;
    const exact = goods.some(
      (g) => g.name.toLowerCase() === trimmedQuery.toLowerCase(),
    );
    if (exact) return undefined;
    return {
      query: trimmedQuery,
      suggestedCategory: suggestCategoryByName(trimmedQuery, categories),
    };
  }, [goods, trimmedQuery, isSearching, categories]);

  const rows = useMemo<Row[]>(() => {
    if (isSearching) {
      return goods.map((g) => ({ kind: 'good', key: `g-${g.id}`, good: g }));
    }
    const counts = suggestionCounts ?? new Map<number, number>();
    const suggested = goods
      .filter((g) => counts.has(g.id))
      .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
      .slice(0, MAX_SUGGESTIONS);
    const suggestedIds = new Set(suggested.map((g) => g.id));
    const rest = goods.filter((g) => !suggestedIds.has(g.id));
    const out: Row[] = [];
    if (suggested.length > 0) {
      out.push({
        kind: 'section',
        key: 'sec-suggested',
        label: 'Frequently bought here',
      });
      for (const g of suggested) out.push({ kind: 'good', key: `s-${g.id}`, good: g });
      out.push({ kind: 'section', key: 'sec-all', label: 'All goods' });
    }
    for (const g of rest) out.push({ kind: 'good', key: `g-${g.id}`, good: g });
    return out;
  }, [goods, suggestionCounts, isSearching]);

  function toggle(good: Good) {
    const existing = itemByGoodId.get(good.id);
    if (existing) {
      removeItem.mutate(existing.id);
    } else {
      createItem.mutate({ good_id: good.id, planned_quantity: 1 });
    }
  }

  async function createAndAdd(name: string, suggestedCategoryId: number | undefined) {
    const newGood = await createGood.mutateAsync({
      name,
      default_category_id: suggestedCategoryId,
    });
    await createItem.mutateAsync({ good_id: newGood.id, planned_quantity: 1 });
    setQuery('');
  }

  return {
    query,
    setQuery,
    debouncedQuery,
    rows,
    createSuggestion,
    isLoading,
    creating: createGood.isPending || createItem.isPending,
    isAdded: (goodId: number) => itemByGoodId.has(goodId),
    categoryFor: (good: Good) =>
      good.default_category_id != null
        ? categoryById.get(good.default_category_id)
        : undefined,
    toggle,
    createAndAdd,
  } as const;
}
