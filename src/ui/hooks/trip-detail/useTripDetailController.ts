import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Category, Good, TripItem } from '@/domain/entities';
import { ConfirmRequest } from '@/ui/components/ConfirmDialog';
import { useSnackbar } from '@/ui/components/Snackbar';
import { PrimaryAction } from '@/ui/components/trip-detail/BottomActionBar';
import { MoreAction } from '@/ui/components/trip-detail/MoreActionsSheet';
import { useActiveTrip } from '@/ui/hooks/useActiveTrip';
import { useCategories } from '@/ui/hooks/useCategories';
import { useGoods } from '@/ui/hooks/useGoods';
import { useStores } from '@/ui/hooks/useStores';
import {
  useCancelTrip,
  useCompleteTrip,
  useDeleteTrip,
  useDuplicateTrip,
  useStartTrip,
  useTrip,
} from '@/ui/hooks/useTrips';
import {
  useRemoveTripItem,
  useTripItems,
  useUpdateTripItem,
} from '@/ui/hooks/useTripItems';

export type PriceEditTarget = {
  itemId: number;
  field: 'planned_unit_price' | 'actual_unit_price';
  initial: number;
};

export type TripDetailController = ReturnType<typeof useTripDetailController>;

export function useTripDetailController(tripId: number) {
  const router = useRouter();
  const snackbar = useSnackbar();

  const { data: trip, isLoading } = useTrip(tripId);
  const { data: items = [] } = useTripItems(tripId);
  const { data: stores = [] } = useStores();
  const { data: categories = [] } = useCategories();
  const { data: goods = [] } = useGoods();
  const { data: activeTrip } = useActiveTrip();

  const updateItem = useUpdateTripItem(tripId);
  const removeItem = useRemoveTripItem(tripId);
  const startTrip = useStartTrip(tripId);
  const completeTrip = useCompleteTrip(tripId);
  const cancelTrip = useCancelTrip(tripId);
  const duplicateTrip = useDuplicateTrip();
  const deleteTrip = useDeleteTrip();

  const [priceEdit, setPriceEdit] = useState<PriceEditTarget | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const store = stores.find((s) => s.id === trip?.store_id);
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const goodById = useMemo(() => new Map(goods.map((g) => [g.id, g])), [goods]);

  const sortedItems = useMemo(
    () => items.slice().sort((a, b) => a.sort_order - b.sort_order),
    [items],
  );

  const plannedTotal = items.reduce(
    (sum, i) => sum + (i.planned_quantity ?? 0) * (i.planned_unit_price ?? 0),
    0,
  );
  const actualTotal = items
    .filter((i) => i.is_checked)
    .reduce((sum, i) => sum + (i.actual_quantity ?? 0) * (i.actual_unit_price ?? 0), 0);
  const itemsBought = items.filter((i) => i.is_checked).length;

  if (isLoading) {
    return { loading: true, notFound: false, trip: null } as const;
  }
  if (!trip) {
    return { loading: false, notFound: true, trip: null } as const;
  }

  const isShopping = trip.status === TRIP_STATUS_ENUM.IN_PROGRESS;
  const editable = trip.is_editable;
  const currency = trip.resolved_currency_code;
  const hasItems = items.length > 0;
  const otherActiveTripId =
    activeTrip && activeTrip.id !== trip.id ? activeTrip.id : null;
  const canStart = !otherActiveTripId && hasItems;

  function fieldFor(item: TripItem, kind: 'qty' | 'price') {
    const useActual = isShopping && item.is_checked;
    if (kind === 'qty') return useActual ? 'actual_quantity' : 'planned_quantity';
    return useActual ? 'actual_unit_price' : 'planned_unit_price';
  }

  function adjustQty(item: TripItem, delta: number) {
    if (!editable) return;
    const field = fieldFor(item, 'qty') as 'planned_quantity' | 'actual_quantity';
    const current = item[field] ?? 0;
    const next = Math.max(0, current + delta);
    if (next === 0 && current > 0) {
      removeItem.mutate(item.id);
      return;
    }
    updateItem.mutate({ id: item.id, input: { [field]: next } });
  }

  function openPriceEditor(item: TripItem) {
    if (!editable) return;
    const field = fieldFor(item, 'price') as 'planned_unit_price' | 'actual_unit_price';
    setPriceEdit({ itemId: item.id, field, initial: item[field] ?? 0 });
  }

  function savePrice(value: number) {
    if (!priceEdit) return;
    updateItem.mutate({
      id: priceEdit.itemId,
      input: { [priceEdit.field]: value },
    });
    setPriceEdit(null);
  }

  async function applyOrder(newOrder: TripItem[]) {
    const updates = newOrder
      .map((item, i) => (item.sort_order !== i ? { id: item.id, sort_order: i } : null))
      .filter((x): x is { id: number; sort_order: number } => x !== null);
    await Promise.all(
      updates.map((u) =>
        updateItem.mutateAsync({ id: u.id, input: { sort_order: u.sort_order } }),
      ),
    );
  }

  function getItemCategoryId(item: TripItem): number | null {
    return (
      item.category_id_snapshot ?? goodById.get(item.good_id)?.default_category_id ?? null
    );
  }

  async function sortByCategory() {
    const grouped = new Map<number | null, TripItem[]>();
    for (const item of sortedItems) {
      const cid = getItemCategoryId(item);
      const bucket = grouped.get(cid);
      if (bucket) bucket.push(item);
      else grouped.set(cid, [item]);
    }
    const cids = Array.from(grouped.keys()).sort((a, b) => {
      if (a === null) return 1;
      if (b === null) return -1;
      const na = categoryById.get(a)?.name ?? '';
      const nb = categoryById.get(b)?.name ?? '';
      return na.localeCompare(nb);
    });
    const newOrder: TripItem[] = [];
    for (const cid of cids) newOrder.push(...grouped.get(cid)!);
    await applyOrder(newOrder);
  }

  function categoryFor(item: TripItem): Category | undefined {
    const cid = getItemCategoryId(item);
    return cid != null ? categoryById.get(cid) : undefined;
  }

  function goodFor(item: TripItem): Good | undefined {
    return goodById.get(item.good_id);
  }

  const goAddItems = () => router.push(`/trips/${tripId}/add-items` as never);
  const goEdit = () => router.push(`/trips/${tripId}/edit` as never);

  const confirmStart = () =>
    setConfirm({
      title: 'Start shopping?',
      message: 'You can edit actual prices and check items off as you buy them.',
      confirmLabel: 'Start',
      onConfirm: async () => {
        await startTrip.mutateAsync();
        router.push(`/shopping/${tripId}` as never);
      },
    });
  const confirmComplete = () =>
    setConfirm({
      title: 'Complete this trip?',
      message: 'Completed trips are locked. Totals will be finalized.',
      confirmLabel: 'Complete',
      onConfirm: async () => {
        await completeTrip.mutateAsync();
      },
    });
  const confirmCancel = () =>
    setConfirm({
      title: 'Cancel this trip?',
      message: 'The trip will be marked as canceled. Items are kept for reference.',
      confirmLabel: 'Cancel trip',
      destructive: true,
      onConfirm: async () => {
        await cancelTrip.mutateAsync();
        snackbar.show({ kind: 'success', message: 'Trip canceled.' });
      },
    });
  const doDuplicate = async () => {
    const created = await duplicateTrip.mutateAsync(tripId);
    router.replace(`/trips/${created.id}` as never);
    snackbar.show({ kind: 'success', message: 'Trip duplicated.' });
  };
  const confirmDelete = () =>
    setConfirm({
      title: 'Delete this trip?',
      message: 'This permanently removes the trip and all its items.',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await deleteTrip.mutateAsync(tripId);
        router.back();
        snackbar.show({ kind: 'success', message: 'Trip deleted.' });
      },
    });

  const primary: PrimaryAction = (() => {
    if (!editable) {
      return { label: 'Duplicate', onPress: doDuplicate, disabled: false };
    }
    if (isShopping) {
      return { label: 'Complete trip', onPress: confirmComplete, disabled: false };
    }
    if (!hasItems) {
      return { label: 'Add items', onPress: goAddItems, disabled: false };
    }
    return {
      label: otherActiveTripId ? 'Another trip is active' : 'Start shopping',
      onPress: confirmStart,
      disabled: !canStart,
    };
  })();
  const primaryKey = (() => {
    if (!editable) return 'duplicate';
    if (isShopping) return 'complete';
    if (!hasItems) return 'add';
    return 'start';
  })();

  const moreActions: MoreAction[] = (() => {
    const list: MoreAction[] = [];
    if (editable) list.push({ key: 'add', label: 'Add items', icon: 'add', onPress: goAddItems });
    if (editable) {
      list.push({
        key: 'edit',
        label: 'Edit trip',
        icon: 'edit',
        onPress: goEdit,
      });
    }
    if (editable && hasItems) {
      list.push({
        key: 'sort-category',
        label: 'Sort by category',
        icon: 'sort',
        onPress: sortByCategory,
      });
    }
    if (trip.status === TRIP_STATUS_ENUM.PLANNED) {
      list.push({
        key: 'start',
        label: 'Start shopping',
        icon: 'play-arrow',
        onPress: confirmStart,
        disabled: !canStart,
      });
    }
    if (isShopping) {
      list.push({
        key: 'complete',
        label: 'Complete trip',
        icon: 'check',
        onPress: confirmComplete,
      });
    }
    if (editable) {
      list.push({
        key: 'cancel',
        label: 'Cancel trip',
        icon: 'block',
        onPress: confirmCancel,
      });
    }
    list.push({
      key: 'duplicate',
      label: 'Duplicate',
      icon: 'content-copy',
      onPress: doDuplicate,
    });
    list.push({
      key: 'delete',
      label: 'Delete trip',
      icon: 'delete',
      onPress: confirmDelete,
      destructive: true,
    });
    return list.filter((a) => a.key !== primaryKey);
  })();

  return {
    loading: false,
    notFound: false,
    trip,
    items,
    sortedItems,
    store,
    editable,
    isShopping,
    currency,
    plannedTotal,
    actualTotal,
    itemsBought,
    primary,
    moreActions,
    priceEdit,
    confirm,
    moreOpen,
    setPriceEdit,
    setConfirm,
    setMoreOpen,
    adjustQty,
    openPriceEditor,
    savePrice,
    categoryFor,
    goodFor,
    getItemCategoryId,
  } as const;
}
