import { ScrollView, Text, View } from 'react-native';
import { useInsightsOverviewController } from '@/ui/hooks/insights-overview/useInsightsOverviewController';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { InsightCard } from './InsightCard';
import { KpiCard } from './KpiCard';

export function OverviewTab() {
  const { tokens } = useTheme();
  const ctrl = useInsightsOverviewController();

  if (ctrl.loading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  const { stats, currency } = ctrl;
  const deltaCaption = (() => {
    if (stats.deltaPct === null) {
      return stats.prevTotal === 0 && stats.mtdTotal > 0 ? 'First month tracking' : null;
    }
    const pct = Math.abs(stats.deltaPct * 100);
    if (Math.abs(stats.deltaPct) < 0.005) return 'Flat vs last month';
    const arrow = stats.deltaPct > 0 ? '↑' : '↓';
    return `${arrow} ${pct.toFixed(0)}% vs last month`;
  })();
  const deltaTone =
    stats.deltaPct === null || Math.abs(stats.deltaPct) < 0.005
      ? 'neutral'
      : stats.deltaPct > 0
        ? 'negative'
        : 'positive';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg.page }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        This month
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <KpiCard
          label="MTD spend"
          value={formatMoney(stats.mtdTotal, currency)}
          caption={deltaCaption ?? undefined}
          tone={deltaTone}
        />
        <KpiCard
          label="Trips"
          value={String(stats.mtdCount)}
          caption={
            stats.prevCount > 0 || stats.mtdCount > 0
              ? `${stats.prevCount} last month`
              : undefined
          }
        />
      </View>

      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        All time
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <KpiCard
          label="Total spend"
          value={formatMoney(stats.lifetimeTotal, currency)}
        />
        <KpiCard label="Completed trips" value={String(stats.lifetimeCount)} />
      </View>

      <View style={{ marginTop: 8 }}>
        <InsightCard message={ctrl.insight} />
      </View>
    </ScrollView>
  );
}
