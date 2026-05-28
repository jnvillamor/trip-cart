import { Text, View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { StoreBar } from '@/ui/hooks/insights-by-store/useInsightsByStoreController';

export function StoreBarChart({
  bars,
  currency,
}: {
  bars: StoreBar[];
  currency: string;
}) {
  const { tokens } = useTheme();
  const data = bars.map((b, i) => ({
    x: i,
    y: b.total,
    label: b.label,
  }));

  if (bars.length === 0) {
    return (
      <View
        style={{
          height: 240,
          backgroundColor: tokens.bg.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 6,
        }}
      >
        <Text style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '700' }}>
          No spending yet in this range
        </Text>
        <Text
          style={{ color: tokens.text.tertiary, fontSize: 12, textAlign: 'center' }}
        >
          Complete a trip to start seeing spend by store.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        height: 280,
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 12,
      }}
    >
      <CartesianChart
        data={data}
        xKey="x"
        yKeys={['y']}
        domainPadding={{ left: 32, right: 32, top: 16, bottom: 8 }}
        axisOptions={{
          lineColor: tokens.border.subtle,
          labelColor: tokens.text.tertiary,
          formatXLabel: (v: number) => bars[v]?.label ?? '',
          formatYLabel: (v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0),
          labelOffset: { x: 6, y: 8 },
        }}
      >
        {({ points, chartBounds }) => (
          <Bar
            points={points.y}
            chartBounds={chartBounds}
            color={tokens.accent.base}
            roundedCorners={{ topLeft: 6, topRight: 6 }}
            barCount={bars.length}
          />
        )}
      </CartesianChart>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
        {bars.slice(0, 6).map((b) => (
          <View
            key={b.storeId}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: tokens.accent.base,
              }}
            />
            <Text style={{ color: tokens.text.secondary, fontSize: 11 }}>
              {b.label}: {formatMoney(b.total, currency)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
