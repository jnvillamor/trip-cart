import { useMemo, useState } from 'react';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Trip, TripItem } from '@/domain/entities';
import { RangePreset } from '@/ui/components/insights/DateRangeChips';
import { useSettings } from '@/ui/hooks/useSettings';
import { useStores } from '@/ui/hooks/useStores';
import { useTrips } from '@/ui/hooks/useTrips';
import { useAllTripItems } from '@/ui/hooks/useTripItems';
import { rangeStart } from '@/ui/lib/insights';

export type TripSummary = {
  trip: Trip;
  storeName: string;
  date: Date;
  planned: number;
  actual: number;
  variance: number;
  variancePct: number | null;
  itemsBought: number;
  itemsTotal: number;
};

function plannedSubtotal(item: TripItem): number {
  return (item.planned_quantity ?? 0) * (item.planned_unit_price ?? 0);
}

function actualSubtotal(item: TripItem): number {
  if (!item.is_checked) return 0;
  return (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
}

export function useInsightsTripSummariesController() {
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

  const summaries = useMemo<TripSummary[]>(() => {
    const start = rangeStart(range);
    const out: TripSummary[] = [];
    for (const trip of trips) {
      const when = trip.completed_at ?? trip.started_at;
      if (!when) continue;
      if (start && when < start) continue;
      const items = itemsByTrip.get(trip.id) ?? [];
      const planned = items.reduce((s, i) => s + plannedSubtotal(i), 0);
      const actual = items.reduce((s, i) => s + actualSubtotal(i), 0);
      const variance = actual - planned;
      const variancePct = planned > 0 ? variance / planned : null;
      const itemsBought = items.filter((i) => i.is_checked).length;
      out.push({
        trip,
        storeName: storeById.get(trip.store_id)?.name ?? 'Unknown',
        date: when,
        planned,
        actual,
        variance,
        variancePct,
        itemsBought,
        itemsTotal: items.length,
      });
    }
    return out.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [range, trips, itemsByTrip, storeById]);

  const aggregate = useMemo(() => {
    const planned = summaries.reduce((s, x) => s + x.planned, 0);
    const actual = summaries.reduce((s, x) => s + x.actual, 0);
    const variance = actual - planned;
    const variancePct = planned > 0 ? variance / planned : null;
    return { planned, actual, variance, variancePct } as const;
  }, [summaries]);

  return {
    loading: tripsLoading || itemsLoading,
    range,
    setRange,
    summaries,
    aggregate,
    currency: settings?.global_currency_code ?? 'USD',
  } as const;
}
