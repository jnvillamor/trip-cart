import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { TripSummary } from '@/ui/hooks/insights-trip-summaries/useInsightsTripSummariesController';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { VarianceBadge } from './VarianceBadge';

export function TripSummaryCard({
  summary,
  currency,
}: {
  summary: TripSummary;
  currency: string;
}) {
  const { tokens } = useTheme();
  const router = useRouter();
  const dateLabel = summary.date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <Pressable
      onPress={() => router.push(`/trips/${summary.trip.id}` as never)}
      style={({ pressed }) => ({
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 14,
        gap: 12,
      })}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 15,
              fontWeight: '700',
              letterSpacing: -0.2,
            }}
            numberOfLines={1}
          >
            {summary.trip.name}
          </Text>
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {summary.storeName} · {dateLabel} · {summary.itemsBought}/{summary.itemsTotal} items
          </Text>
        </View>
        <VarianceBadge
          variance={summary.variance}
          variancePct={summary.variancePct}
          currency={currency}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Col label="Planned" value={formatMoney(summary.planned, currency)} />
        <Col
          label="Actual"
          value={formatMoney(summary.actual, currency)}
          accent
        />
      </View>
    </Pressable>
  );
}

function Col({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  const { tokens } = useTheme();
  return (
    <View>
      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: accent ? tokens.accent.base : tokens.text.primary,
          fontSize: 17,
          fontWeight: '700',
          marginTop: 2,
          letterSpacing: -0.2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
