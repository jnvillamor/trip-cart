import { useRouter } from 'expo-router';
import { UpdateGoodInput } from '@/domain/schemas';
import {
  useArchiveGood,
  useGood,
  useRestoreGood,
  useUpdateGood,
} from '@/ui/hooks/useGoods';

export function useGoodEditController(id: number) {
  const router = useRouter();
  const { data: good, isLoading } = useGood(id);
  const updateGood = useUpdateGood(id);
  const archive = useArchiveGood(id);
  const restore = useRestoreGood(id);

  if (isLoading) return { loading: true, notFound: false, good: null } as const;
  if (!good) return { loading: false, notFound: true, good: null } as const;

  return {
    loading: false,
    notFound: false,
    good,
    saving: updateGood.isPending,
    archiveBusy: archive.isPending || restore.isPending,
    save: async (input: UpdateGoodInput) => {
      await updateGood.mutateAsync(input);
      router.back();
    },
    toggleArchive: async () => {
      if (good.is_archived) await restore.mutateAsync();
      else await archive.mutateAsync();
      router.back();
    },
  } as const;
}
