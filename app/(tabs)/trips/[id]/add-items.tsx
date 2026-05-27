import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Good } from '@/domain/entities';
import { PageHeader } from '@/ui/components/PageHeader';
import { useCategories } from '@/ui/hooks/useCategories';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
import { useGoods, useGoodSuggestionsForStore } from '@/ui/hooks/useGoods';
import { useTrip } from '@/ui/hooks/useTrips';
import { useCreateTripItem, useTripItems } from '@/ui/hooks/useTripItems';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

const MAX_SUGGESTIONS = 6;

type Row =
  | { kind: 'section'; key: string; label: string }
  | { kind: 'good'; key: string; good: Good };

export default function AddItemsScreen() {
  const { tokens } = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const tripId = Number(idParam);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 150);

  const { data: trip } = useTrip(tripId);
  const { data: goods = [], isLoading } = useGoods({ nameQuery: debouncedQuery });
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useTripItems(tripId);
  const { data: suggestionCounts } = useGoodSuggestionsForStore(trip?.store_id, tripId);
  const createItem = useCreateTripItem(tripId);

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const addedGoodIds = useMemo(() => new Set(items.map((i) => i.good_id)), [items]);

  const rows = useMemo<Row[]>(() => {
    const isSearching = debouncedQuery.trim().length > 0;
    if (isSearching) {
      return goods.map((g) => ({ kind: 'good', key: `g-${g.id}`, good: g }));
    }
    const counts = suggestionCounts ?? new Map<number, number>();
    const suggested = goods
      .filter((g) => counts.has(g.id))
      .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
      .slice(0, MAX_SUGGESTIONS);
    const suggestedIds = new Set(suggested.map((g) => g.id));
    const rest = goods.filter((g) => !suggestedIds.has(g.id));
    const out: Row[] = [];
    if (suggested.length > 0) {
      out.push({
        kind: 'section',
        key: 'sec-suggested',
        label: 'Frequently bought here',
      });
      for (const g of suggested) out.push({ kind: 'good', key: `s-${g.id}`, good: g });
      out.push({ kind: 'section', key: 'sec-all', label: 'All goods' });
    }
    for (const g of rest) out.push({ kind: 'good', key: `g-${g.id}`, good: g });
    return out;
  }, [goods, suggestionCounts, debouncedQuery]);

  function add(good: Good) {
    if (addedGoodIds.has(good.id)) return;
    createItem.mutate({ good_id: good.id, planned_quantity: 1 });
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Add items" />

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <SearchInput value={query} onChange={setQuery} tokens={tokens} />
      </View>

      <FlashList
        data={rows}
        keyExtractor={(row) => row.key}
        getItemType={(row) => row.kind}
        renderItem={({ item }) => {
          if (item.kind === 'section') {
            return <SectionLabel label={item.label} tokens={tokens} />;
          }
          return (
            <GoodAddRow
              good={item.good}
              category={
                item.good.default_category_id != null
                  ? categoryById.get(item.good.default_category_id)
                  : undefined
              }
              added={addedGoodIds.has(item.good.id)}
              onAdd={() => add(item.good)}
              tokens={tokens}
            />
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyResults debouncedQuery={debouncedQuery} tokens={tokens} />
          ) : null
        }
      />
    </View>
  );
}

function SectionLabel({ label, tokens }: { label: string; tokens: Theme }) {
  return (
    <Text
      style={{
        color: tokens.text.tertiary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: 16,
        marginBottom: 4,
      }}
    >
      {label}
    </Text>
  );
}

function EmptyResults({
  debouncedQuery,
  tokens,
}: {
  debouncedQuery: string;
  tokens: Theme;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <MaterialIcons name="search-off" color={tokens.text.tertiary} size={32} />
      </View>
      <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '700' }}>
        {debouncedQuery ? `No goods match "${debouncedQuery}"` : 'No goods yet'}
      </Text>
      <Text
        style={{
          color: tokens.text.tertiary,
          marginTop: 6,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        {debouncedQuery
          ? 'Try a different search or add this good to your catalog.'
          : 'Add goods in the Catalog tab to plan trips with them.'}
      </Text>
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
        paddingVertical: 10,
      }}
    >
      <MaterialIcons name="search" color={tokens.text.tertiary} size={18} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search goods"
        placeholderTextColor={tokens.text.tertiary}
        autoFocus
        autoCorrect={false}
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

function GoodAddRow({
  good,
  category,
  added,
  onAdd,
  tokens,
}: {
  good: Good;
  category?: { name: string; color_hex: string | null; icon_name: string | null };
  added: boolean;
  onAdd: () => void;
  tokens: Theme;
}) {
  const color = category?.color_hex ?? tokens.bg.tonal;
  const iconName = (category?.icon_name ?? 'inventory-2').replace(
    /_/g,
    '-',
  ) as keyof typeof MaterialIcons.glyphMap;
  return (
    <Pressable
      onPress={added ? undefined : onAdd}
      disabled={added}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        marginVertical: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: added ? tokens.success[0] : tokens.border.subtle,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
        opacity: added ? 0.65 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={iconName} color="white" size={20} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '600' }}
          numberOfLines={1}
        >
          {good.name}
        </Text>
        {category?.name ? (
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {category.name}
          </Text>
        ) : null}
      </View>
      {added ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: tokens.bg.tonal,
            borderRadius: 999,
          }}
        >
          <MaterialIcons name="check" color={tokens.success[0]} size={14} />
          <Text
            style={{
              color: tokens.success[0],
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            ADDED
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: tokens.accent.base,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: tokens.text.onAccent,
              fontSize: 22,
              fontWeight: '400',
              lineHeight: 24,
              marginTop: -2,
            }}
          >
            +
          </Text>
        </View>
      )}
    </Pressable>
  );
}
