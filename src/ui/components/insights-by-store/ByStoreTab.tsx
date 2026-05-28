import { ScrollView, Text, View } from 'react-native';
import { useInsightsByStoreController } from '@/ui/hooks/insights-by-store/useInsightsByStoreController';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { DateRangeChips } from './DateRangeChips';
import { StoreBarChart } from './StoreBarChart';

export function ByStoreTab() {
  const { tokens } = useTheme();
  const ctrl = useInsightsByStoreController();

  if (ctrl.loading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg.page }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <DateRangeChips value={ctrl.range} onChange={ctrl.setRange} />

      <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
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
            Trips
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
            {ctrl.tripsInRange}
          </Text>
        </View>
      </View>

      <StoreBarChart bars={ctrl.bars} currency={ctrl.currency} />
    </ScrollView>
  );
}
