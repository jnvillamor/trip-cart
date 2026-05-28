import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ConfirmRequest } from '@/ui/components/ConfirmDialog';
import { useSnackbar } from '@/ui/components/Snackbar';
import { StatusFilter } from '@/ui/components/trips-list/StatusFilterChips';
import { useStores } from '@/ui/hooks/useStores';
import { useDeleteTrip, useTrips } from '@/ui/hooks/useTrips';

export function useTripsListController() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  const { data: trips = [], isLoading } = useTrips({
    statuses: statusFilter === 'all' ? undefined : [statusFilter],
  });
  const { data: stores = [] } = useStores();
  const deleteTrip = useDeleteTrip();

  const storeById = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);
  const selectionMode = selectedIds.size > 0;

  function toggleSelection(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function startSelection(id: number) {
    setSelectedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function onTripPress(id: number) {
    if (selectionMode) {
      toggleSelection(id);
      return;
    }
    router.push(`/trips/${id}` as never);
  }

  function confirmDeleteSelected() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const noun = ids.length === 1 ? 'trip' : 'trips';
    setConfirm({
      title: `Delete ${ids.length} ${noun}?`,
      message: 'This permanently removes the selected trips and all their items.',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        await Promise.all(ids.map((id) => deleteTrip.mutateAsync(id)));
        setSelectedIds(new Set());
        snackbar.show({
          kind: 'success',
          message: `Deleted ${ids.length} ${ids.length === 1 ? 'trip' : 'trips'}.`,
        });
      },
    });
  }

  return {
    trips,
    isLoading,
    statusFilter,
    setStatusFilter,
    selectedIds,
    selectionMode,
    selectedCount: selectedIds.size,
    confirm,
    setConfirm,
    deleting: deleteTrip.isPending,
    storeNameFor: (storeId: number) => storeById.get(storeId)?.name,
    onTripPress,
    onTripLongPress: startSelection,
    toggleSelection,
    clearSelection,
    confirmDeleteSelected,
    openNewTrip: () => router.push('/trips/new' as never),
  } as const;
}
