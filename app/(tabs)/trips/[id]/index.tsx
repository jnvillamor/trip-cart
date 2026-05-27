import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Good, Trip, TripItem } from '@/domain/entities';
import { TripStatus } from '@/domain/schemas';
import { PageHeader } from '@/ui/components/PageHeader';
import { useCategories } from '@/ui/hooks/useCategories';
import { useGoods } from '@/ui/hooks/useGoods';
import { useStores } from '@/ui/hooks/useStores';
import { useTrip } from '@/ui/hooks/useTrips';
import { useTripItems, useUpdateTripItem } from '@/ui/hooks/useTripItems';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

type PriceEdit = {
  itemId: number;
  field: 'planned_unit_price' | 'actual_unit_price';
  initial: number;
};

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
  const updateItem = useUpdateTripItem(id);

  const [priceEdit, setPriceEdit] = useState<PriceEdit | null>(null);

  const store = stores.find((s) => s.id === trip?.store_id);
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const goodById = useMemo(() => new Map(goods.map((g) => [g.id, g])), [goods]);

  const sortedItems = useMemo(
    () => items.slice().sort((a, b) => a.sort_order - b.sort_order),
    [items],
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

  const isShopping = trip.status === TRIP_STATUS_ENUM.IN_PROGRESS;
  const editable = trip.is_editable;
  const currency = trip.resolved_currency_code;

  function fieldFor(item: TripItem, kind: 'qty' | 'price') {
    const useActual = isShopping && item.is_checked;
    if (kind === 'qty') return useActual ? 'actual_quantity' : 'planned_quantity';
    return useActual ? 'actual_unit_price' : 'planned_unit_price';
  }

  function adjustQty(item: TripItem, delta: number) {
    if (!editable) return;
    const field = fieldFor(item, 'qty') as 'planned_quantity' | 'actual_quantity';
    const current = item[field] ?? 0;
    const next = Math.max(0, current + delta);
    updateItem.mutate({ id: item.id, input: { [field]: next } });
  }

  function openPriceEditor(item: TripItem) {
    if (!editable) return;
    const field = fieldFor(item, 'price') as 'planned_unit_price' | 'actual_unit_price';
    setPriceEdit({ itemId: item.id, field, initial: item[field] ?? 0 });
  }

  function savePrice(value: number) {
    if (!priceEdit) return;
    updateItem.mutate({
      id: priceEdit.itemId,
      input: { [priceEdit.field]: value },
    });
    setPriceEdit(null);
  }

  async function handleDragEnd(newOrder: TripItem[]) {
    const updates = newOrder
      .map((item, i) => (item.sort_order !== i ? { id: item.id, sort_order: i } : null))
      .filter((x): x is { id: number; sort_order: number } => x !== null);
    await Promise.all(
      updates.map((u) => updateItem.mutateAsync({ id: u.id, input: { sort_order: u.sort_order } })),
    );
  }

  function getItemCategoryId(item: TripItem): number | null {
    return item.category_id_snapshot ?? goodById.get(item.good_id)?.default_category_id ?? null;
  }

  function renderRow({ item, drag, isActive, getIndex }: RenderItemParams<TripItem>) {
    const index = getIndex() ?? 0;
    const prev = index > 0 ? sortedItems[index - 1] : undefined;
    const currentCat = getItemCategoryId(item);
    const prevCat = prev ? getItemCategoryId(prev) : undefined;
    const showHeader = !prev || currentCat !== prevCat;
    const cat = currentCat != null ? categoryById.get(currentCat) : undefined;
    return (
      <View>
        {showHeader ? (
          <SectionHeader
            name={cat?.name ?? 'Uncategorized'}
            color={cat?.color_hex ?? '#9E9E9E'}
            tokens={tokens}
          />
        ) : null}
        <ItemRow
          item={item}
          good={goodById.get(item.good_id)}
          currency={currency}
          editable={editable}
          isShopping={isShopping}
          isActive={isActive}
          onLongPress={editable ? drag : undefined}
          onAdjustQty={(delta) => adjustQty(item, delta)}
          onPressPrice={() => openPriceEditor(item)}
          tokens={tokens}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title={trip.name} subtitle={store?.name} />
      <DraggableFlatList
        data={sortedItems}
        keyExtractor={(item) => String(item.id)}
        onDragEnd={({ data }) => handleDragEnd(data)}
        renderItem={renderRow}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 4 }}>
            <SummaryCard
              trip={trip}
              plannedTotal={plannedTotal}
              actualTotal={actualTotal}
              itemsBought={itemsBought}
              itemsTotal={items.length}
              tokens={tokens}
            />
          </View>
        }
        ListEmptyComponent={
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
        }
        ListFooterComponent={
          <Pressable
            onPress={() => router.push(`/trips/${id}/add-items` as never)}
            style={({ pressed }) => ({
              marginTop: 16,
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
        }
      />

      <NumpadSheet
        visible={priceEdit !== null}
        initial={priceEdit?.initial ?? 0}
        currency={trip.resolved_currency_code}
        onSave={savePrice}
        onClose={() => setPriceEdit(null)}
        tokens={tokens}
      />
    </View>
  );
}

function SectionHeader({ name, color, tokens }: { name: string; color: string; tokens: Theme }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          color: tokens.text.secondary,
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {name}
      </Text>
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
        <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>{formatTripDate(trip)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TotalCol
          label="Planned"
          value={plannedTotal}
          currency={trip.resolved_currency_code}
          tokens={tokens}
        />
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

function ItemRow({
  item,
  good,
  currency,
  editable,
  isShopping,
  isActive,
  onLongPress,
  onAdjustQty,
  onPressPrice,
  tokens,
}: {
  item: TripItem;
  good?: Good;
  currency: string;
  editable: boolean;
  isShopping: boolean;
  isActive: boolean;
  onLongPress?: () => void;
  onAdjustQty: (delta: number) => void;
  onPressPrice: () => void;
  tokens: Theme;
}) {
  const useActual = isShopping && item.is_checked;
  const qty = (useActual ? item.actual_quantity : item.planned_quantity) ?? 0;
  const price = (useActual ? item.actual_unit_price : item.planned_unit_price) ?? 0;
  const unit = good?.default_unit ?? '';
  const planned = (item.planned_quantity ?? 0) * (item.planned_unit_price ?? 0);
  const actual = (item.actual_quantity ?? 0) * (item.actual_unit_price ?? 0);
  const lineTotal = useActual ? actual : planned;

  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={250}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
        backgroundColor: isActive ? tokens.bg.elevated : tokens.bg.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: isActive ? tokens.accent.base : tokens.border.subtle,
        marginVertical: 3,
        shadowColor: '#000',
        shadowOpacity: isActive ? 0.2 : 0,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: isActive ? 4 : 0,
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

      <View style={{ flex: 1, gap: 6 }}>
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
        <QuantityStepper
          value={qty}
          unit={unit}
          editable={editable}
          onChange={onAdjustQty}
          tokens={tokens}
        />
      </View>

      <Pressable
        onPress={onPressPrice}
        disabled={!editable}
        hitSlop={6}
        style={({ pressed }) => ({
          alignItems: 'flex-end',
          paddingVertical: 4,
          paddingHorizontal: 6,
          borderRadius: 8,
          backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
        })}
      >
        <Text style={{ color: tokens.text.primary, fontSize: 14, fontWeight: '700' }}>
          {price > 0 ? formatMoney(price, currency) : '—'}
        </Text>
        <Text style={{ color: tokens.text.tertiary, fontSize: 11, marginTop: 2 }}>
          {lineTotal > 0 ? `Σ ${formatMoney(lineTotal, currency)}` : 'tap price'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

function QuantityStepper({
  value,
  unit,
  editable,
  onChange,
  tokens,
}: {
  value: number;
  unit: string;
  editable: boolean;
  onChange: (delta: number) => void;
  tokens: Theme;
}) {
  const btn = (label: string, delta: number, disabled: boolean) => (
    <Pressable
      onPress={() => onChange(delta)}
      disabled={!editable || disabled}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: !editable || disabled ? 0.35 : 1,
      })}
    >
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 16,
          fontWeight: '600',
          lineHeight: 18,
          marginTop: -2,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {btn('−', -1, value <= 0)}
      <Text
        style={{
          color: tokens.text.secondary,
          fontSize: 13,
          fontWeight: '600',
          minWidth: 40,
        }}
      >
        {formatQty(value)} {unit}
      </Text>
      {btn('+', 1, false)}
    </View>
  );
}

function NumpadSheet({
  visible,
  initial,
  currency,
  onSave,
  onClose,
  tokens,
}: {
  visible: boolean;
  initial: number;
  currency: string;
  onSave: (value: number) => void;
  onClose: () => void;
  tokens: Theme;
}) {
  const [text, setText] = useState('');

  function reset() {
    setText(initial > 0 ? String(initial) : '');
  }

  function push(c: string) {
    setText((prev) => {
      if (c === '.' && prev.includes('.')) return prev;
      if (prev === '' && c === '.') return '0.';
      const next = prev + c;
      if (next.length > 12) return prev;
      return next;
    });
  }

  function back() {
    setText((prev) => prev.slice(0, -1));
  }

  function done() {
    const num = parseFloat(text);
    onSave(Number.isFinite(num) ? num : 0);
  }

  const display = text || '0';
  const keys: { label: string; onPress: () => void }[][] = [
    [
      { label: '1', onPress: () => push('1') },
      { label: '2', onPress: () => push('2') },
      { label: '3', onPress: () => push('3') },
    ],
    [
      { label: '4', onPress: () => push('4') },
      { label: '5', onPress: () => push('5') },
      { label: '6', onPress: () => push('6') },
    ],
    [
      { label: '7', onPress: () => push('7') },
      { label: '8', onPress: () => push('8') },
      { label: '9', onPress: () => push('9') },
    ],
    [
      { label: '.', onPress: () => push('.') },
      { label: '0', onPress: () => push('0') },
      { label: '⌫', onPress: back },
    ],
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onShow={reset}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: tokens.overlay }} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: tokens.bg.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 20,
          paddingBottom: 36,
          gap: 16,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: tokens.border.default,
            marginTop: -8,
          }}
        />
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text
            style={{
              color: tokens.text.tertiary,
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Unit price · {currency}
          </Text>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 40,
              fontWeight: '700',
              letterSpacing: -0.5,
            }}
          >
            {display}
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          {keys.map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
              {row.map((k, j) => (
                <Pressable
                  key={j}
                  onPress={k.onPress}
                  style={({ pressed }) => ({
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
                  })}
                >
                  <Text
                    style={{
                      color: tokens.text.primary,
                      fontSize: 22,
                      fontWeight: '600',
                    }}
                  >
                    {k.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <Pressable
          onPress={done}
          style={({ pressed }) => ({
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
          })}
        >
          <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>Done</Text>
        </Pressable>
      </View>
    </Modal>
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

function formatQty(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, '');
}
