import { useQuery } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { createSettingsRepo } from '@/domain/repositories/settings.repo';

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
