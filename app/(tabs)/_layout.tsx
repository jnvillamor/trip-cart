import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '@/ui/theme/ThemeProvider';

type IconName = keyof typeof MaterialIcons.glyphMap;

export default function TabsLayout() {
  const { tokens } = useTheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: tokens.bg.surface },
        headerTintColor: tokens.text.primary,
        tabBarStyle: {
          backgroundColor: tokens.bg.surface,
          borderTopColor: tokens.border.subtle,
        },
        tabBarActiveTintColor: tokens.accent.base,
        tabBarInactiveTintColor: tokens.text.tertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => tabIcon('home', color, size) }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => tabIcon('shopping-cart', color, size),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color, size }) => tabIcon('inventory-2', color, size),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => tabIcon('insights', color, size),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => tabIcon('settings', color, size),
        }}
      />
    </Tabs>
  );
}

function tabIcon(name: IconName, color: string, size: number) {
  return <MaterialIcons name={name} color={color} size={size} />;
}
