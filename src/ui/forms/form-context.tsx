import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SUPPORTED_CURRENCIES } from '@/domain/currency';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

function TextField({
  label,
  placeholder,
  hint,
  multiline,
}: {
  label: string;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
}) {
  const field = useFieldContext<string>();
  const { tokens } = useTheme();
  const first = field.state.meta.errors[0];
  const error = typeof first === 'string' ? first : first?.message;
  return (
    <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
      <TextInput
        value={field.state.value}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        placeholderTextColor={tokens.text.tertiary}
        multiline={multiline}
        style={[
          textInputStyle(tokens),
          multiline ? { minHeight: 88, textAlignVertical: 'top' } : null,
        ]}
      />
    </FieldShell>
  );
}

function CurrencyField({ label, hint }: { label: string; hint?: string }) {
  const field = useFieldContext<string>();
  const { tokens } = useTheme();
  const first = field.state.meta.errors[0];
  const error = typeof first === 'string' ? first : first?.message;
  const options = [
    { code: '', label: 'Global' },
    ...SUPPORTED_CURRENCIES.map((c) => ({ code: c.code, label: c.code })),
  ];
  return (
    <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: tokens.bg.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          padding: 4,
          gap: 4,
        }}
      >
        {options.map((opt) => {
          const active = field.state.value === opt.code;
          return (
            <Pressable
              key={opt.code || 'global'}
              onPress={() => field.handleChange(opt.code)}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: active
                  ? tokens.accent.base
                  : pressed
                    ? tokens.bg.elevated
                    : 'transparent',
              })}
            >
              <Text
                style={{
                  color: active ? tokens.text.onAccent : tokens.text.secondary,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </FieldShell>
  );
}

function SubmitButton({ label, busy }: { label: string; busy?: boolean }) {
  const form = useFormContext();
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={() => form.handleSubmit()}
      disabled={busy}
      style={({ pressed }) => ({
        backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        opacity: busy ? 0.6 : 1,
      })}
    >
      <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
        {busy ? 'Saving…' : label}
      </Text>
    </Pressable>
  );
}

function FieldShell({
  label,
  hint,
  error,
  tokens,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  tokens: Theme;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          color: tokens.text.secondary,
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
      {children}
      {hint && !error ? (
        <Text style={{ color: tokens.text.tertiary, fontSize: 12 }}>{hint}</Text>
      ) : null}
      {error ? <Text style={{ color: tokens.danger[0], fontSize: 12 }}>{error}</Text> : null}
    </View>
  );
}

function textInputStyle(tokens: Theme) {
  return {
    backgroundColor: tokens.bg.surface,
    borderWidth: 1,
    borderColor: tokens.border.subtle,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: tokens.text.primary,
    fontSize: 15,
  } as const;
}

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, CurrencyField },
  formComponents: { SubmitButton },
});
