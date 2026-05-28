import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatMoney } from '@/ui/lib/format';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function TotalFooter({
  runningTotal,
  plannedTotal,
  currency,
  onComplete,
  completing,
}: {
  runningTotal: number;
  plannedTotal: number;
  currency: string;
  onComplete?: () => void;
  completing?: boolean;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: 12,
        paddingBottom: insets.bottom + 12,
        paddingHorizontal: 16,
        backgroundColor: tokens.bg.surface,
        borderTopWidth: 1,
        borderTopColor: tokens.border.subtle,
        gap: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <TotalCol
          label="Planned"
          value={plannedTotal}
          currency={currency}
          tokens={tokens}
        />
        <TotalCol
          label="Running"
          value={runningTotal}
          currency={currency}
          tokens={tokens}
          accent
        />
      </View>
      {onComplete ? (
        <Pressable
          onPress={onComplete}
          disabled={completing}
          style={({ pressed }) => ({
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
            opacity: completing ? 0.6 : 1,
          })}
        >
          <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
            Complete shopping
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function TotalCol({
  label,
  value,
  currency,
  tokens,
  accent,
}: {
  label: string;
  value: number;
  currency: string;
  tokens: Theme;
  accent?: boolean;
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
          color: accent ? tokens.accent.base : tokens.text.primary,
          fontSize: accent ? 24 : 18,
          fontWeight: '700',
          marginTop: 2,
          letterSpacing: -0.3,
        }}
      >
        {formatMoney(value, currency)}
      </Text>
    </View>
  );
}
