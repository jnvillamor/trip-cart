import { useRouter } from 'expo-router';
import { UpdateStoreInput } from '@/domain/schemas';
import {
  useArchiveStore,
  useRestoreStore,
  useStore,
  useUpdateStore,
} from '@/ui/hooks/useStores';

export function useStoreEditController(id: number) {
  const router = useRouter();
  const { data: store, isLoading } = useStore(id);
  const updateStore = useUpdateStore(id);
  const archive = useArchiveStore(id);
  const restore = useRestoreStore(id);

  if (isLoading) return { loading: true, notFound: false, store: null } as const;
  if (!store) return { loading: false, notFound: true, store: null } as const;

  return {
    loading: false,
    notFound: false,
    store,
    saving: updateStore.isPending,
    archiveBusy: archive.isPending || restore.isPending,
    save: async (input: UpdateStoreInput) => {
      await updateStore.mutateAsync(input);
      router.back();
    },
    toggleArchive: async () => {
      if (store.is_archived) await restore.mutateAsync();
      else await archive.mutateAsync();
      router.back();
    },
  } as const;
}
