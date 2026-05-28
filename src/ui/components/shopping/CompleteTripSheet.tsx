import { Modal, Pressable, Text, View } from 'react-native';
import { formatMoney } from '@/ui/lib/format';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function CompleteTripSheet({
  visible,
  plannedTotal,
  actualTotal,
  itemsBought,
  itemsTotal,
  currency,
  busy,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  plannedTotal: number;
  actualTotal: number;
  itemsBought: number;
  itemsTotal: number;
  currency: string;
  busy: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  const variance = actualTotal - plannedTotal;
  const overBudget = variance > 0;
  const variancePct = plannedTotal > 0 ? Math.abs(variance) / plannedTotal : 0;
  const varianceColor = overBudget ? tokens.danger[0] : tokens.success[0];
  const varianceLabel = overBudget ? 'Over plan' : variance < 0 ? 'Under plan' : 'On plan';
  const varianceSign = variance > 0 ? '+' : variance < 0 ? '−' : '';

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
          }}
        />

        <View style={{ gap: 6 }}>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 22,
              fontWeight: '700',
              letterSpacing: -0.3,
            }}
          >
            Complete this trip?
          </Text>
          <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
            Locked trips can be duplicated but not edited. {itemsBought}/{itemsTotal} items
            bought.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: tokens.bg.page,
            borderRadius: 16,
            padding: 16,
            gap: 12,
          }}
        >
          <Row label="Planned" value={formatMoney(plannedTotal, currency)} tokens={tokens} />
          <Row
            label="Actual"
            value={formatMoney(actualTotal, currency)}
            tokens={tokens}
            accent
          />
          <View
            style={{ height: 1, backgroundColor: tokens.border.subtle, marginVertical: 2 }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                color: tokens.text.tertiary,
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {varianceLabel}
            </Text>
            <Text
              style={{
                color: varianceColor,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              {variance === 0
                ? formatMoney(0, currency)
                : `${varianceSign}${formatMoney(Math.abs(variance), currency)}`}
              {plannedTotal > 0 && variance !== 0
                ? ` · ${(variancePct * 100).toFixed(0)}%`
                : ''}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={onClose}
            disabled={busy}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
              backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
              opacity: busy ? 0.6 : 1,
            })}
          >
            <Text
              style={{
                color: tokens.text.primary,
                fontSize: 15,
                fontWeight: '700',
              }}
            >
              Not yet
            </Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            disabled={busy}
            style={({ pressed }) => ({
              flex: 1.5,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
              backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
              opacity: busy ? 0.6 : 1,
            })}
          >
            <Text
              style={{
                color: tokens.text.onAccent,
                fontSize: 15,
                fontWeight: '700',
              }}
            >
              Lock trip
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Row({
  label,
  value,
  tokens,
  accent,
}: {
  label: string;
  value: string;
  tokens: Theme;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text style={{ color: tokens.text.tertiary, fontSize: 13, fontWeight: '600' }}>
        {label}
      </Text>
      <Text
        style={{
          color: accent ? tokens.accent.base : tokens.text.primary,
          fontSize: accent ? 22 : 18,
          fontWeight: '700',
          letterSpacing: -0.2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
