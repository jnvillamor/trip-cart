import { useMemo, useState } from 'react';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Good, Store, TripItem } from '@/domain/entities';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
import { useGoods } from '@/ui/hooks/useGoods';
import { useSettings } from '@/ui/hooks/useSettings';
import { useStores } from '@/ui/hooks/useStores';
import { useTrips } from '@/ui/hooks/useTrips';
import { useAllTripItems } from '@/ui/hooks/useTripItems';

export type PricePoint = {
  t: number; // epoch ms (sort key)
  price: number;
  storeId: number;
};

export type StoreSeries = {
  storeId: number;
  storeName: string;
  color: string;
  points: PricePoint[];
};

const SERIES_COLORS = [
  '#4F46E5',
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#A855F7',
  '#14B8A6',
  '#EC4899',
];

function itemPrice(item: TripItem): number {
  if (item.is_checked && (item.actual_unit_price ?? 0) > 0) {
    return item.actual_unit_price ?? 0;
  }
  return item.planned_unit_price ?? 0;
}

export function useInsightsPriceHistoryController() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 150);
  const [goodId, setGoodId] = useState<number | null>(null);
  const [perStore, setPerStore] = useState(false);

  const { data: trips = [], isLoading: tripsLoading } = useTrips({
    statuses: [TRIP_STATUS_ENUM.COMPLETED],
  });
  const { data: allItems = [], isLoading: itemsLoading } = useAllTripItems();
  const { data: stores = [] } = useStores({ archived: true });
  const { data: goodsFiltered = [] } = useGoods({
    archived: true,
    nameQuery: debouncedQuery,
  });
  const { data: allGoods = [] } = useGoods({ archived: true });
  const { data: settings } = useSettings();

  const tripById = useMemo(() => new Map(trips.map((t) => [t.id, t])), [trips]);
  const storeById = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);
  const goodById = useMemo(() => new Map(allGoods.map((g) => [g.id, g])), [allGoods]);

  const selectedGood: Good | undefined =
    goodId != null ? goodById.get(goodId) : undefined;

  const points = useMemo<PricePoint[]>(() => {
    if (goodId == null) return [];
    const out: PricePoint[] = [];
    for (const item of allItems) {
      if (item.good_id !== goodId) continue;
      const trip = tripById.get(item.trip_id);
      if (!trip) continue;
      const when = trip.completed_at ?? trip.started_at;
      if (!when) continue;
      const price = itemPrice(item);
      if (price <= 0) continue;
      out.push({ t: when.getTime(), price, storeId: trip.store_id });
    }
    return out.sort((a, b) => a.t - b.t);
  }, [goodId, allItems, tripById]);

  const overall = useMemo(() => {
    if (points.length === 0) return null;
    const prices = points.map((p) => p.price);
    const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const latest = points[points.length - 1]!.price;
    const first = points[0]!.price;
    const changePct = first > 0 ? (latest - first) / first : null;
    return { avg, min, max, latest, first, changePct } as const;
  }, [points]);

  const series = useMemo<StoreSeries[]>(() => {
    if (!perStore) {
      return [
        {
          storeId: -1,
          storeName: 'All stores',
          color: SERIES_COLORS[0]!,
          points,
        },
      ];
    }
    const byStore = new Map<number, PricePoint[]>();
    for (const p of points) {
      const bucket = byStore.get(p.storeId);
      if (bucket) bucket.push(p);
      else byStore.set(p.storeId, [p]);
    }
    const out: StoreSeries[] = [];
    let i = 0;
    for (const [storeId, sp] of byStore.entries()) {
      out.push({
        storeId,
        storeName: storeById.get(storeId)?.name ?? 'Unknown',
        color: SERIES_COLORS[i % SERIES_COLORS.length]!,
        points: sp,
      });
      i++;
    }
    return out.sort((a, b) => b.points.length - a.points.length);
  }, [perStore, points, storeById]);

  // Goods that have at least one price point (filtered by query, ranked by hits).
  const candidates = useMemo<{ good: Good; pointCount: number }[]>(() => {
    const counts = new Map<number, number>();
    for (const item of allItems) {
      const trip = tripById.get(item.trip_id);
      if (!trip) continue;
      if (itemPrice(item) <= 0) continue;
      counts.set(item.good_id, (counts.get(item.good_id) ?? 0) + 1);
    }
    return goodsFiltered
      .map((g) => ({ good: g, pointCount: counts.get(g.id) ?? 0 }))
      .filter((g) => g.pointCount > 0 || debouncedQuery.length > 0)
      .sort((a, b) => b.pointCount - a.pointCount);
  }, [goodsFiltered, allItems, tripById, debouncedQuery]);

  const storesById = (id: number): Store | undefined => storeById.get(id);

  return {
    loading: tripsLoading || itemsLoading,
    query,
    setQuery,
    debouncedQuery,
    goodId,
    setGoodId,
    selectedGood,
    perStore,
    setPerStore,
    candidates,
    points,
    series,
    overall,
    storesById,
    currency: settings?.global_currency_code ?? 'USD',
  } as const;
}
