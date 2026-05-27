import { useQuery } from '@tanstack/react-query';
import { initDatabase } from '@/db/client';
import { createGoodRepo } from '@/domain/repositories/good.repo';

async function getRepo() {
  const db = await initDatabase();
  return createGoodRepo(db);
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
