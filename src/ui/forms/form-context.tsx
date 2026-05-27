import { MaterialIcons } from '@expo/vector-icons';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SUPPORTED_CURRENCIES } from '@/domain/currency';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const ICON_OPTIONS = [
  'category',
  'eco',
  'icecream',
  'bakery_dining',
  'set_meal',
  'ac_unit',
  'local_drink',
  'cookie',
  'kitchen',
  'home',
  'soap',
  'restaurant',
  'shopping_bag',
  'coffee',
  'cake',
  'local_pizza',
  'water_drop',
  'pets',
  'spa',
  'medical_services',
  'cleaning_services',
  'liquor',
  'local_florist',
  'emoji_food_beverage',
] as const;

const COLOR_OPTIONS = [
  '#4CAF50',
  '#03A9F4',
  '#FF9800',
  '#E91E63',
  '#00BCD4',
  '#9C27B0',
  '#FFC107',
  '#795548',
  '#607D8B',
  '#FF5722',
  '#9E9E9E',
  '#0D6470',
] as const;

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

function IconField({ label, hint }: { label: string; hint?: string }) {
  const field = useFieldContext<string>();
  const { tokens } = useTheme();
  const first = field.state.meta.errors[0];
  const error = typeof first === 'string' ? first : first?.message;
  return (
    <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {ICON_OPTIONS.map((iconKey) => {
          const active = field.state.value === iconKey;
          return (
            <Pressable
              key={iconKey}
              onPress={() => field.handleChange(iconKey)}
              accessibilityLabel={iconKey}
              style={({ pressed }) => ({
                width: 48,
                height: 48,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active
                  ? tokens.accent.base
                  : pressed
                    ? tokens.bg.elevated
                    : tokens.bg.tonal,
                borderWidth: 1,
                borderColor: active ? tokens.accent.base : tokens.border.subtle,
              })}
            >
              <MaterialIcons
                name={
                  iconKey.replace(/_/g, '-') as keyof typeof MaterialIcons.glyphMap
                }
                color={active ? tokens.text.onAccent : tokens.text.primary}
                size={22}
              />
            </Pressable>
          );
        })}
      </View>
    </FieldShell>
  );
}

function ColorField({ label, hint }: { label: string; hint?: string }) {
  const field = useFieldContext<string>();
  const { tokens } = useTheme();
  const first = field.state.meta.errors[0];
  const error = typeof first === 'string' ? first : first?.message;
  return (
    <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {COLOR_OPTIONS.map((color) => {
          const active = field.state.value.toLowerCase() === color.toLowerCase();
          return (
            <Pressable
              key={color}
              onPress={() => field.handleChange(color)}
              accessibilityLabel={color}
              style={({ pressed }) => ({
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: color,
                borderWidth: active ? 3 : 1,
                borderColor: active ? tokens.text.primary : tokens.border.subtle,
                opacity: pressed ? 0.7 : 1,
              })}
            />
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
  fieldComponents: { TextField, CurrencyField, IconField, ColorField },
  formComponents: { SubmitButton },
});
