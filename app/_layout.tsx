import { Slot } from 'expo-router';
import { ThemeProvider } from '@/ui/theme/ThemeProvider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
