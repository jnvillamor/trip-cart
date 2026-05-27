import 'react-native-gesture-handler';
import { Redirect, Slot, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOnboarded } from '@/ui/hooks/useOnboarded';
import { QueryProvider } from '@/ui/providers/QueryProvider';
import { ThemeProvider } from '@/ui/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ThemeProvider>
          <RootGate />
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

function RootGate() {
  const { data: onboarded, isLoading } = useOnboarded();
  const segments = useSegments();

  if (isLoading) return null;

  const inOnboarding = segments[0] === 'onboarding';
  if (!onboarded && !inOnboarding) return <Redirect href="/onboarding/currency" />;
  if (onboarded && inOnboarding) return <Redirect href="/trips" />;

  return <Slot />;
}
