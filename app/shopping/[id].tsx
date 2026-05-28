import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { ShoppingHeader } from '@/ui/components/shopping/ShoppingHeader';
import { ShoppingItemRow } from '@/ui/components/shopping/ShoppingItemRow';
import { TotalFooter } from '@/ui/components/shopping/TotalFooter';
import { useShoppingController } from '@/ui/hooks/shopping/useShoppingController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function ShoppingModeScreen() {
  const { tokens } = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const ctrl = useShoppingController(id);

  if (ctrl.loading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  if (ctrl.notFound) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg.page,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: tokens.text.primary }}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <ShoppingHeader
        title={ctrl.trip.name}
        subtitle={ctrl.store?.name}
        itemsBought={ctrl.itemsBought}
        itemsTotal={ctrl.itemsTotal}
        onExit={ctrl.exit}
      />

      <FlashList
        data={ctrl.sortedItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ShoppingItemRow
            item={item}
            good={ctrl.goodFor(item)}
            currency={ctrl.currency}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 24,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View
            style={{
              padding: 32,
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '700' }}>
              No items on this trip
            </Text>
            <Text
              style={{ color: tokens.text.tertiary, fontSize: 13, textAlign: 'center' }}
            >
              Add items from the trip detail screen before you start shopping.
            </Text>
          </View>
        }
      />

      <TotalFooter runningTotal={ctrl.runningTotal} currency={ctrl.currency} />
    </View>
  );
}
