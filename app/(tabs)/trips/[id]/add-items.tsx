import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function AddItemsScreen() {
  const { tokens } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg.page,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: tokens.text.primary }}>Add items (modal)</Text>
      <Text style={{ color: tokens.text.secondary, marginTop: 8 }}>trip id: {id}</Text>
      <Text style={{ color: tokens.text.tertiary, marginTop: 4 }}>Phase 2B.7</Text>
    </View>
  );
}
