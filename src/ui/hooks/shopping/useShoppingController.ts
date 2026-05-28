import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { TripItem } from '@/domain/entities';
import { useGoods } from '@/ui/hooks/useGoods';
import { useStores } from '@/ui/hooks/useStores';
import { useTrip } from '@/ui/hooks/useTrips';
import { useTripItems } from '@/ui/hooks/useTripItems';

function lineTotal(item: TripItem): number {
  if (item.is_checked) {
    return (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
  }
  return (item.planned_quantity ?? 0) * (item.planned_unit_price ?? 0);
}

export function useShoppingController(tripId: number) {
  const router = useRouter();

  const { data: trip, isLoading } = useTrip(tripId);
  const { data: items = [] } = useTripItems(tripId);
  const { data: stores = [] } = useStores();
  const { data: goods = [] } = useGoods({ archived: true });

  const goodById = useMemo(() => new Map(goods.map((g) => [g.id, g])), [goods]);
  const sortedItems = useMemo(
    () => items.slice().sort((a, b) => a.sort_order - b.sort_order),
    [items],
  );

  if (isLoading) return { loading: true, notFound: false, trip: null } as const;
  if (!trip) return { loading: false, notFound: true, trip: null } as const;

  const store = stores.find((s) => s.id === trip.store_id);
  const runningTotal = items.reduce((sum, i) => sum + lineTotal(i), 0);
  const itemsBought = items.filter((i) => i.is_checked).length;

  return {
    loading: false,
    notFound: false,
    trip,
    store,
    items,
    sortedItems,
    runningTotal,
    itemsBought,
    itemsTotal: items.length,
    currency: trip.resolved_currency_code,
    goodFor: (item: TripItem) => goodById.get(item.good_id),
    exit: () => router.back(),
  } as const;
}
