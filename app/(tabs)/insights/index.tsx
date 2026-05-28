import { MaterialIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, View } from 'react-native';
import { ByStoreTab } from '@/ui/components/insights-by-store/ByStoreTab';
import { OverviewTab } from '@/ui/components/insights-overview/OverviewTab';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

const TopTab = createMaterialTopTabNavigator();

export default function InsightsIndex() {
  const { tokens } = useTheme();
  return (
    <TopTab.Navigator
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

function ByCategoryTab() {
  const { tokens } = useTheme();
  return <Placeholder icon="pie-chart" title="Spend by category" tokens={tokens} />;
}

function PriceHistoryTab() {
  const { tokens } = useTheme();
  return <Placeholder icon="timeline" title="Price history" tokens={tokens} />;
}

function TripSummariesTab() {
  const { tokens } = useTheme();
  return <Placeholder icon="receipt-long" title="Trip summaries" tokens={tokens} />;
}

function Placeholder({
  icon,
  title,
  tokens,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  tokens: Theme;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg.page,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <MaterialIcons name={icon} color={tokens.text.tertiary} size={36} />
      </View>
      <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '600' }}>{title}</Text>
    </View>
  );
}
