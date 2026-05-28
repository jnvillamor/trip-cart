import { useMemo, useState } from 'react';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { TripItem } from '@/domain/entities';
import { RangePreset } from '@/ui/components/insights/DateRangeChips';
import { useSettings } from '@/ui/hooks/useSettings';
import { useStores } from '@/ui/hooks/useStores';
import { useTrips } from '@/ui/hooks/useTrips';
import { useAllTripItems } from '@/ui/hooks/useTripItems';
import { rangeStart } from '@/ui/lib/insights';

function actualSubtotal(item: TripItem): number {
  if (!item.is_checked) return 0;
  return (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
}

export type StoreBar = {
  storeId: number;
  label: string;
  total: number;
};

export function useInsightsByStoreController() {
  const [range, setRange] = useState<RangePreset>('3m');

  const { data: trips = [], isLoading: tripsLoading } = useTrips({
    statuses: [TRIP_STATUS_ENUM.COMPLETED],
  });
  const { data: allItems = [], isLoading: itemsLoading } = useAllTripItems();
  const { data: stores = [] } = useStores({ archived: true });
  const { data: settings } = useSettings();

  const itemsByTrip = useMemo(() => {
    const map = new Map<number, TripItem[]>();
    for (const item of allItems) {
      const bucket = map.get(item.trip_id);
      if (bucket) bucket.push(item);
      else map.set(item.trip_id, [item]);
    }
    return map;
  }, [allItems]);

  const storeById = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);

  const bars = useMemo<StoreBar[]>(() => {
    const start = rangeStart(range, new Date());
    const totals = new Map<number, number>();
    for (const trip of trips) {
      const when = trip.completed_at ?? trip.started_at;
      if (!when) continue;
      if (start && when < start) continue;
      const items = itemsByTrip.get(trip.id) ?? [];
      const total = items.reduce((sum, i) => sum + actualSubtotal(i), 0);
      if (total === 0) continue;
      totals.set(trip.store_id, (totals.get(trip.store_id) ?? 0) + total);
    }
    const out: StoreBar[] = [];
    for (const [storeId, total] of totals.entries()) {
      out.push({
        storeId,
        label: storeById.get(storeId)?.name ?? 'Unknown',
        total,
      });
    }
    return out.sort((a, b) => b.total - a.total);
  }, [range, trips, itemsByTrip, storeById]);

  const grandTotal = bars.reduce((sum, b) => sum + b.total, 0);
  const tripsInRange = useMemo(() => {
    const start = rangeStart(range, new Date());
    return trips.filter((t) => {
      const when = t.completed_at ?? t.started_at;
      if (!when) return false;
      if (start && when < start) return false;
      return true;
    }).length;
  }, [range, trips]);

  return {
    loading: tripsLoading || itemsLoading,
    range,
    setRange,
    bars,
    grandTotal,
    tripsInRange,
    currency: settings?.global_currency_code ?? 'USD',
  } as const;
}
