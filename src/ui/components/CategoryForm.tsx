import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { CreateCategoryInput, CreateCategoryInputSchema } from '@/domain/schemas';
import { useAppForm } from '@/ui/forms/form-context';
import { useTheme } from '@/ui/theme/ThemeProvider';

const nameValidator = CreateCategoryInputSchema.shape.name;

export type CategoryFormValues = {
  name: string;
  icon_name: string;
  color_hex: string;
};

const empty: CategoryFormValues = {
  name: '',
  icon_name: '',
  color_hex: '',
};

function valuesToInput(v: CategoryFormValues): CreateCategoryInput | null {
  const result = CreateCategoryInputSchema.safeParse({
    name: v.name,
    icon_name: v.icon_name || undefined,
    color_hex: v.color_hex || undefined,
  });
  return result.success ? result.data : null;
}

export function CategoryForm({
  initialValues = empty,
  submitLabel,
  onSubmit,
  busy,
  footer,
}: {
  initialValues?: CategoryFormValues;
  submitLabel: string;
  onSubmit: (input: CreateCategoryInput) => Promise<unknown> | unknown;
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
        {(field) => <field.TextField label="Name" placeholder="e.g. Produce" />}
      </form.AppField>

      <form.AppField name="icon_name">
        {(field) => <field.IconField label="Icon" />}
      </form.AppField>

      <form.AppField name="color_hex">
        {(field) => <field.ColorField label="Color" />}
      </form.AppField>

      <form.AppForm>
        <form.SubmitButton label={submitLabel} busy={busy} />
      </form.AppForm>

      {footer}
    </ScrollView>
  );
}
