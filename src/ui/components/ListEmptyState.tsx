import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ListEmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <MaterialIcons name={icon} color={tokens.text.tertiary} size={44} />
      </View>
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 18,
          fontWeight: '700',
          letterSpacing: -0.2,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: tokens.text.tertiary,
            marginTop: 8,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
