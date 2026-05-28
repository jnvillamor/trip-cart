import { Text, View } from 'react-native';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function PriceStats({
  overall,
  currency,
}: {
  overall: {
    avg: number;
    min: number;
    max: number;
    latest: number;
    first: number;
    changePct: number | null;
  };
  currency: string;
}) {
  const { tokens } = useTheme();
  const changePct = overall.changePct;
  const up = changePct != null && changePct > 0.005;
  const down = changePct != null && changePct < -0.005;
  const captionColor = up
    ? tokens.danger[0]
    : down
      ? tokens.success[0]
      : tokens.text.tertiary;
  const captionLabel = (() => {
    if (changePct == null || Math.abs(changePct) < 0.005) return 'Flat over range';
    const arrow = changePct > 0 ? '↑' : '↓';
    return `${arrow} ${Math.abs(changePct * 100).toFixed(0)}% vs first`;
  })();
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
      }}
    >
      <Stat label="Latest" value={formatMoney(overall.latest, currency)} caption={captionLabel} captionColor={captionColor} />
      <Stat label="Avg" value={formatMoney(overall.avg, currency)} />
      <Stat label="Min" value={formatMoney(overall.min, currency)} />
      <Stat label="Max" value={formatMoney(overall.max, currency)} />
    </View>
  );
}

function Stat({
  label,
  value,
  caption,
  captionColor,
}: {
  label: string;
  value: string;
  caption?: string;
  captionColor?: string;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        backgroundColor: tokens.bg.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 12,
        flexGrow: 1,
        minWidth: '46%',
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
        {label}
      </Text>
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 18,
          fontWeight: '700',
          marginTop: 2,
          letterSpacing: -0.2,
        }}
      >
        {value}
      </Text>
      {caption ? (
        <Text
          style={{
            color: captionColor ?? tokens.text.tertiary,
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
          }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
