import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { TripStatus } from '@/domain/schemas';
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
