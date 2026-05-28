import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function BoughtDivider({ count }: { count: number }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 18,
        marginBottom: 4,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: tokens.border.subtle }} />
      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.6,
        }}
      >
        BOUGHT · {count}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: tokens.border.subtle }} />
    </View>
  );
}
