import { useRouter } from 'expo-router';
import { StoreForm } from '@/ui/components/StoreForm';
import { useCreateStore } from '@/ui/hooks/useStores';

export default function NewStoreScreen() {
  const router = useRouter();
  const createStore = useCreateStore();

  return (
    <StoreForm
      submitLabel="Create store"
      busy={createStore.isPending}
      onSubmit={async (input) => {
        await createStore.mutateAsync(input);
        router.back();
      }}
    />
  );
}
