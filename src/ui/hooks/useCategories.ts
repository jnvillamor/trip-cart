import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { createCategoryRepo } from '@/domain/repositories/category.repo';
import { createGoodRepo } from '@/domain/repositories/good.repo';
import { CreateCategoryInput, UpdateCategoryInput } from '@/domain/schemas';

async function getRepo() {
  const db = await initDatabase();
  return createCategoryRepo(db);
}

export function useCategories(options: { archived?: boolean } = {}) {
  const { archived = false } = options;
  return useQuery({
    queryKey: ['categories', { archived }],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.list({ includeArchived: archived });
    },
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const repo = await getRepo();
      return repo.findById(id);
    },
    enabled: Number.isFinite(id),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const repo = await getRepo();
      return repo.create(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useUpdateCategory(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateCategoryInput) => {
      const repo = await getRepo();
      return repo.update(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories', id] });
    },
  });
}

export function useArchiveCategory(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.archive(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories', id] });
    },
  });
}

export function useRestoreCategory(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const repo = await getRepo();
      return repo.restore(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories', id] });
    },
  });
}

export function useCategoryItemCounts() {
  return useQuery({
    queryKey: ['categories', 'item-counts'],
    queryFn: async () => {
      const db = await initDatabase();
      const goodRepo = createGoodRepo(db);
      const items = await goodRepo.list();
      const counts = new Map<number, number>();
      for (const item of items) {
        if (item.default_category_id != null) {
          counts.set(
            item.default_category_id,
            (counts.get(item.default_category_id) ?? 0) + 1,
          );
        }
      }
      return counts;
    },
  });
}
