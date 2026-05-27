import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function ShoppingModeScreen() {
  const { tokens } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: tokens.text.primary, fontSize: 18, fontWeight: '600' }}>
          Shopping mode
        </Text>
        <Text style={{ color: tokens.text.secondary, marginTop: 8 }}>trip id: {id}</Text>
        <Text style={{ color: tokens.text.tertiary, marginTop: 4 }}>Phase 2B.10</Text>
      </View>
    </SafeAreaView>
  );
}
