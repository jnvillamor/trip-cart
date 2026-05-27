import { Text, View } from 'react-native';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Trip } from '@/domain/entities';
import { StatusBadge } from '@/ui/components/StatusBadge';
import { formatMoney, formatTripDate } from '@/ui/lib/format';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function SummaryCard({
  trip,
  plannedTotal,
  actualTotal,
  itemsBought,
  itemsTotal,
}: {
  trip: Trip;
  plannedTotal: number;
  actualTotal: number;
  itemsBought: number;
  itemsTotal: number;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 16,
        gap: 14,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <StatusBadge status={trip.status} />
        <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
          {formatTripDate(trip)}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TotalCol
          label="Planned"
          value={plannedTotal}
          currency={trip.resolved_currency_code}
          tokens={tokens}
        />
        <TotalCol
          label={`Actual · ${itemsBought}/${itemsTotal}`}
          value={actualTotal}
          currency={trip.resolved_currency_code}
          tokens={tokens}
          highlight={trip.status === TRIP_STATUS_ENUM.COMPLETED}
        />
      </View>
    </View>
  );
}

function TotalCol({
  label,
  value,
  currency,
  tokens,
  highlight,
}: {
  label: string;
  value: number;
  currency: string;
  tokens: Theme;
  highlight?: boolean;
}) {
  return (
    <View>
      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 11,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: highlight ? tokens.accent.base : tokens.text.primary,
          fontSize: 22,
          fontWeight: '700',
          marginTop: 4,
          letterSpacing: -0.3,
        }}
      >
        {formatMoney(value, currency)}
      </Text>
    </View>
  );
}
