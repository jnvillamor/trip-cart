import { useRouter } from 'expo-router';
import { CategoryForm } from '@/ui/components/CategoryForm';
import { useCreateCategory } from '@/ui/hooks/useCategories';

export default function NewCategoryScreen() {
  const router = useRouter();
  const createCategory = useCreateCategory();

  return (
    <CategoryForm
      submitLabel="Create category"
      busy={createCategory.isPending}
      onSubmit={async (input) => {
        await createCategory.mutateAsync(input);
        router.back();
      }}
    />
  );
}
