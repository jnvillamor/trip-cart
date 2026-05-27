import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { CreateStoreInput, CreateStoreInputSchema } from '@/domain/schemas';
import { useAppForm } from '@/ui/forms/form-context';
import { useTheme } from '@/ui/theme/ThemeProvider';

const nameValidator = CreateStoreInputSchema.shape.name;
const notesValidator = CreateStoreInputSchema.shape.notes.unwrap();

export type StoreFormValues = {
  name: string;
  currency_code_override: string;
  notes: string;
};

const empty: StoreFormValues = {
  name: '',
  currency_code_override: '',
  notes: '',
};

function valuesToInput(v: StoreFormValues): CreateStoreInput | null {
  const result = CreateStoreInputSchema.safeParse({
    name: v.name,
    currency_code_override: v.currency_code_override || undefined,
    notes: v.notes || undefined,
  });
  return result.success ? result.data : null;
}

export function StoreForm({
  initialValues = empty,
  submitLabel,
  onSubmit,
  busy,
  footer,
}: {
  initialValues?: StoreFormValues;
  submitLabel: string;
  onSubmit: (input: CreateStoreInput) => Promise<unknown> | unknown;
  busy?: boolean;
  footer?: ReactNode;
}) {
  const { tokens } = useTheme();
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const input = valuesToInput(value);
      if (!input) return;
      await onSubmit(input);
    },
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg.page }}
      contentContainerStyle={{ padding: 20, gap: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <form.AppField name="name" validators={{ onChange: nameValidator }}>
        {(field) => <field.TextField label="Name" placeholder="e.g. SM Supermarket" />}
      </form.AppField>

      <form.AppField name="currency_code_override">
        {(field) => (
          <field.CurrencyField
            label="Currency override"
            hint="Leave on Global if this store uses your default currency."
          />
        )}
      </form.AppField>

      <form.AppField name="notes" validators={{ onChange: notesValidator }}>
        {(field) => <field.TextField label="Notes" placeholder="Optional" multiline />}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton label={submitLabel} busy={busy} />
      </form.AppForm>

      {footer}
    </ScrollView>
  );
}
