import { Text, View } from 'react-native';
import { PageHeader } from '@/ui/components/PageHeader';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function DataScreen() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Data" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: tokens.text.tertiary }}>Coming in 2D.4 – 2D.5</Text>
      </View>
    </View>
  );
}
