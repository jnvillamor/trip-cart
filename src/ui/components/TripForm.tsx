import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { z } from 'zod/v3';
import { CreateTripFormInputSchema } from '@/domain/schemas';
import { useAppForm } from '@/ui/forms/form-context';
import { useStores } from '@/ui/hooks/useStores';
import { useTheme } from '@/ui/theme/ThemeProvider';

const nameValidator = CreateTripFormInputSchema.shape.name;
const storeValidator = z
  .number({ invalid_type_error: 'Pick a store' })
  .int()
  .positive('Pick a store');

export type TripFormValues = {
  name: string;
  store_id: number | null;
  notes: string;
};

export function TripForm({
  initialValues,
  submitLabel,
  busy,
  onSubmit,
}: {
  initialValues: TripFormValues;
  submitLabel: string;
  busy: boolean;
  onSubmit: (values: { name: string; store_id: number; notes: string }) => Promise<void>;
}) {
  const { tokens } = useTheme();
  const router = useRouter();
  const { data: stores = [] } = useStores();

  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      if (value.store_id == null) return;
      await onSubmit({
        name: value.name,
        store_id: value.store_id,
        notes: value.notes,
      });
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
        <form.SubmitButton label={submitLabel} busy={busy} />
      </form.AppForm>
    </ScrollView>
  );
}
