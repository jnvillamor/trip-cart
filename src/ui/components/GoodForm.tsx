import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { suggestCategoryByName } from '@/domain/category-suggest';
import { CreateGoodInput, CreateGoodInputSchema } from '@/domain/schemas';
import { useAppForm } from '@/ui/forms/form-context';
import { useCategories } from '@/ui/hooks/useCategories';
import { useTheme } from '@/ui/theme/ThemeProvider';

const nameValidator = CreateGoodInputSchema.shape.name;
const unitValidator = CreateGoodInputSchema.shape.default_unit.unwrap();

export type GoodFormValues = {
  name: string;
  default_category_id: number | null;
  default_unit: string;
  notes: string;
};

const empty: GoodFormValues = {
  name: '',
  default_category_id: null,
  default_unit: '',
  notes: '',
};

function valuesToInput(v: GoodFormValues): CreateGoodInput | null {
  const result = CreateGoodInputSchema.safeParse({
    name: v.name,
    default_category_id: v.default_category_id ?? undefined,
    default_unit: v.default_unit || undefined,
    notes: v.notes || undefined,
  });
  return result.success ? result.data : null;
}

export function GoodForm({
  initialValues = empty,
  submitLabel,
  onSubmit,
  busy,
  footer,
}: {
  initialValues?: GoodFormValues;
  submitLabel: string;
  onSubmit: (input: CreateGoodInput) => Promise<unknown> | unknown;
  busy?: boolean;
  footer?: ReactNode;
}) {
  const { tokens } = useTheme();
  const { data: categories = [] } = useCategories();
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
        {(field) => (
          <field.TextField
            label="Name"
            placeholder="e.g. Whole Milk"
            onAfterBlur={(value) => {
              const current = form.getFieldValue('default_category_id');
              if (current != null) return;
              const suggested = suggestCategoryByName(value, categories);
              if (suggested) form.setFieldValue('default_category_id', suggested.id);
            }}
          />
        )}
      </form.AppField>

      <form.AppField name="default_category_id">
        {(field) => (
          <field.CategoryPickerField
            label="Default category"
            hint="Suggested automatically based on the name."
          />
        )}
      </form.AppField>

      <form.AppField name="default_unit" validators={{ onChange: unitValidator }}>
        {(field) => (
          <field.TextField label="Default unit" placeholder="e.g. L, kg, pc" />
        )}
      </form.AppField>

      <form.AppField name="notes">
        {(field) => <field.TextField label="Notes" placeholder="Optional" multiline />}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton label={submitLabel} busy={busy} />
      </form.AppForm>

      {footer}
    </ScrollView>
  );
}
