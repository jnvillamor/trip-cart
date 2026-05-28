import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { TripItem } from '@/domain/entities';
import { useGoods } from '@/ui/hooks/useGoods';
import { useStores } from '@/ui/hooks/useStores';
import { useTrip } from '@/ui/hooks/useTrips';
import {
  useRemoveTripItem,
  useToggleTripItem,
  useTripItems,
  useUpdateTripItem,
} from '@/ui/hooks/useTripItems';

function lineTotal(item: TripItem): number {
  if (item.is_checked) {
    return (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
  }
  return (item.planned_quantity ?? 0) * (item.planned_unit_price ?? 0);
}

export type PriceEditTarget = {
  itemId: number;
  initial: number;
};

export function useShoppingController(tripId: number) {
  const router = useRouter();

  const { data: trip, isLoading } = useTrip(tripId);
  const { data: items = [] } = useTripItems(tripId);
  const { data: stores = [] } = useStores();
  const { data: goods = [] } = useGoods({ archived: true });

  const toggleItem = useToggleTripItem(tripId);
  const updateItem = useUpdateTripItem(tripId);
  const removeItem = useRemoveTripItem(tripId);

  const [editing, setEditing] = useState<number | null>(null);
  const [priceEdit, setPriceEdit] = useState<PriceEditTarget | null>(null);

  const goodById = useMemo(() => new Map(goods.map((g) => [g.id, g])), [goods]);
  const sortedItems = useMemo(
    () => items.slice().sort((a, b) => a.sort_order - b.sort_order),
    [items],
  );
  const unboughtItems = useMemo(
    () => sortedItems.filter((i) => !i.is_checked),
    [sortedItems],
  );
  const boughtItems = useMemo(
    () => sortedItems.filter((i) => i.is_checked),
    [sortedItems],
  );

  if (isLoading) return { loading: true, notFound: false, trip: null } as const;
  if (!trip) return { loading: false, notFound: true, trip: null } as const;

  const store = stores.find((s) => s.id === trip.store_id);
  const runningTotal = items.reduce((sum, i) => sum + lineTotal(i), 0);
  const itemsBought = items.filter((i) => i.is_checked).length;
  const editingItem = editing != null ? items.find((i) => i.id === editing) : undefined;

  function activeQtyField(item: TripItem) {
    return item.is_checked ? 'actual_quantity' : 'planned_quantity';
  }
  function activePriceField(item: TripItem) {
    return item.is_checked ? 'actual_unit_price' : 'planned_unit_price';
  }

  function toggleChecked(item: TripItem) {
    toggleItem.mutate(item.id);
  }

  function adjustQty(item: TripItem, delta: number) {
    const field = activeQtyField(item);
    const current = item[field] ?? 0;
    const next = Math.max(0, current + delta);
    if (next === 0 && current > 0) {
      removeItem.mutate(item.id);
      setEditing(null);
      return;
    }
    updateItem.mutate({ id: item.id, input: { [field]: next } });
  }

  function openPriceEditor(item: TripItem) {
    const field = activePriceField(item);
    setEditing(null);
    setPriceEdit({ itemId: item.id, initial: item[field] ?? 0 });
  }

  function savePrice(value: number) {
    if (!priceEdit) return;
    const target = items.find((i) => i.id === priceEdit.itemId);
    if (!target) {
      setPriceEdit(null);
      return;
    }
    const field = activePriceField(target);
    updateItem.mutate({ id: priceEdit.itemId, input: { [field]: value } });
    setPriceEdit(null);
  }

  return {
    loading: false,
    notFound: false,
    trip,
    store,
    items,
    sortedItems,
    unboughtItems,
    boughtItems,
    runningTotal,
    itemsBought,
    itemsTotal: items.length,
    currency: trip.resolved_currency_code,
    goodFor: (item: TripItem) => goodById.get(item.good_id),
    editing,
    editingItem,
    priceEdit,
    setEditing,
    setPriceEdit,
    toggleChecked,
    adjustQty,
    openPriceEditor,
    savePrice,
    exit: () => router.back(),
  } as const;
}
