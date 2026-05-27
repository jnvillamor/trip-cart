import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Good, TripItem } from '@/domain/entities';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { QuantityStepper } from './QuantityStepper';

export function ItemRow({
  item,
  good,
  currency,
  editable,
  isShopping,
  isActive,
  onLongPress,
  onAdjustQty,
  onPressPrice,
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
}) {
  const { tokens } = useTheme();
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
        <QuantityStepper value={qty} unit={unit} editable={editable} onChange={onAdjustQty} />
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
