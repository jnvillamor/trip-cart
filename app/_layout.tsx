import { Redirect, Slot, useSegments } from 'expo-router';
import { useOnboarded } from '@/ui/hooks/useOnboarded';
import { QueryProvider } from '@/ui/providers/QueryProvider';
import { ThemeProvider } from '@/ui/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RootGate />
      </ThemeProvider>
    </QueryProvider>
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
