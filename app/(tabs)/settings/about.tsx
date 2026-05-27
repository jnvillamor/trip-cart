import { Text, View } from 'react-native';
import { PageHeader } from '@/ui/components/PageHeader';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function AboutScreen() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="About" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: tokens.text.tertiary }}>Coming in 2D.7</Text>
      </View>
    </View>
  );
}
