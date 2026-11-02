import { TopTabs } from 'expo-router/js-top-tabs';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function InsightsTopTabsLayout() {
  const { tokens } = useTheme();
  return (
    <TopTabs
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarStyle: {
          backgroundColor: tokens.bg.surface,
          borderBottomWidth: 1,
          borderBottomColor: tokens.border.subtle,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: { width: 'auto', paddingHorizontal: 16 },
        tabBarIndicatorStyle: {
          backgroundColor: tokens.accent.base,
          height: 3,
          borderRadius: 2,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 13,
          textTransform: 'none',
          letterSpacing: 0.2,
        },
        tabBarActiveTintColor: tokens.text.primary,
        tabBarInactiveTintColor: tokens.text.tertiary,
        tabBarPressColor: tokens.bg.elevated,
        sceneStyle: { backgroundColor: tokens.bg.page },
      }}
    >
      <TopTabs.Screen name="index" options={{ title: 'Overview' }} />
      <TopTabs.Screen name="by-store" options={{ title: 'By Store' }} />
      <TopTabs.Screen name="by-category" options={{ title: 'By Category' }} />
      <TopTabs.Screen name="price-history" options={{ title: 'Price History' }} />
      <TopTabs.Screen name="trip-summaries" options={{ title: 'Trip Summaries' }} />
    </TopTabs>
  );
}
