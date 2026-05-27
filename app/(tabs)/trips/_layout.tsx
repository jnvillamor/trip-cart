import { Stack } from 'expo-router';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function TripsLayout() {
  const { tokens } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tokens.bg.surface },
        headerTintColor: tokens.text.primary,
        contentStyle: { backgroundColor: tokens.bg.page },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Trips' }} />
      <Stack.Screen name="new" options={{ presentation: 'modal', title: 'New trip' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Trip' }} />
      <Stack.Screen
        name="[id]/add-items"
        options={{ presentation: 'modal', title: 'Add items' }}
      />
    </Stack>
  );
}
