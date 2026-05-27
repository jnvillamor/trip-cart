import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function GoodDetailScreen() {
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
      <Text style={{ color: tokens.text.primary }}>Good detail</Text>
      <Text style={{ color: tokens.text.secondary, marginTop: 8 }}>id: {id}</Text>
    </View>
  );
}
