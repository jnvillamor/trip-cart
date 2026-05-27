import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { createStoreRepo } from '@/domain/repositories/store.repo';
import { CreateStoreInput, UpdateStoreInput } from '@/domain/schemas';

async function getRepo() {
  const db = await initDatabase();
  return createStoreRepo(db);
}

export function useStores(options: { archived?: boolean } = {}) {
  const { archived = false } = options;
  return useQuery({
    queryKey: ['stores', { archived }],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.list({ includeArchived: archived });
    },
  });
}

export function useStore(id: number) {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.findById(id);
    },
    enabled: Number.isFinite(id),
  });
}

export function useCreateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateStoreInput) => {
      const repo = await getRepo();
      return repo.create(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stores'] });
    },
  });
}

export function useUpdateStore(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateStoreInput) => {
      const repo = await getRepo();
      return repo.update(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stores'] });
      qc.invalidateQueries({ queryKey: ['stores', id] });
    },
  });
}

export function useArchiveStore(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.archive(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stores'] });
      qc.invalidateQueries({ queryKey: ['stores', id] });
    },
  });
}

export function useRestoreStore(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.restore(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stores'] });
      qc.invalidateQueries({ queryKey: ['stores', id] });
    },
  });
}
