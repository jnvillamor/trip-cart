import { ScrollView, Text, View } from 'react-native';
import { DateRangeChips } from '@/ui/components/insights/DateRangeChips';
import { useInsightsByCategoryController } from '@/ui/hooks/insights-by-category/useInsightsByCategoryController';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { CategoryBarChart } from './CategoryBarChart';
import { CategoryPieChart } from './CategoryPieChart';
import { ChartModeToggle } from './ChartModeToggle';

export function ByCategoryTab() {
  const { tokens } = useTheme();
  const ctrl = useInsightsByCategoryController();

  if (ctrl.loading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg.page }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <DateRangeChips value={ctrl.range} onChange={ctrl.setRange} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <View>
          <Text
            style={{
              color: tokens.text.tertiary,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Total spend
          </Text>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 24,
              fontWeight: '700',
              marginTop: 2,
              letterSpacing: -0.3,
            }}
          >
            {formatMoney(ctrl.grandTotal, ctrl.currency)}
          </Text>
        </View>
        <ChartModeToggle value={ctrl.mode} onChange={ctrl.setMode} />
      </View>

      {ctrl.mode === 'pie' ? (
        <CategoryPieChart
          slices={ctrl.slices}
          grandTotal={ctrl.grandTotal}
          currency={ctrl.currency}
        />
      ) : (
        <CategoryBarChart slices={ctrl.slices} currency={ctrl.currency} />
      )}
    </ScrollView>
  );
}
