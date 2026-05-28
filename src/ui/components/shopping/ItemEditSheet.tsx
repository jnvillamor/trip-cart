import { Modal, Pressable, Text, View } from 'react-native';
import { Good, TripItem } from '@/domain/entities';
import { QuantityStepper } from '@/ui/components/trip-detail/QuantityStepper';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ItemEditSheet({
  visible,
  item,
  good,
  currency,
  onAdjustQty,
  onEditPrice,
  onClose,
}: {
  visible: boolean;
  item: TripItem | undefined;
  good: Good | undefined;
  currency: string;
  onAdjustQty: (delta: number) => void;
  onEditPrice: () => void;
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  if (!item) return null;

  const qty = item.is_checked ? item.actual_quantity ?? 0 : item.planned_quantity ?? 0;
  const price = item.is_checked
    ? item.actual_unit_price ?? 0
    : item.planned_unit_price ?? 0;
  const fieldLabel = item.is_checked ? 'Actual' : 'Planned';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
          paddingTop: 8,
          paddingBottom: 32,
          paddingHorizontal: 20,
          gap: 18,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: tokens.border.default,
          }}
        />
        <View style={{ gap: 4 }}>
          <Text
            style={{
              color: tokens.text.tertiary,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {fieldLabel}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: tokens.text.primary,
              fontSize: 20,
              fontWeight: '700',
              letterSpacing: -0.2,
            }}
          >
            {good?.name ?? 'Item'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: tokens.bg.page,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: tokens.text.secondary, fontSize: 13, fontWeight: '600' }}>
            Quantity
          </Text>
          <QuantityStepper
            value={qty}
            unit={good?.default_unit ?? ''}
            editable
            onChange={onAdjustQty}
          />
        </View>

        <Pressable
          onPress={onEditPrice}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.page,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 14,
          })}
        >
          <Text style={{ color: tokens.text.secondary, fontSize: 13, fontWeight: '600' }}>
            Unit price
          </Text>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            {formatMoney(price, currency)}
          </Text>
        </Pressable>

        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
          })}
        >
          <Text style={{ color: tokens.text.onAccent, fontSize: 15, fontWeight: '700' }}>
            Done
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}
