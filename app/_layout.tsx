import 'react-native-gesture-handler';
import { Redirect, Slot, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SnackbarProvider } from '@/ui/components/Snackbar';
import { useOnboarded } from '@/ui/hooks/useOnboarded';
import { QueryProvider } from '@/ui/providers/QueryProvider';
import { ThemeProvider, useTheme } from '@/ui/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ThemeProvider>
          <SnackbarProvider>
            <ThemedStatusBar />
            <RootGate />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStatusBar() {
  const { resolved } = useTheme();
  return <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />;
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
