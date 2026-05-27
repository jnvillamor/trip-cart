import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
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
        <Icon sf="cart.fill" androidSrc={<MaterialIcons name="shopping-cart" />} />
        <Label>Trips</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stores">
        <Icon sf="storefront.fill" androidSrc={<MaterialIcons name="storefront" />} />
        <Label>Stores</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="catalog">
        <Icon sf="shippingbox.fill" androidSrc={<MaterialIcons name="inventory-2" />} />
        <Label>Catalog</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="insights">
        <Icon sf="chart.bar.fill" androidSrc={<MaterialIcons name="insights" />} />
        <Label>Insights</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gearshape.fill" androidSrc={<MaterialIcons name="settings" />} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
