import { Stack } from 'expo-router';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function SettingsLayout() {
  const { tokens } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tokens.bg.surface },
        headerTintColor: tokens.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: tokens.bg.page },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
      <Stack.Screen name="currency" options={{ title: 'Currency' }} />
      <Stack.Screen name="data" options={{ title: 'Data' }} />
      <Stack.Screen name="ai" options={{ title: 'AI' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
