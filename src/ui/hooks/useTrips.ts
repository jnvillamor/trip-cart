import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { TripStatus } from '@/domain/schemas';
import { createTripItemRepo } from '@/domain/repositories/trip-item.repo';
import { createTripRepo } from '@/domain/repositories/trip.repo';
import { CreateTripInput, UpdateTripInput } from '@/domain/schemas';

async function getRepo() {
  const db = await initDatabase();
  return createTripRepo(db);
}

export function useTrips(options: {
  archived?: boolean;
  statuses?: TripStatus[];
  storeId?: number;
} = {}) {
  const { archived = false, statuses, storeId } = options;
  return useQuery({
    queryKey: [
      'trips',
      { archived, statuses: statuses ?? null, storeId: storeId ?? null },
    ],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.list({ includeArchived: archived, statuses, storeId });
    },
  });
}

export function useTrip(id: number) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.findById(id);
    },
    enabled: Number.isFinite(id),
  });
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTripInput) => {
      const repo = await getRepo();
      return repo.create(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}

export function useUpdateTrip(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTripInput) => {
      const repo = await getRepo();
      return repo.update(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trips', id] });
    },
  });
}

export function useStartTrip(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.start(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trips', id] });
      qc.invalidateQueries({ queryKey: ['trips', 'active'] });
    },
  });
}

export function useCompleteTrip(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.complete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trips', id] });
      qc.invalidateQueries({ queryKey: ['trips', 'active'] });
    },
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const repo = await getRepo();
      return repo.remove(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trips', 'active'] });
    },
  });
}

export function useCancelTrip(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.update(id, { status: TRIP_STATUS_ENUM.CANCELED });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trips', id] });
      qc.invalidateQueries({ queryKey: ['trips', 'active'] });
    },
  });
}

export function useDuplicateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sourceId: number) => {
      const db = await initDatabase();
      const tripRepo = createTripRepo(db);
      const itemRepo = createTripItemRepo(db);
      const source = await tripRepo.findById(sourceId);
      if (!source) throw new Error('Source trip not found');
      const sourceItems = await itemRepo.list({ tripId: sourceId });
      const newTrip = await tripRepo.create({
        name: `${source.name} (copy)`,
        store_id: source.store_id,
        resolved_currency_code: source.resolved_currency_code,
        notes: source.notes ?? undefined,
      });
      for (const item of sourceItems) {
        await itemRepo.create(newTrip.id, {
          good_id: item.good_id,
          planned_quantity: item.planned_quantity ?? 0,
          planned_unit_price: item.planned_unit_price ?? 0,
          notes: item.notes ?? undefined,
        });
      }
      return newTrip;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trips'] }),
  });
}
