import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { DateRangeChips } from '@/ui/components/insights/DateRangeChips';
import { useInsightsTripSummariesController } from '@/ui/hooks/insights-trip-summaries/useInsightsTripSummariesController';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { TripSummaryCard } from './TripSummaryCard';
import { VarianceBadge } from './VarianceBadge';

export function TripSummariesTab() {
  const { tokens } = useTheme();
  const ctrl = useInsightsTripSummariesController();

  if (ctrl.loading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View style={{ padding: 16, paddingBottom: 12, gap: 12 }}>
        <DateRangeChips value={ctrl.range} onChange={ctrl.setRange} />

        <View
          style={{
            backgroundColor: tokens.bg.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: tokens.border.subtle,
            padding: 14,
            gap: 8,
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
            Range total
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  color: tokens.text.tertiary,
                  fontSize: 11,
                  fontWeight: '600',
                }}
              >
                Planned
              </Text>
              <Text
                style={{
                  color: tokens.text.primary,
                  fontSize: 18,
                  fontWeight: '700',
                  marginTop: 2,
                }}
              >
                {formatMoney(ctrl.aggregate.planned, ctrl.currency)}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: tokens.text.tertiary,
                  fontSize: 11,
                  fontWeight: '600',
                }}
              >
                Actual
              </Text>
              <Text
                style={{
                  color: tokens.accent.base,
                  fontSize: 22,
                  fontWeight: '700',
                  marginTop: 2,
                  letterSpacing: -0.3,
                }}
              >
                {formatMoney(ctrl.aggregate.actual, ctrl.currency)}
              </Text>
            </View>
            <VarianceBadge
              variance={ctrl.aggregate.variance}
              variancePct={ctrl.aggregate.variancePct}
              currency={ctrl.currency}
            />
          </View>
        </View>
      </View>

      <FlashList
        data={ctrl.summaries}
        keyExtractor={(s) => String(s.trip.id)}
        renderItem={({ item }) => (
          <TripSummaryCard summary={item} currency={ctrl.currency} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
        ListEmptyComponent={
          <View
            style={{
              backgroundColor: tokens.bg.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: tokens.border.subtle,
              padding: 24,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '700' }}>
              No completed trips in this range
            </Text>
            <Text
              style={{ color: tokens.text.tertiary, fontSize: 12, textAlign: 'center' }}
            >
              Complete a shopping trip to see its planned vs actual summary here.
            </Text>
          </View>
        }
      />
    </View>
  );
}
