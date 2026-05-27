import { MaterialIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, View } from 'react-native';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

const TopTab = createMaterialTopTabNavigator();

export default function CatalogIndex() {
  const { tokens } = useTheme();
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: tokens.bg.surface,
          borderBottomWidth: 1,
          borderBottomColor: tokens.border.subtle,
          elevation: 0,
          shadowOpacity: 0,
        },
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
      <TopTab.Screen name="Goods" component={GoodsTab} />
      <TopTab.Screen name="Categories" component={CategoriesTab} />
    </TopTab.Navigator>
  );
}

function GoodsTab() {
  const { tokens } = useTheme();
  return <Placeholder icon="inventory-2" title="Goods list" phase="2A.5" tokens={tokens} />;
}

function CategoriesTab() {
  const { tokens } = useTheme();
  return <Placeholder icon="category" title="Categories list" phase="2A.3" tokens={tokens} />;
}

function Placeholder({
  icon,
  title,
  phase,
  tokens,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  phase: string;
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
      <Text style={{ color: tokens.text.tertiary, marginTop: 6, fontSize: 13 }}>
        Coming in {phase}
      </Text>
    </View>
  );
}
