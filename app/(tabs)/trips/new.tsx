import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function NewTripScreen() {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg.page,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: tokens.text.primary }}>New trip (modal)</Text>
      <Text style={{ color: tokens.text.tertiary, marginTop: 8 }}>Phase 2B.2</Text>
    </View>
  );
}
