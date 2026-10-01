import { MaterialIcons } from '@expo/vector-icons';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function TabsLayout() {
  const { tokens } = useTheme();
  return (
    <NativeTabs
      backgroundColor={tokens.bg.surface}
      tintColor={tokens.accent.base}
      iconColor={{ default: tokens.text.tertiary, selected: tokens.accent.base }}
      labelStyle={{ color: tokens.text.tertiary }}
    >
      <NativeTabs.Trigger name="trips">
        <NativeTabs.Trigger.Icon
          sf="cart.fill"
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="shopping-cart" />}
        />
        <NativeTabs.Trigger.Label>Trips</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stores">
        <NativeTabs.Trigger.Icon
          sf="storefront.fill"
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="storefront" />}
        />
        <NativeTabs.Trigger.Label>Stores</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="catalog">
        <NativeTabs.Trigger.Icon
          sf="shippingbox.fill"
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="inventory-2" />}
        />
        <NativeTabs.Trigger.Label>Catalog</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="insights">
        <NativeTabs.Trigger.Icon
          sf="chart.bar.fill"
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="insights" />}
        />
        <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf="gearshape.fill"
          src={<NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="settings" />}
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
