import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function SectionHeader({ name, color }: { name: string; color: string }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          color: tokens.text.secondary,
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {name}
      </Text>
    </View>
  );
}
