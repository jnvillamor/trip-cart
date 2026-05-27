import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { createGoodRepo } from '@/domain/repositories/good.repo';
import { createTripItemRepo } from '@/domain/repositories/trip-item.repo';
import { createTripRepo } from '@/domain/repositories/trip.repo';
import { CreateGoodInput, UpdateGoodInput } from '@/domain/schemas';

async function getRepo() {
  const db = await initDatabase();
  return createGoodRepo(db);
}

export function useGoods(options: {
  archived?: boolean;
  nameQuery?: string;
  categoryId?: number | null;
} = {}) {
  const { archived = false, nameQuery, categoryId } = options;
  return useQuery({
    queryKey: ['goods', { archived, nameQuery: nameQuery ?? '', categoryId: categoryId ?? null }],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.list({
        includeArchived: archived,
        nameQuery: nameQuery || undefined,
        categoryId: categoryId ?? undefined,
      });
    },
  });
}

export function useGood(id: number) {
  return useQuery({
    queryKey: ['goods', id],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.findById(id);
    },
    enabled: Number.isFinite(id),
  });
}

export function useGoodsCount(options: { archived?: boolean } = {}) {
  const { archived = false } = options;
  return useQuery({
    queryKey: ['goods', 'count', { archived }],
    queryFn: async () => {
      const repo = await getRepo();
      const items = await repo.list({ includeArchived: archived });
      return items.length;
    },
  });
}

export function useCreateGood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateGoodInput) => {
      const repo = await getRepo();
      return repo.create(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goods'] }),
  });
}

export function useUpdateGood(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateGoodInput) => {
      const repo = await getRepo();
      return repo.update(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goods'] });
      qc.invalidateQueries({ queryKey: ['goods', id] });
    },
  });
}

export function useArchiveGood(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.archive(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goods'] });
      qc.invalidateQueries({ queryKey: ['goods', id] });
    },
  });
}

export function useRestoreGood(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.restore(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goods'] });
      qc.invalidateQueries({ queryKey: ['goods', id] });
    },
  });
}

/**
 * "Frequently bought at this store" — counts good_ids across every past trip
 * at the given store (optionally excluding the trip being edited).
 * Returns a Map<good_id, frequency>.
 */
export function useGoodSuggestionsForStore(
  storeId: number | null | undefined,
  excludeTripId?: number,
) {
  return useQuery({
    queryKey: ['good-suggestions', storeId ?? null, excludeTripId ?? null],
    queryFn: async () => {
      if (storeId == null) return new Map<number, number>();
      const db = await initDatabase();
      const tripRepo = createTripRepo(db);
      const itemRepo = createTripItemRepo(db);
      const trips = await tripRepo.list({ storeId });
      const counts = new Map<number, number>();
      for (const trip of trips) {
        if (excludeTripId != null && trip.id === excludeTripId) continue;
        const items = await itemRepo.list({ tripId: trip.id });
        for (const item of items) {
          counts.set(item.good_id, (counts.get(item.good_id) ?? 0) + 1);
        }
      }
      return counts;
    },
    enabled: storeId != null,
  });
}
