import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Store } from '@/domain/entities';
import { FAB, useFabBottomReserve } from '@/ui/components/FAB';
import { ListCard } from '@/ui/components/ListCard';
import { ListEmptyState } from '@/ui/components/ListEmptyState';
import { useStores } from '@/ui/hooks/useStores';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function StoresListScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const fabReserve = useFabBottomReserve();
  const [showArchived, setShowArchived] = useState(false);

  const { data: stores = [], isLoading } = useStores({ archived: showArchived });

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <Text style={{ color: tokens.text.secondary, fontSize: 14 }}>Show archived</Text>
            <Switch
              value={showArchived}
              onValueChange={setShowArchived}
              trackColor={{ false: tokens.border.default, true: tokens.accent.base }}
              thumbColor={tokens.bg.page}
            />
          </View>
        </View>
      </SafeAreaView>

      <FlashList
        data={stores}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StoreRow
            store={item}
            tokens={tokens}
            onPress={() => router.push(`/stores/${item.id}` as never)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
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

      <FAB
        onPress={() => router.push('/stores/new' as never)}
        accessibilityLabel="Add store"
      />
    </View>
  );
}

function StoreRow({
  store,
  tokens,
  onPress,
}: {
  store: Store;
  tokens: Theme;
  onPress: () => void;
}) {
  const initial = store.name.charAt(0).toUpperCase();
  return (
    <ListCard
      onPress={onPress}
      archived={store.is_archived}
      title={store.name}
      subtitle={store.notes ?? undefined}
      leading={
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: tokens.bg.tonal,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: tokens.accent.base, fontSize: 18, fontWeight: '700' }}>
            {initial}
          </Text>
        </View>
      }
      trailing={
        store.currency_code_override ? (
          <View
            style={{
              backgroundColor: tokens.bg.tonal,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: tokens.text.secondary, fontSize: 11, fontWeight: '700' }}>
              {store.currency_code_override}
            </Text>
          </View>
        ) : null
      }
    />
  );
}
