import { Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function TripsScreen() {
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
      <Text style={{ color: tokens.text.primary }}>Trips</Text>
    </View>
  );
}
