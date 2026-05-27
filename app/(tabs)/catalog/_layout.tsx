import { Stack } from 'expo-router';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CatalogLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="goods/[id]" options={{ title: 'Good' }} />
      <Stack.Screen name="categories/[id]" options={{ title: 'Category' }} />
      <Stack.Screen
        name="categories/new"
        options={{
          title: 'New category',
          presentation: 'formSheet',
          sheetAllowedDetents: 'large',
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
        }}
      />
    </Stack>
  );
}
