import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { PageHeader } from '@/ui/components/PageHeader';
import { TripForm } from '@/ui/components/TripForm';
import { useSettings } from '@/ui/hooks/useSettings';
import { useStores } from '@/ui/hooks/useStores';
import { useTrip, useUpdateTrip } from '@/ui/hooks/useTrips';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function EditTripScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);

  const { data: trip, isLoading } = useTrip(id);
  const { data: stores = [] } = useStores();
  const { data: settings } = useSettings();
  const updateTrip = useUpdateTrip(id);

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  if (!trip) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg.page,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: tokens.text.primary }}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Edit trip" subtitle={trip.name} />
      <TripForm
        initialValues={{
          name: trip.name,
          store_id: trip.store_id,
          notes: trip.notes ?? '',
        }}
        submitLabel="Save changes"
        busy={updateTrip.isPending}
        onSubmit={async ({ name, store_id, notes }) => {
          const storeChanged = store_id !== trip.store_id;
          const store = stores.find((s) => s.id === store_id);
          const resolved_currency_code = storeChanged
            ? store?.currency_code_override ?? settings?.global_currency_code ?? 'USD'
            : undefined;
          await updateTrip.mutateAsync({
            name,
            store_id,
            notes: notes || undefined,
            ...(resolved_currency_code ? { resolved_currency_code } : {}),
          });
          router.back();
        }}
      />
    </View>
  );
}
