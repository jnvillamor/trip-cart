import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useStores } from '@/ui/hooks/useStores';

export function useStoresListController() {
  const router = useRouter();
  const [showArchived, setShowArchived] = useState(false);

  const { data: stores = [], isLoading } = useStores({ archived: showArchived });

  return {
    stores,
    isLoading,
    showArchived,
    setShowArchived,
    openStore: (id: number) => router.push(`/stores/${id}` as never),
    openNewStore: () => router.push('/stores/new' as never),
  } as const;
}
