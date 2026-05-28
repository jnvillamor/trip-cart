import { Pressable, Text, View } from 'react-native';
import { formatQty } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function QuantityStepper({
  value,
  unit,
  editable,
  onChange,
}: {
  value: number;
  unit: string;
  editable: boolean;
  onChange: (delta: number) => void;
}) {
  const { tokens } = useTheme();
  const btn = (label: string, delta: number, disabled: boolean) => (
    <Pressable
      onPress={() => onChange(delta)}
      disabled={!editable || disabled}
      hitSlop={6}
      style={({ pressed }) => ({
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: !editable || disabled ? 0.35 : 1,
      })}
    >
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 16,
          fontWeight: '600',
          lineHeight: 18,
          marginTop: -2,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {btn('−', -1, value <= 0)}
      <Text
        style={{
          color: tokens.text.secondary,
          fontSize: 13,
          fontWeight: '600',
          minWidth: 48,
          textAlign: 'center',
        }}
      >
        {formatQty(value)}
        {unit ? ` ${unit}` : ''}
      </Text>
      {btn('+', 1, false)}
    </View>
  );
}
