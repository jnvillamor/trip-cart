import { ScrollView, View } from 'react-native';
import { PageHeader } from '@/ui/components/PageHeader';
import { SettingsRow, SettingsRowDef } from '@/ui/components/settings-index/SettingsRow';
import { useTheme } from '@/ui/theme/ThemeProvider';

const ROWS: SettingsRowDef[] = [
  { href: '/settings/appearance', icon: 'palette', title: 'Appearance' },
  { href: '/settings/currency', icon: 'attach-money', title: 'Currency' },
  { href: '/settings/data', icon: 'backup', title: 'Data' },
  { href: '/settings/ai', icon: 'auto-awesome', title: 'AI' },
  { href: '/settings/about', icon: 'info-outline', title: 'About' },
];

export default function SettingsIndex() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Settings" back={false} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
            <SettingsRow key={row.href} row={row} isLast={i === ROWS.length - 1} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
