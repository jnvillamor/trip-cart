import { Text, View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';
import { CategorySlice } from '@/ui/hooks/insights-by-category/useInsightsByCategoryController';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function CategoryBarChart({
  slices,
  currency,
}: {
  slices: CategorySlice[];
  currency: string;
}) {
  const { tokens } = useTheme();
  const data = slices.map((s, i) => ({ x: i, y: s.total, label: s.label }));

  if (slices.length === 0) {
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
          formatXLabel: (v: number) => slices[v]?.label ?? '',
          formatYLabel: (v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0),
          labelOffset: { x: 6, y: 8 },
        }}
      >
        {({ points, chartBounds }) =>
          points.y.map((p, i) => (
            <Bar
              key={i}
              points={[p]}
              chartBounds={chartBounds}
              color={slices[i]?.color ?? tokens.accent.base}
              roundedCorners={{ topLeft: 6, topRight: 6 }}
              barCount={slices.length}
            />
          ))
        }
      </CartesianChart>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
        {slices.slice(0, 6).map((s) => (
          <View
            key={String(s.categoryId)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: s.color,
              }}
            />
            <Text style={{ color: tokens.text.secondary, fontSize: 11 }}>
              {s.label}: {formatMoney(s.total, currency)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
