import { useMemo } from 'react';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Trip, TripItem } from '@/domain/entities';
import { useSettings } from '@/ui/hooks/useSettings';
import { useTrips } from '@/ui/hooks/useTrips';
import { useAllTripItems } from '@/ui/hooks/useTripItems';

function actualSubtotal(item: TripItem): number {
  return (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
}

function plannedSubtotal(item: TripItem): number {
  return (item.planned_quantity ?? 0) * (item.planned_unit_price ?? 0);
}

function tripTotal(items: TripItem[], trip: Trip): number {
  if (trip.status === TRIP_STATUS_ENUM.COMPLETED) {
    return items.reduce(
      (sum, i) => sum + (i.is_checked ? actualSubtotal(i) : 0),
      0,
    );
  }
  return items.reduce((sum, i) => sum + plannedSubtotal(i), 0);
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function startOfPrevMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() - 1, 1);
}

export function useInsightsOverviewController() {
  const { data: trips = [], isLoading: tripsLoading } = useTrips({
    statuses: [TRIP_STATUS_ENUM.COMPLETED],
  });
  const { data: allItems = [], isLoading: itemsLoading } = useAllTripItems();
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

  const stats = useMemo(() => {
    const now = new Date();
    const mtdStart = startOfMonth(now);
    const prevStart = startOfPrevMonth(now);
    let mtdTotal = 0;
    let prevTotal = 0;
    let mtdCount = 0;
    let prevCount = 0;
    let lifetimeTotal = 0;
    for (const trip of trips) {
      const items = itemsByTrip.get(trip.id) ?? [];
      const total = tripTotal(items, trip);
      lifetimeTotal += total;
      const when = trip.completed_at ?? trip.started_at;
      if (!when) continue;
      if (when >= mtdStart) {
        mtdTotal += total;
        mtdCount += 1;
      } else if (when >= prevStart) {
        prevTotal += total;
        prevCount += 1;
      }
    }
    const delta = mtdTotal - prevTotal;
    const deltaPct = prevTotal > 0 ? delta / prevTotal : null;
    return {
      mtdTotal,
      prevTotal,
      mtdCount,
      prevCount,
      lifetimeTotal,
      lifetimeCount: trips.length,
      delta,
      deltaPct,
    } as const;
  }, [trips, itemsByTrip]);

  const insight = useMemo(() => {
    if (stats.mtdCount === 0) {
      return 'No completed trips this month yet — start a new one to begin tracking.';
    }
    if (stats.deltaPct === null) {
      return `You've completed ${stats.mtdCount} ${stats.mtdCount === 1 ? 'trip' : 'trips'} this month.`;
    }
    const pct = Math.abs(stats.deltaPct * 100);
    if (Math.abs(stats.deltaPct) < 0.02) {
      return `Spending is flat versus last month across ${stats.mtdCount} ${stats.mtdCount === 1 ? 'trip' : 'trips'}.`;
    }
    if (stats.deltaPct > 0) {
      return `Spending is up ${pct.toFixed(0)}% versus last month across ${stats.mtdCount} ${stats.mtdCount === 1 ? 'trip' : 'trips'}.`;
    }
    return `Spending is down ${pct.toFixed(0)}% versus last month across ${stats.mtdCount} ${stats.mtdCount === 1 ? 'trip' : 'trips'}.`;
  }, [stats]);

  return {
    loading: tripsLoading || itemsLoading,
    currency: settings?.global_currency_code ?? 'USD',
    stats,
    insight,
  } as const;
}
