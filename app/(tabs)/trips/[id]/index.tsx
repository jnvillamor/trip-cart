import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Category, Good, Trip, TripItem } from '@/domain/entities';
import { TripStatus } from '@/domain/schemas';
import { PageHeader } from '@/ui/components/PageHeader';
import { useCategories } from '@/ui/hooks/useCategories';
import { useGoods } from '@/ui/hooks/useGoods';
import { useStores } from '@/ui/hooks/useStores';
import { useTrip } from '@/ui/hooks/useTrips';
import { useTripItems } from '@/ui/hooks/useTripItems';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function TripDetailScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);

  const { data: trip, isLoading } = useTrip(id);
  const { data: items = [] } = useTripItems(id);
  const { data: stores = [] } = useStores();
  const { data: categories = [] } = useCategories();
  const { data: goods = [] } = useGoods();

  const store = stores.find((s) => s.id === trip?.store_id);
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const goodById = useMemo(() => new Map(goods.map((g) => [g.id, g])), [goods]);

  const sections = useMemo(
    () => groupByCategory(items, goodById, categoryById),
    [items, goodById, categoryById],
  );

  const plannedTotal = items.reduce(
    (sum, i) => sum + (i.planned_quantity ?? 0) * (i.planned_unit_price ?? 0),
    0,
  );
  const actualTotal = items
    .filter((i) => i.is_checked)
    .reduce((sum, i) => sum + (i.actual_quantity ?? 0) * (i.actual_unit_price ?? 0), 0);
  const itemsBought = items.filter((i) => i.is_checked).length;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Trip" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Trip" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: tokens.text.primary }}>Trip not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title={trip.name} subtitle={store?.name} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <SummaryCard
          trip={trip}
          plannedTotal={plannedTotal}
          actualTotal={actualTotal}
          itemsBought={itemsBought}
          itemsTotal={items.length}
          tokens={tokens}
        />

        {sections.map((s) => (
          <CategorySection key={s.key} section={s} currency={trip.resolved_currency_code} tokens={tokens} />
        ))}

        {items.length === 0 ? (
          <View
            style={{
              backgroundColor: tokens.bg.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: tokens.border.subtle,
              padding: 24,
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: tokens.bg.tonal,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons name="shopping-cart" color={tokens.text.tertiary} size={28} />
            </View>
            <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '600' }}>
              No items yet
            </Text>
            <Text style={{ color: tokens.text.tertiary, fontSize: 13, textAlign: 'center' }}>
              Add goods you plan to buy on this trip.
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push(`/trips/${id}/add-items` as never)}
          style={({ pressed }) => ({
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
          })}
        >
          <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
            Add items
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SummaryCard({
  trip,
  plannedTotal,
  actualTotal,
  itemsBought,
  itemsTotal,
  tokens,
}: {
  trip: Trip;
  plannedTotal: number;
  actualTotal: number;
  itemsBought: number;
  itemsTotal: number;
  tokens: Theme;
}) {
  return (
    <View
      style={{
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 16,
        gap: 14,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <StatusBadge status={trip.status} tokens={tokens} />
        <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
          {formatTripDate(trip)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TotalCol label="Planned" value={plannedTotal} currency={trip.resolved_currency_code} tokens={tokens} />
        <TotalCol
          label={`Actual · ${itemsBought}/${itemsTotal}`}
          value={actualTotal}
          currency={trip.resolved_currency_code}
          tokens={tokens}
          highlight={trip.status === TRIP_STATUS_ENUM.COMPLETED}
        />
      </View>
    </View>
  );
}

function TotalCol({
  label,
  value,
  currency,
  tokens,
  highlight,
}: {
  label: string;
  value: number;
  currency: string;
  tokens: Theme;
  highlight?: boolean;
}) {
  return (
    <View>
      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 11,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: highlight ? tokens.accent.base : tokens.text.primary,
          fontSize: 22,
          fontWeight: '700',
          marginTop: 4,
          letterSpacing: -0.3,
        }}
      >
        {formatMoney(value, currency)}
      </Text>
    </View>
  );
}

type Section = {
  key: string;
  categoryName: string;
  categoryColor: string;
  items: { item: TripItem; good?: Good }[];
};

function groupByCategory(
  items: TripItem[],
  goodById: Map<number, Good>,
  categoryById: Map<number, Category>,
): Section[] {
  const groups = new Map<string, Section>();
  for (const item of items.slice().sort((a, b) => a.sort_order - b.sort_order)) {
    const good = goodById.get(item.good_id);
    const categoryId = item.category_id_snapshot ?? good?.default_category_id ?? null;
    const cat = categoryId != null ? categoryById.get(categoryId) : undefined;
    const key = cat ? String(cat.id) : 'uncategorized';
    let group = groups.get(key);
    if (!group) {
      group = {
        key,
        categoryName: cat?.name ?? 'Uncategorized',
        categoryColor: cat?.color_hex ?? '#9E9E9E',
        items: [],
      };
      groups.set(key, group);
    }
    group.items.push({ item, good });
  }
  return Array.from(groups.values());
}

function CategorySection({
  section,
  currency,
  tokens,
}: {
  section: Section;
  currency: string;
  tokens: Theme;
}) {
  return (
    <View
      style={{
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: tokens.bg.tonal,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: section.categoryColor,
          }}
        />
        <Text
          style={{
            color: tokens.text.secondary,
            fontSize: 12,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {section.categoryName}
        </Text>
        <Text style={{ color: tokens.text.tertiary, fontSize: 12 }}>
          · {section.items.length}
        </Text>
      </View>
      {section.items.map(({ item, good }, idx) => (
        <ItemRow
          key={item.id}
          item={item}
          good={good}
          currency={currency}
          isLast={idx === section.items.length - 1}
          tokens={tokens}
        />
      ))}
    </View>
  );
}

function ItemRow({
  item,
  good,
  currency,
  isLast,
  tokens,
}: {
  item: TripItem;
  good?: Good;
  currency: string;
  isLast: boolean;
  tokens: Theme;
}) {
  const qty = item.actual_quantity || item.planned_quantity || 0;
  const unit = good?.default_unit ?? '';
  const planned = (item.planned_quantity ?? 0) * (item.planned_unit_price ?? 0);
  const actual = (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
  const showActual = item.is_checked && actual > 0;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.border.subtle,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: item.is_checked ? tokens.success[0] : tokens.border.strong,
          backgroundColor: item.is_checked ? tokens.success[0] : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.is_checked ? (
          <MaterialIcons name="check" color={tokens.bg.surface} size={14} />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: tokens.text.primary,
            fontSize: 15,
            fontWeight: '500',
            textDecorationLine: item.is_checked ? 'line-through' : 'none',
            opacity: item.is_checked ? 0.6 : 1,
          }}
          numberOfLines={1}
        >
          {good?.name ?? 'Item'}
        </Text>
        {qty > 0 ? (
          <Text style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}>
            {qty} {unit}
          </Text>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        {showActual ? (
          <>
            <Text style={{ color: tokens.text.primary, fontSize: 14, fontWeight: '600' }}>
              {formatMoney(actual, currency)}
            </Text>
            {planned !== actual ? (
              <Text
                style={{
                  color: tokens.text.tertiary,
                  fontSize: 11,
                  textDecorationLine: 'line-through',
                }}
              >
                {formatMoney(planned, currency)}
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={{ color: tokens.text.secondary, fontSize: 14, fontWeight: '500' }}>
            {planned > 0 ? formatMoney(planned, currency) : '—'}
          </Text>
        )}
      </View>
    </View>
  );
}

function StatusBadge({ status, tokens }: { status: TripStatus; tokens: Theme }) {
  const { color, label } = statusVisuals(status, tokens);
  return (
    <View
      style={{
        backgroundColor: tokens.bg.tonal,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
      <Text style={{ color, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function statusVisuals(status: TripStatus, tokens: Theme) {
  switch (status) {
    case TRIP_STATUS_ENUM.PLANNED:
      return { color: tokens.info[0], label: 'Planned' };
    case TRIP_STATUS_ENUM.IN_PROGRESS:
      return { color: tokens.accent.base, label: 'Shopping' };
    case TRIP_STATUS_ENUM.COMPLETED:
      return { color: tokens.success[0], label: 'Done' };
    case TRIP_STATUS_ENUM.CANCELED:
      return { color: tokens.text.tertiary, label: 'Canceled' };
  }
}

function formatTripDate(trip: Trip): string {
  const d = trip.completed_at ?? trip.started_at ?? trip.planned_for ?? trip.created_at;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
