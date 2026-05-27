import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function StoreDetailScreen() {
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
      <Text style={{ color: tokens.text.primary }}>Store detail</Text>
      <Text style={{ color: tokens.text.secondary, marginTop: 8 }}>id: {id}</Text>
      <Text style={{ color: tokens.text.tertiary, marginTop: 4 }}>Phase 2A.2</Text>
    </View>
  );
}
