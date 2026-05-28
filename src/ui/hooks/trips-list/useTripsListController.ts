import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StatusFilter } from '@/ui/components/trips-list/StatusFilterChips';
import { useStores } from '@/ui/hooks/useStores';
import { useTrips } from '@/ui/hooks/useTrips';

export function useTripsListController() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: trips = [], isLoading } = useTrips({
    statuses: statusFilter === 'all' ? undefined : [statusFilter],
  });
  const { data: stores = [] } = useStores();

  const storeById = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);

  return {
    trips,
    isLoading,
    statusFilter,
    setStatusFilter,
    storeNameFor: (storeId: number) => storeById.get(storeId)?.name,
    openTrip: (id: number) => router.push(`/trips/${id}` as never),
    openNewTrip: () => router.push('/trips/new' as never),
  } as const;
}
