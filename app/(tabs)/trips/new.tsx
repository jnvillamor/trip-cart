import { useRouter } from 'expo-router';
import { CreateTripInputSchema } from '@/domain/schemas';
import { TripForm } from '@/ui/components/TripForm';
import { useSettings } from '@/ui/hooks/useSettings';
import { useStores } from '@/ui/hooks/useStores';
import { useCreateTrip } from '@/ui/hooks/useTrips';

export default function NewTripScreen() {
  const router = useRouter();
  const createTrip = useCreateTrip();
  const { data: settings } = useSettings();
  const { data: stores = [] } = useStores();

  return (
    <TripForm
      initialValues={{ name: '', store_id: null, notes: '' }}
      submitLabel="Create trip"
      busy={createTrip.isPending}
      onSubmit={async ({ name, store_id, notes }) => {
        const store = stores.find((s) => s.id === store_id);
        const resolved_currency_code =
          store?.currency_code_override ?? settings?.global_currency_code ?? 'USD';
        const parsed = CreateTripInputSchema.safeParse({
          name,
          store_id,
          notes: notes || undefined,
          resolved_currency_code,
        });
        if (!parsed.success) return;
        const created = await createTrip.mutateAsync(parsed.data);
        router.replace(`/trips/${created.id}` as never);
      }}
    />
  );
}
