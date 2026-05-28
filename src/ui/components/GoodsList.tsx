import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Good } from '@/domain/entities';
import { CategoryPickerSheet } from '@/ui/components/CategoryPickerSheet';
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
  const [pickerOpen, setPickerOpen] = useState(false);

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
        <CategoryFilterButton
          activeId={categoryId}
          activeName={
            categoryId != null
              ? categoryById.get(categoryId)?.name ?? 'Unknown'
              : null
          }
          activeColor={
            categoryId != null
              ? categoryById.get(categoryId)?.color_hex ?? null
              : null
          }
          onPress={() => setPickerOpen(true)}
          onClear={() => setCategoryId(null)}
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

      <CategoryPickerSheet
        visible={pickerOpen}
        value={categoryId}
        includeNone
        noneLabel="All categories"
        onPick={(id) => setCategoryId(id)}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

function CategoryFilterButton({
  activeId,
  activeName,
  activeColor,
  onPress,
  onClear,
  tokens,
}: {
  activeId: number | null;
  activeName: string | null;
  activeColor: string | null;
  onPress: () => void;
  onClear: () => void;
  tokens: Theme;
}) {
  const hasFilter = activeId !== null;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: hasFilter ? tokens.accent.base : tokens.border.subtle,
        paddingVertical: 8,
        paddingLeft: 14,
        paddingRight: hasFilter ? 6 : 14,
        alignSelf: 'flex-start',
      })}
    >
      <MaterialIcons
        name="filter-list"
        color={hasFilter ? tokens.accent.base : tokens.text.tertiary}
        size={18}
      />
      {activeColor ? (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: activeColor,
          }}
        />
      ) : null}
      <Text
        style={{
          color: hasFilter ? tokens.text.primary : tokens.text.secondary,
          fontSize: 13,
          fontWeight: '600',
        }}
      >
        {activeName ?? 'All categories'}
      </Text>
      {hasFilter ? (
        <Pressable
          onPress={onClear}
          hitSlop={6}
          style={({ pressed }) => ({
            width: 22,
            height: 22,
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
          })}
        >
          <MaterialIcons name="close" color={tokens.text.tertiary} size={14} />
        </Pressable>
      ) : null}
    </Pressable>
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
