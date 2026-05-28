import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Good, TripItem } from '@/domain/entities';
import { formatMoney, formatQty } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ShoppingItemRow({
  item,
  good,
  currency,
  onToggleChecked,
  onEdit,
}: {
  item: TripItem;
  good: Good | undefined;
  currency: string;
  onToggleChecked: () => void;
  onEdit: () => void;
}) {
  const { tokens } = useTheme();
  const qty = item.is_checked ? item.actual_quantity ?? 0 : item.planned_quantity ?? 0;
  const price = item.is_checked
    ? item.actual_unit_price ?? 0
    : item.planned_unit_price ?? 0;
  const line = qty * price;

  const renderRightActions = () => (
    <Pressable
      onPress={onToggleChecked}
      style={{
        width: 96,
        marginLeft: 8,
        borderRadius: 14,
        backgroundColor: item.is_checked ? tokens.bg.tonal : tokens.success[0],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MaterialIcons
        name={item.is_checked ? 'undo' : 'check'}
        color={item.is_checked ? tokens.text.primary : tokens.text.onAccent}
        size={22}
      />
      <Text
        style={{
          marginTop: 4,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
          color: item.is_checked ? tokens.text.secondary : tokens.text.onAccent,
        }}
      >
        {item.is_checked ? 'UNDO' : 'BOUGHT'}
      </Text>
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false} friction={2}>
      <Pressable
        onPress={onEdit}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 14,
          borderRadius: 14,
          backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          opacity: item.is_checked ? 0.55 : 1,
        })}
      >
        <Pressable
          onPress={onToggleChecked}
          hitSlop={10}
          accessibilityLabel={item.is_checked ? 'Mark as not bought' : 'Mark as bought'}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: item.is_checked ? tokens.success[0] : tokens.border.default,
            backgroundColor: item.is_checked
              ? tokens.success[0]
              : pressed
                ? tokens.bg.elevated
                : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          {item.is_checked ? (
            <MaterialIcons name="check" color={tokens.text.onAccent} size={22} />
          ) : null}
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: tokens.text.primary,
              fontSize: 15,
              fontWeight: '600',
              textDecorationLine: item.is_checked ? 'line-through' : 'none',
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
      </Pressable>
    </Swipeable>
  );
}
