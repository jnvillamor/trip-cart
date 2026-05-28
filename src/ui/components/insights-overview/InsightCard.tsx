import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function InsightCard({ message }: { message: string }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        backgroundColor: tokens.bg.tonal,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: tokens.accent.base,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="auto-awesome" color={tokens.text.onAccent} size={18} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          Insight
        </Text>
        <Text
          style={{
            color: tokens.text.primary,
            fontSize: 14,
            fontWeight: '500',
            lineHeight: 20,
          }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}
