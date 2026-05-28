import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ByCategoryTab } from '@/ui/components/insights-by-category/ByCategoryTab';
import { ByStoreTab } from '@/ui/components/insights-by-store/ByStoreTab';
import { OverviewTab } from '@/ui/components/insights-overview/OverviewTab';
import { PriceHistoryTab } from '@/ui/components/insights-price-history/PriceHistoryTab';
import { TripSummariesTab } from '@/ui/components/insights-trip-summaries/TripSummariesTab';
import { useTheme } from '@/ui/theme/ThemeProvider';

const TopTab = createMaterialTopTabNavigator();

export default function InsightsIndex() {
  const { tokens } = useTheme();
  return (
    <TopTab.Navigator
      id={undefined}
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
      <TopTab.Screen name="Overview" component={OverviewTab} />
      <TopTab.Screen name="By Store" component={ByStoreTab} />
      <TopTab.Screen name="By Category" component={ByCategoryTab} />
      <TopTab.Screen name="Price History" component={PriceHistoryTab} />
      <TopTab.Screen name="Trip Summaries" component={TripSummariesTab} />
    </TopTab.Navigator>
  );
}
