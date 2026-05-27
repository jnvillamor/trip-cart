import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Good } from '@/domain/entities';
import { FAB, useFabBottomReserve } from '@/ui/components/FAB';
import { ListCard } from '@/ui/components/ListCard';
import { ListEmptyState } from '@/ui/components/ListEmptyState';
import { useCategories } from '@/ui/hooks/useCategories';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
import { useGoods } from '@/ui/hooks/useGoods';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function GoodsList() {
  const { tokens } = useTheme();
  const router = useRouter();
  const fabReserve = useFabBottomReserve();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 150);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { data: categories = [] } = useCategories();
  const { data: goods = [], isLoading } = useGoods({
    nameQuery: debouncedQuery,
    categoryId,
  });

  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12,
          gap: 12,
        }}
      >
        <SearchInput value={query} onChange={setQuery} tokens={tokens} />
        <CategoryChipRow
          categories={categories}
          activeId={categoryId}
          onChange={setCategoryId}
          tokens={tokens}
        />
      </View>

      <FlashList
        data={goods}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <GoodRow
            good={item}
            category={
              item.default_category_id != null
                ? categoryById.get(item.default_category_id)
                : undefined
            }
            tokens={tokens}
            onPress={() => router.push(`/catalog/goods/${item.id}` as never)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <ListEmptyState
              icon="inventory-2"
              title="No goods yet"
              subtitle={
                debouncedQuery || categoryId
                  ? 'Try clearing the search or filter.'
                  : 'Add your first good to plan trips with.'
              }
            />
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: fabReserve,
        }}
      />

      <FAB
        onPress={() => router.push('/catalog/goods/new' as never)}
        accessibilityLabel="Add good"
      />
    </View>
  );
}

function SearchInput({
  value,
  onChange,
  tokens,
}: {
  value: string;
  onChange: (next: string) => void;
  tokens: Theme;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: tokens.bg.tonal,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <MaterialIcons name="search" color={tokens.text.tertiary} size={18} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search goods"
        placeholderTextColor={tokens.text.tertiary}
        style={{
          flex: 1,
          color: tokens.text.primary,
          fontSize: 15,
          paddingVertical: 0,
        }}
      />
      {value ? (
        <Pressable onPress={() => onChange('')} hitSlop={6}>
          <MaterialIcons name="close" color={tokens.text.tertiary} size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

function CategoryChipRow({
  categories,
  activeId,
  onChange,
  tokens,
}: {
  categories: { id: number; name: string; color_hex: string | null }[];
  activeId: number | null;
  onChange: (id: number | null) => void;
  tokens: Theme;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      <Chip label="All" active={activeId === null} onPress={() => onChange(null)} tokens={tokens} />
      {categories.map((c) => (
        <Chip
          key={c.id}
          label={c.name}
          color={c.color_hex ?? undefined}
          active={activeId === c.id}
          onPress={() => onChange(c.id)}
          tokens={tokens}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  active,
  color,
  onPress,
  tokens,
}: {
  label: string;
  active: boolean;
  color?: string;
  onPress: () => void;
  tokens: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: active
          ? tokens.accent.base
          : pressed
            ? tokens.bg.elevated
            : tokens.bg.page,
        borderWidth: 1,
        borderColor: active ? tokens.accent.base : tokens.border.subtle,
      })}
    >
      {color ? (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
          }}
        />
      ) : null}
      <Text
        style={{
          color: active ? tokens.text.onAccent : tokens.text.secondary,
          fontWeight: '600',
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function GoodRow({
  good,
  category,
  tokens,
  onPress,
}: {
  good: Good;
  category?: { name: string; color_hex: string | null; icon_name: string | null };
  tokens: Theme;
  onPress: () => void;
}) {
  const color = category?.color_hex ?? tokens.bg.tonal;
  const iconName = (category?.icon_name ?? 'inventory-2').replace(
    /_/g,
    '-',
  ) as keyof typeof MaterialIcons.glyphMap;
  const subtitleBits = [category?.name, good.default_unit].filter(Boolean) as string[];
  return (
    <ListCard
      onPress={onPress}
      archived={good.is_archived}
      title={good.name}
      subtitle={subtitleBits.join(' · ') || undefined}
      leading={
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={iconName} color="white" size={22} />
        </View>
      }
    />
  );
}
