import { Slot } from 'expo-router';
import { QueryProvider } from '@/ui/providers/QueryProvider';
import { ThemeProvider } from '@/ui/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </QueryProvider>
  );
}
