import { useRouter } from 'expo-router';
import { UpdateCategoryInput } from '@/domain/schemas';
import {
  useArchiveCategory,
  useCategory,
  useRestoreCategory,
  useUpdateCategory,
} from '@/ui/hooks/useCategories';

export function useCategoryEditController(id: number) {
  const router = useRouter();
  const { data: category, isLoading } = useCategory(id);
  const updateCategory = useUpdateCategory(id);
  const archive = useArchiveCategory(id);
  const restore = useRestoreCategory(id);

  if (isLoading) return { loading: true, notFound: false, category: null } as const;
  if (!category) return { loading: false, notFound: true, category: null } as const;

  return {
    loading: false,
    notFound: false,
    category,
    saving: updateCategory.isPending,
    archiveBusy: archive.isPending || restore.isPending,
    save: async (input: UpdateCategoryInput) => {
      await updateCategory.mutateAsync(input);
      router.back();
    },
    toggleArchive: async () => {
      if (category.is_archived) await restore.mutateAsync();
      else await archive.mutateAsync();
      router.back();
    },
  } as const;
}
