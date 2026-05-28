import { Text, View } from 'react-native';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function VarianceBadge({
  variance,
  variancePct,
  currency,
}: {
  variance: number;
  variancePct: number | null;
  currency: string;
}) {
  const { tokens } = useTheme();
  const isOver = variance > 0;
  const isUnder = variance < 0;
  const color = isOver
    ? tokens.danger[0]
    : isUnder
      ? tokens.success[0]
      : tokens.text.tertiary;
  const sign = isOver ? '+' : isUnder ? '−' : '';
  const pctLabel =
    variancePct != null && Math.abs(variancePct) > 0.001
      ? ` · ${Math.abs(variancePct * 100).toFixed(0)}%`
      : '';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: tokens.bg.tonal,
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
      <Text style={{ color, fontSize: 11, fontWeight: '700', letterSpacing: 0.2 }}>
        {sign}
        {formatMoney(Math.abs(variance), currency)}
        {pctLabel}
      </Text>
    </View>
  );
}
