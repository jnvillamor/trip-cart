import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { createTripItemRepo } from '@/domain/repositories/trip-item.repo';
import { CreateTripItemInput, UpdateTripItemInput } from '@/domain/schemas';

async function getRepo() {
  const db = await initDatabase();
  return createTripItemRepo(db);
}

export function useTripItems(tripId: number) {
  return useQuery({
    queryKey: ['trip-items', tripId],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.list({ tripId });
    },
    enabled: Number.isFinite(tripId),
  });
}

export function useCreateTripItem(tripId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTripItemInput) => {
      const repo = await getRepo();
      return repo.create(tripId, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip-items', tripId] }),
  });
}

export function useUpdateTripItem(tripId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number;
      input: Partial<UpdateTripItemInput>;
    }) => {
      const repo = await getRepo();
      return repo.update(id, input as UpdateTripItemInput);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip-items', tripId] }),
  });
}

export function useToggleTripItem(tripId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const repo = await getRepo();
      return repo.toggleCheck(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip-items', tripId] }),
  });
}

export function useRemoveTripItem(tripId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const repo = await getRepo();
      return repo.remove(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip-items', tripId] }),
  });
}
