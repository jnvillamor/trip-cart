import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
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
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboarded && !inOnboarding) {
      router.replace('/onboarding/currency');
    } else if (onboarded && inOnboarding) {
      router.replace('/');
    }
  }, [onboarded, isLoading, segments, router]);

  return <Slot />;
}
