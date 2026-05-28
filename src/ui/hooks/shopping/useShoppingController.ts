import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { TripItem } from '@/domain/entities';
import { UpdateTripItemInput } from '@/domain/schemas';
import { ConfirmRequest } from '@/ui/components/ConfirmDialog';
import { useGoods } from '@/ui/hooks/useGoods';
import { useStores } from '@/ui/hooks/useStores';
import { useCompleteTrip, useTrip } from '@/ui/hooks/useTrips';
import {
  useRemoveTripItem,
  useTripItems,
  useUpdateTripItem,
} from '@/ui/hooks/useTripItems';

export type PriceEditTarget = {
  itemId: number;
  initial: number;
};

export function effectiveQty(item: TripItem): number {
  const actual = item.actual_quantity ?? 0;
  if (actual > 0) return actual;
  return item.planned_quantity ?? 0;
}

export function effectivePrice(item: TripItem): number {
  const actual = item.actual_unit_price ?? 0;
  if (actual > 0) return actual;
  return item.planned_unit_price ?? 0;
}

function boughtSubtotal(item: TripItem): number {
  return (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
}

function plannedSubtotal(item: TripItem): number {
  return (item.planned_quantity ?? 0) * (item.planned_unit_price ?? 0);
}

export function useShoppingController(tripId: number) {
  const router = useRouter();

  const { data: trip, isLoading } = useTrip(tripId);
  const { data: items = [] } = useTripItems(tripId);
  const { data: stores = [] } = useStores();
  const { data: goods = [] } = useGoods({ archived: true });

  const updateItem = useUpdateTripItem(tripId);
  const removeItem = useRemoveTripItem(tripId);
  const completeTrip = useCompleteTrip(tripId);

  const [editing, setEditing] = useState<number | null>(null);
  const [priceEdit, setPriceEdit] = useState<PriceEditTarget | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);

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
  const runningTotal = boughtItems.reduce((sum, i) => sum + boughtSubtotal(i), 0);
  const plannedTotal = items.reduce((sum, i) => sum + plannedSubtotal(i), 0);
  const itemsBought = boughtItems.length;
  const editingItem = editing != null ? items.find((i) => i.id === editing) : undefined;

  function confirmComplete() {
    setCompleteOpen(true);
  }

  async function doComplete() {
    await completeTrip.mutateAsync();
    setCompleteOpen(false);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/trips/${tripId}` as never);
    }
  }

  function toggleChecked(item: TripItem) {
    const patch: Partial<UpdateTripItemInput> = { is_checked: !item.is_checked };
    if (!item.is_checked) {
      if ((item.actual_quantity ?? 0) === 0 && (item.planned_quantity ?? 0) > 0) {
        patch.actual_quantity = item.planned_quantity ?? 0;
      }
      if ((item.actual_unit_price ?? 0) === 0 && (item.planned_unit_price ?? 0) > 0) {
        patch.actual_unit_price = item.planned_unit_price ?? 0;
      }
    }
    updateItem.mutate({ id: item.id, input: patch });
  }

  function adjustQty(item: TripItem, delta: number) {
    const current = effectiveQty(item);
    const next = Math.max(0, current + delta);
    if (next === 0 && current > 0) {
      removeItem.mutate(item.id);
      setEditing(null);
      return;
    }
    updateItem.mutate({ id: item.id, input: { actual_quantity: next } });
  }

  function openPriceEditor(item: TripItem) {
    setEditing(null);
    setPriceEdit({ itemId: item.id, initial: effectivePrice(item) });
  }

  function savePrice(value: number) {
    if (!priceEdit) return;
    updateItem.mutate({
      id: priceEdit.itemId,
      input: { actual_unit_price: value },
    });
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
    plannedTotal,
    itemsBought,
    itemsTotal: items.length,
    currency: trip.resolved_currency_code,
    goodFor: (item: TripItem) => goodById.get(item.good_id),
    editing,
    editingItem,
    priceEdit,
    confirm,
    completing: completeTrip.isPending,
    completeOpen,
    setEditing,
    setPriceEdit,
    setConfirm,
    setCompleteOpen,
    toggleChecked,
    adjustQty,
    openPriceEditor,
    savePrice,
    confirmComplete,
    doComplete,
    openAddItems: () => router.push(`/trips/${tripId}/add-items` as never),
    exit: () => router.back(),
  } as const;
}
