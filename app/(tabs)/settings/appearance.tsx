import { ScrollView, Text, View } from 'react-native';
import { THEME_MODE_ENUM } from '@/domain/constants';
import { PageHeader } from '@/ui/components/PageHeader';
import { ThemeModeRow } from '@/ui/components/settings-appearance/ThemeModeRow';
import { useTheme } from '@/ui/theme/ThemeProvider';

const OPTIONS = [
  {
    value: THEME_MODE_ENUM.LIGHT,
    label: 'Light',
    description: 'Always use the light theme.',
    icon: 'light-mode' as const,
  },
  {
    value: THEME_MODE_ENUM.DARK,
    label: 'Dark',
    description: 'Always use the dark theme.',
    icon: 'dark-mode' as const,
  },
  {
    value: THEME_MODE_ENUM.SYSTEM,
    label: 'System',
    description: 'Follow your device setting.',
    icon: 'phone-iphone' as const,
  },
];

export default function AppearanceScreen() {
  const { tokens, mode, setMode } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Appearance" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            paddingHorizontal: 4,
          }}
        >
          Theme
        </Text>
        <View
          style={{
            backgroundColor: tokens.bg.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: tokens.border.subtle,
            overflow: 'hidden',
          }}
        >
          {OPTIONS.map((opt, i) => (
            <ThemeModeRow
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              description={opt.description}
              active={mode === opt.value}
              isLast={i === OPTIONS.length - 1}
              onPress={() => setMode(opt.value)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
