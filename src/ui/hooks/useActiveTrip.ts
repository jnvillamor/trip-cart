import { useQuery } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { createTripRepo } from '@/domain/repositories/trip.repo';

export function useActiveTrip() {
  return useQuery({
    queryKey: ['trips', 'active'],
    queryFn: async () => {
      const db = await initDatabase();
      const repo = createTripRepo(db);
      const inProgress = await repo.list({ statuses: [TRIP_STATUS_ENUM.IN_PROGRESS] });
      return inProgress[0] ?? null;
    },
  });
}
