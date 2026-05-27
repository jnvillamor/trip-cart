import { useRouter } from 'expo-router';
import { z } from 'zod/v3';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CreateTripInputSchema } from '@/domain/schemas';
import { useAppForm } from '@/ui/forms/form-context';
import { useCreateTrip } from '@/ui/hooks/useTrips';
import { useSettings } from '@/ui/hooks/useSettings';
import { useStores } from '@/ui/hooks/useStores';
import { useTheme } from '@/ui/theme/ThemeProvider';

const nameValidator = CreateTripInputSchema.shape.name;
const storeValidator = z
  .number({ invalid_type_error: 'Pick a store' })
  .int()
  .positive('Pick a store');

type Values = {
  name: string;
  store_id: number | null;
  notes: string;
};

const empty: Values = {
  name: '',
  store_id: null,
  notes: '',
};

export default function NewTripScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const createTrip = useCreateTrip();
  const { data: settings } = useSettings();
  const { data: stores = [] } = useStores();

  const form = useAppForm({
    defaultValues: empty,
    onSubmit: async ({ value }) => {
      if (value.store_id == null) return;
      const store = stores.find((s) => s.id === value.store_id);
      const resolved_currency_code =
        store?.currency_code_override ?? settings?.global_currency_code ?? 'USD';
      const parsed = CreateTripInputSchema.safeParse({
        name: value.name,
        store_id: value.store_id,
        notes: value.notes || undefined,
        resolved_currency_code,
      });
      if (!parsed.success) return;
      const created = await createTrip.mutateAsync(parsed.data);
      router.replace(`/trips/${created.id}` as never);
    },
  });

  if (stores.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg.page,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <Text
          style={{
            color: tokens.text.primary,
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
          }}
        >
          Add a store first
        </Text>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          Every trip is tied to a store. Create one in the Stores tab to start planning.
        </Text>
        <Pressable
          onPress={() => {
            router.back();
            router.push('/stores/new' as never);
          }}
          style={({ pressed }) => ({
            marginTop: 12,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
          })}
        >
          <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
            Add a store
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg.page }}
      contentContainerStyle={{ padding: 20, gap: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <form.AppField name="name" validators={{ onChange: nameValidator }}>
        {(field) => (
          <field.TextField label="Name" placeholder="e.g. Weekly groceries" />
        )}
      </form.AppField>

      <form.AppField name="store_id" validators={{ onSubmit: storeValidator }}>
        {(field) => <field.StorePickerField label="Store" />}
      </form.AppField>

      <form.AppField name="notes">
        {(field) => <field.TextField label="Notes" placeholder="Optional" multiline />}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton label="Create trip" busy={createTrip.isPending} />
      </form.AppForm>
    </ScrollView>
  );
}
