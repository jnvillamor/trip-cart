import { Text, View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';
import { CategorySlice } from '@/ui/hooks/insights-by-category/useInsightsByCategoryController';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function CategoryPieChart({
  slices,
  grandTotal,
  currency,
}: {
  slices: CategorySlice[];
  grandTotal: number;
  currency: string;
}) {
  const { tokens } = useTheme();
  const data = slices.map((s, i) => ({
    label: s.label,
    value: s.total,
    color: s.color,
    key: i,
  }));

  if (slices.length === 0) {
    return <Empty />;
  }

  return (
    <View
      style={{
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 16,
        gap: 12,
      }}
    >
      <View style={{ height: 240, width: '100%' }}>
        <PolarChart data={data} labelKey="label" valueKey="value" colorKey="color">
          <Pie.Chart innerRadius="55%">
            {() => <Pie.Slice animate={{ type: 'spring' }} />}
          </Pie.Chart>
        </PolarChart>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {slices.map((s) => {
          const pct = grandTotal > 0 ? (s.total / grandTotal) * 100 : 0;
          return (
            <View
              key={String(s.categoryId)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: tokens.bg.tonal,
              }}
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
                {s.label}: {formatMoney(s.total, currency)} ({pct.toFixed(0)}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function Empty() {
  const { tokens } = useTheme();
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
      <Text style={{ color: tokens.text.tertiary, fontSize: 12, textAlign: 'center' }}>
        Bought items will show up here grouped by category.
      </Text>
    </View>
  );
}
