import { useRouter } from 'expo-router';
import { GoodForm } from '@/ui/components/GoodForm';
import { useCreateGood } from '@/ui/hooks/useGoods';

export default function NewGoodScreen() {
  const router = useRouter();
  const createGood = useCreateGood();

  return (
    <GoodForm
      submitLabel="Create good"
      busy={createGood.isPending}
      onSubmit={async (input) => {
        await createGood.mutateAsync(input);
        router.back();
      }}
    />
  );
}
