import { MaterialIcons } from '@expo/vector-icons';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { findCurrency } from '@/domain/currency';
import { CategoryPickerSheet } from '@/ui/components/CategoryPickerSheet';
import { CurrencyPickerSheet } from '@/ui/components/CurrencyPickerSheet';
import { useCategories } from '@/ui/hooks/useCategories';
import { useStores } from '@/ui/hooks/useStores';
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
  onAfterBlur,
}: {
  label: string;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  onAfterBlur?: (value: string) => void;
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
        onBlur={() => {
          field.handleBlur();
          onAfterBlur?.(field.state.value);
        }}
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

function CategoryPickerField({ label, hint }: { label: string; hint?: string }) {
  const field = useFieldContext<number | null>();
  const { tokens } = useTheme();
  const [open, setOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  const first = field.state.meta.errors[0];
  const error = typeof first === 'string' ? first : first?.message;
  const selected =
    field.state.value != null ? categories.find((c) => c.id === field.state.value) : undefined;
  const tile = selected?.color_hex ?? tokens.bg.tonal;
  const iconName = ((selected?.icon_name ?? 'category').replace(
    /_/g,
    '-',
  )) as keyof typeof MaterialIcons.glyphMap;
  return (
    <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          paddingVertical: 12,
          paddingHorizontal: 14,
        })}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons
            name={iconName}
            color={selected ? 'white' : tokens.text.tertiary}
            size={18}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '600' }}
            numberOfLines={1}
          >
            {selected ? selected.name : 'No category'}
          </Text>
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {selected ? 'Tap to change' : 'Tap to pick one'}
          </Text>
        </View>
        <MaterialIcons name="unfold-more" color={tokens.text.tertiary} size={20} />
      </Pressable>
      <CategoryPickerSheet
        visible={open}
        value={field.state.value}
        onPick={(id) => field.handleChange(id)}
        onClose={() => setOpen(false)}
      />
    </FieldShell>
  );
}

function StorePickerField({ label, hint }: { label: string; hint?: string }) {
  const field = useFieldContext<number | null>();
  const { tokens } = useTheme();
  const { data: stores = [] } = useStores();
  const [query, setQuery] = useState('');
  const first = field.state.meta.errors[0];
  const error = typeof first === 'string' ? first : first?.message;

  if (stores.length === 0) {
    return (
      <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
        <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
          Add a store first to start planning trips.
        </Text>
      </FieldShell>
    );
  }

  const showSearch = stores.length > 5;
  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? stores.filter((s) => s.name.toLowerCase().includes(trimmed))
    : stores;

  return (
    <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
      <View style={{ gap: 8 }}>
        {showSearch ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: tokens.bg.tonal,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <MaterialIcons name="search" color={tokens.text.tertiary} size={16} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search stores"
              placeholderTextColor={tokens.text.tertiary}
              style={{ flex: 1, color: tokens.text.primary, fontSize: 14, paddingVertical: 0 }}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={6}>
                <MaterialIcons name="close" color={tokens.text.tertiary} size={16} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
        <ScrollView
          style={{
            maxHeight: 220,
            borderWidth: 1,
            borderColor: tokens.border.subtle,
            borderRadius: 12,
            backgroundColor: tokens.bg.surface,
          }}
          contentContainerStyle={{ padding: 4 }}
          nestedScrollEnabled
        >
          {filtered.length === 0 ? (
            <Text
              style={{
                color: tokens.text.tertiary,
                fontSize: 13,
                padding: 12,
                textAlign: 'center',
              }}
            >
              No stores match "{query}"
            </Text>
          ) : (
            filtered.map((s) => (
              <StoreOption
                key={s.id}
                name={s.name}
                currencyOverride={s.currency_code_override ?? undefined}
                active={field.state.value === s.id}
                onPress={() => field.handleChange(s.id)}
                tokens={tokens}
              />
            ))
          )}
        </ScrollView>
      </View>
    </FieldShell>
  );
}

function StoreOption({
  name,
  currencyOverride,
  active,
  onPress,
  tokens,
}: {
  name: string;
  currencyOverride?: string;
  active: boolean;
  onPress: () => void;
  tokens: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: active
          ? tokens.accent.base
          : pressed
            ? tokens.bg.elevated
            : 'transparent',
      })}
    >
      <Text
        style={{
          flex: 1,
          color: active ? tokens.text.onAccent : tokens.text.primary,
          fontSize: 15,
          fontWeight: active ? '600' : '500',
        }}
        numberOfLines={1}
      >
        {name}
      </Text>
      {currencyOverride ? (
        <View
          style={{
            backgroundColor: active ? 'rgba(255,255,255,0.18)' : tokens.bg.tonal,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              color: active ? tokens.text.onAccent : tokens.text.secondary,
              fontSize: 10,
              fontWeight: '700',
            }}
          >
            {currencyOverride}
          </Text>
        </View>
      ) : null}
      {active ? (
        <MaterialIcons name="check" color={tokens.text.onAccent} size={16} />
      ) : null}
    </Pressable>
  );
}

function CurrencyField({ label, hint }: { label: string; hint?: string }) {
  const field = useFieldContext<string>();
  const { tokens } = useTheme();
  const [open, setOpen] = useState(false);
  const first = field.state.meta.errors[0];
  const error = typeof first === 'string' ? first : first?.message;
  const code = field.state.value;
  const meta = code ? findCurrency(code) : undefined;
  return (
    <FieldShell label={label} hint={hint} error={error} tokens={tokens}>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          paddingVertical: 12,
          paddingHorizontal: 14,
        })}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: tokens.bg.tonal,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{ color: tokens.text.primary, fontSize: 13, fontWeight: '700' }}
          >
            {meta ? meta.symbol.slice(0, 3) : 'GBL'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '600' }}>
            {meta ? meta.code : 'Global default'}
          </Text>
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {meta ? meta.name : 'Use the global currency from Settings.'}
          </Text>
        </View>
        <MaterialIcons name="unfold-more" color={tokens.text.tertiary} size={20} />
      </Pressable>
      <CurrencyPickerSheet
        visible={open}
        value={field.state.value}
        onPick={(next) => field.handleChange(next)}
        onClose={() => setOpen(false)}
      />
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
  fieldComponents: {
    TextField,
    CurrencyField,
    IconField,
    ColorField,
    CategoryPickerField,
    StorePickerField,
  },
  formComponents: { SubmitButton },
});
