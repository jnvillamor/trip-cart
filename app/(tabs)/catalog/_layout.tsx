import { Stack } from 'expo-router';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CatalogLayout() {
  const { tokens } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.bg.page },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="goods/[id]" />
      <Stack.Screen
        name="goods/new"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: 'large',
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
        }}
      />
      <Stack.Screen name="categories/[id]" />
      <Stack.Screen
        name="categories/new"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: 'large',
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
        }}
      />
    </Stack>
  );
}
