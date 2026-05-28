import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { createSettingsRepo } from '@/domain/repositories/settings.repo';
import { SettingsUpdateInput } from '@/domain/schemas';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const db = await initDatabase();
      const repo = createSettingsRepo(db);
      return repo.get();
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SettingsUpdateInput) => {
      const db = await initDatabase();
      const repo = createSettingsRepo(db);
      return repo.update(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
