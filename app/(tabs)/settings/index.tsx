import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

type Row = {
  href: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
};

const ROWS: Row[] = [
  { href: '/settings/appearance', icon: 'palette', title: 'Appearance' },
  { href: '/settings/currency', icon: 'attach-money', title: 'Currency' },
  { href: '/settings/data', icon: 'backup', title: 'Data' },
  { href: '/settings/ai', icon: 'auto-awesome', title: 'AI' },
  { href: '/settings/about', icon: 'info-outline', title: 'About' },
];

export default function SettingsIndex() {
  const { tokens } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg.page }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View
        style={{
          backgroundColor: tokens.bg.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
          overflow: 'hidden',
        }}
      >
        {ROWS.map((row, i) => (
          <SettingsRow
            key={row.href}
            row={row}
            isLast={i === ROWS.length - 1}
            tokens={tokens}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function SettingsRow({ row, isLast, tokens }: { row: Row; isLast: boolean; tokens: Theme }) {
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
