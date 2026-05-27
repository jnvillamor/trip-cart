import { Text, View } from 'react-native';
import { ActiveTripBanner } from '@/ui/components/ActiveTripBanner';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function TripsListScreen() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <ActiveTripBanner />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: tokens.text.primary }}>Trips list</Text>
      </View>
    </View>
  );
}
