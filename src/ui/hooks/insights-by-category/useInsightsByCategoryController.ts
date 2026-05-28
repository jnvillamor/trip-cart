import { useMemo, useState } from 'react';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { TripItem } from '@/domain/entities';
import { RangePreset } from '@/ui/components/insights/DateRangeChips';
import { useCategories } from '@/ui/hooks/useCategories';
import { useGoods } from '@/ui/hooks/useGoods';
import { useSettings } from '@/ui/hooks/useSettings';
import { useTrips } from '@/ui/hooks/useTrips';
import { useAllTripItems } from '@/ui/hooks/useTripItems';
import { rangeStart } from '@/ui/lib/insights';

export type ChartMode = 'pie' | 'bar';

export type CategorySlice = {
  categoryId: number | null;
  label: string;
  color: string;
  total: number;
};

const UNCATEGORIZED_COLOR = '#9E9E9E';

function actualSubtotal(item: TripItem): number {
  if (!item.is_checked) return 0;
  return (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
}

export function useInsightsByCategoryController() {
  const [range, setRange] = useState<RangePreset>('3m');
  const [mode, setMode] = useState<ChartMode>('pie');

  const { data: trips = [], isLoading: tripsLoading } = useTrips({
    statuses: [TRIP_STATUS_ENUM.COMPLETED],
  });
  const { data: allItems = [], isLoading: itemsLoading } = useAllTripItems();
  const { data: categories = [] } = useCategories({ archived: true });
  const { data: goods = [] } = useGoods({ archived: true });
  const { data: settings } = useSettings();

  const tripById = useMemo(() => new Map(trips.map((t) => [t.id, t])), [trips]);
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const goodById = useMemo(() => new Map(goods.map((g) => [g.id, g])), [goods]);

  const slices = useMemo<CategorySlice[]>(() => {
    const start = rangeStart(range);
    const totals = new Map<number | null, number>();
    for (const item of allItems) {
      const trip = tripById.get(item.trip_id);
      if (!trip) continue;
      const when = trip.completed_at ?? trip.started_at;
      if (!when) continue;
      if (start && when < start) continue;
      const sub = actualSubtotal(item);
      if (sub === 0) continue;
      const cid =
        item.category_id_snapshot ?? goodById.get(item.good_id)?.default_category_id ?? null;
      totals.set(cid, (totals.get(cid) ?? 0) + sub);
    }
    const out: CategorySlice[] = [];
    for (const [cid, total] of totals.entries()) {
      const cat = cid != null ? categoryById.get(cid) : undefined;
      out.push({
        categoryId: cid,
        label: cat?.name ?? 'Uncategorized',
        color: cat?.color_hex ?? UNCATEGORIZED_COLOR,
        total,
      });
    }
    return out.sort((a, b) => b.total - a.total);
  }, [range, allItems, tripById, categoryById, goodById]);

  const grandTotal = slices.reduce((sum, s) => sum + s.total, 0);

  return {
    loading: tripsLoading || itemsLoading,
    range,
    setRange,
    mode,
    setMode,
    slices,
    grandTotal,
    currency: settings?.global_currency_code ?? 'USD',
  } as const;
}
