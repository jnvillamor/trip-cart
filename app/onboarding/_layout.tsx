import { Stack } from 'expo-router';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function OnboardingLayout() {
  const { tokens } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.bg.page },
      }}
    />
  );
}
