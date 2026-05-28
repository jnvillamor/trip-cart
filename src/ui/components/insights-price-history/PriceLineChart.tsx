import { Text, View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { StoreSeries } from '@/ui/hooks/insights-price-history/useInsightsPriceHistoryController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function PriceLineChart({
  series,
  currency,
}: {
  series: StoreSeries[];
  currency: string;
}) {
  const { tokens } = useTheme();
  const totalPoints = series.reduce((sum, s) => sum + s.points.length, 0);

  if (totalPoints === 0) {
    return (
      <View
        style={{
          height: 220,
          backgroundColor: tokens.bg.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Text style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '700' }}>
          No price history yet
        </Text>
        <Text style={{ color: tokens.text.tertiary, fontSize: 12, textAlign: 'center' }}>
          Pick a good above to see how its price has changed.
        </Text>
      </View>
    );
  }

  // Merge points by timestamp; each series becomes a separate Y-key column.
  const tSet = new Set<number>();
  for (const s of series) for (const p of s.points) tSet.add(p.t);
  const ts = Array.from(tSet).sort((a, b) => a - b);

  type Row = { t: number } & Record<string, number | undefined>;
  const data: Row[] = ts.map((t) => {
    const row: Row = { t };
    for (let i = 0; i < series.length; i++) {
      const yKey = `y${i}`;
      const match = series[i]!.points.find((p) => p.t === t);
      row[yKey] = match ? match.price : undefined;
    }
    return row;
  });

  const yKeys = series.map((_, i) => `y${i}` as const);

  return (
    <View
      style={{
        height: 260,
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 12,
      }}
    >
      <CartesianChart
        data={data}
        xKey="t"
        yKeys={yKeys}
        domainPadding={{ left: 24, right: 24, top: 16, bottom: 8 }}
        axisOptions={{
          lineColor: tokens.border.subtle,
          labelColor: tokens.text.tertiary,
          formatXLabel: (v: number) =>
            new Date(v).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            }),
          formatYLabel: (v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0),
          labelOffset: { x: 6, y: 8 },
        }}
      >
        {({ points }) =>
          series.map((s, i) => (
            <Line
              key={s.storeId}
              points={points[`y${i}`]!.filter((p) => p.y != null)}
              color={s.color}
              strokeWidth={2.5}
              animate={{ type: 'timing', duration: 300 }}
              connectMissingData={false}
              curveType="linear"
            />
          ))
        }
      </CartesianChart>
    </View>
  );
}
