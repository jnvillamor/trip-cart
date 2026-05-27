import { Stack } from 'expo-router';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CatalogLayout() {
  const { tokens } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tokens.bg.surface },
        headerTintColor: tokens.text.primary,
        contentStyle: { backgroundColor: tokens.bg.page },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="goods/index" options={{ title: 'Catalog' }} />
      <Stack.Screen name="goods/[id]" options={{ title: 'Good' }} />
      <Stack.Screen name="categories/index" options={{ title: 'Catalog' }} />
      <Stack.Screen name="categories/[id]" options={{ title: 'Category' }} />
      <Stack.Screen name="stores/index" options={{ title: 'Stores' }} />
      <Stack.Screen name="stores/[id]" options={{ title: 'Store' }} />
    </Stack>
  );
}
