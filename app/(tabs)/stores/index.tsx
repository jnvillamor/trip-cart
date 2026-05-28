import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArchivedToggle } from '@/ui/components/ArchivedToggle';
import { FAB, useFabBottomReserve } from '@/ui/components/FAB';
import { ListEmptyState } from '@/ui/components/ListEmptyState';
import { StoreRow } from '@/ui/components/stores-list/StoreRow';
import { useStoresListController } from '@/ui/hooks/stores-list/useStoresListController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function StoresListScreen() {
  const { tokens } = useTheme();
  const fabReserve = useFabBottomReserve();
  const ctrl = useStoresListController();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <SafeAreaView edges={['top']}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 34,
              fontWeight: '700',
              letterSpacing: -0.5,
            }}
          >
            Stores
          </Text>
          <View style={{ marginTop: 16 }}>
            <ArchivedToggle value={ctrl.showArchived} onChange={ctrl.setShowArchived} />
          </View>
        </View>
      </SafeAreaView>

      <FlashList
        data={ctrl.stores}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StoreRow store={item} onPress={() => ctrl.openStore(item.id)} />
        )}
        ListEmptyComponent={
          !ctrl.isLoading ? (
            <ListEmptyState
              icon="storefront"
              title="No stores yet"
              subtitle="Add your first store to start planning trips."
            />
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: fabReserve,
        }}
      />

      <FAB onPress={ctrl.openNewStore} accessibilityLabel="Add store" />
    </View>
  );
}
