import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Good, TripItem } from '@/domain/entities';
import { formatMoney, formatQty } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ShoppingItemRow({
  item,
  good,
  currency,
}: {
  item: TripItem;
  good: Good | undefined;
  currency: string;
}) {
  const { tokens } = useTheme();
  const qty = item.is_checked ? item.actual_quantity ?? 0 : item.planned_quantity ?? 0;
  const price = item.is_checked
    ? item.actual_unit_price ?? 0
    : item.planned_unit_price ?? 0;
  const line = qty * price;
  const dim = item.is_checked;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        backgroundColor: tokens.bg.surface,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        opacity: dim ? 0.55 : 1,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: item.is_checked ? tokens.success[0] : tokens.border.default,
          backgroundColor: item.is_checked ? tokens.success[0] : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.is_checked ? (
          <MaterialIcons name="check" color={tokens.text.onAccent} size={16} />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            color: tokens.text.primary,
            fontSize: 15,
            fontWeight: '600',
            textDecorationLine: dim ? 'line-through' : 'none',
          }}
        >
          {good?.name ?? 'Item'}
        </Text>
        <Text style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}>
          {formatQty(qty)}
          {good?.default_unit ? ` ${good.default_unit}` : ''} · {formatMoney(price, currency)}
        </Text>
      </View>
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 15,
          fontWeight: '700',
        }}
      >
        {formatMoney(line, currency)}
      </Text>
    </View>
  );
}
