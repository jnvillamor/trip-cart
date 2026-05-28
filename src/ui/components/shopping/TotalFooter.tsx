import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatMoney } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function TotalFooter({
  runningTotal,
  currency,
  onComplete,
}: {
  runningTotal: number;
  currency: string;
  onComplete?: () => void;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: 12,
        paddingBottom: insets.bottom + 12,
        paddingHorizontal: 16,
        backgroundColor: tokens.bg.surface,
        borderTopWidth: 1,
        borderTopColor: tokens.border.subtle,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Running total
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
          {formatMoney(runningTotal, currency)}
        </Text>
      </View>
      {onComplete ? (
        <Pressable
          onPress={onComplete}
          style={({ pressed }) => ({
            paddingHorizontal: 18,
            paddingVertical: 14,
            borderRadius: 14,
            backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
          })}
        >
          <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
            Complete
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
