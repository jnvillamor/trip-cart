import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type SettingsRowDef = {
  href: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
};

export function SettingsRow({
  row,
  isLast,
}: {
  row: SettingsRowDef;
  isLast: boolean;
}) {
  const { tokens } = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(row.href as never)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
        backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.border.subtle,
      })}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={row.icon} color={tokens.accent.base} size={18} />
      </View>
      <Text
        style={{
          flex: 1,
          color: tokens.text.primary,
          fontSize: 15,
          fontWeight: '500',
        }}
      >
        {row.title}
      </Text>
      <MaterialIcons name="chevron-right" color={tokens.text.tertiary} size={20} />
    </Pressable>
  );
}
