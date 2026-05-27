import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { PageHeader } from '@/ui/components/PageHeader';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function TripDetailScreen() {
  const { tokens } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Trip" subtitle={`id: ${id}`} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: tokens.text.primary }}>Trip detail</Text>
      </View>
    </View>
  );
}
