import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CatalogLayout() {
  const { tokens } = useTheme();
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tokens.bg.surface },
        headerTintColor: tokens.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: tokens.bg.page },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Catalog',
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/catalog/stores')}
              accessibilityLabel="Manage stores"
              hitSlop={8}
              style={{ padding: 8, marginRight: -8 }}
            >
              <MaterialIcons name="more-vert" color={tokens.text.primary} size={22} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="goods/[id]" options={{ title: 'Good' }} />
      <Stack.Screen name="categories/[id]" options={{ title: 'Category' }} />
      <Stack.Screen name="stores/index" options={{ title: 'Stores' }} />
      <Stack.Screen name="stores/[id]" options={{ title: 'Store' }} />
    </Stack>
  );
}
