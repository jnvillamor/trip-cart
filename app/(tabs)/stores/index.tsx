import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Store } from '@/domain/entities';
import { useStores } from '@/ui/hooks/useStores';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 56;

export default function StoresListScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
        estimatedItemSize={92}
        renderItem={({ item }) => (
          <StoreCard
            store={item}
            tokens={tokens}
            onPress={() => router.push(`/stores/${item.id}` as never)}
          />
        )}
        ListEmptyComponent={!isLoading ? <EmptyState tokens={tokens} /> : null}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 96,
        }}
      />

      <FAB
        onPress={() => router.push('/stores/new' as never)}
        tokens={tokens}
        bottomOffset={insets.bottom + TAB_BAR_HEIGHT + 16}
      />
    </View>
  );
}

function StoreCard({
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        marginVertical: 6,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
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
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '600' }}
            numberOfLines={1}
          >
            {store.name}
          </Text>
          {store.is_archived ? (
            <MaterialIcons name="archive" color={tokens.text.tertiary} size={14} />
          ) : null}
        </View>
        {store.notes ? (
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 13, marginTop: 2 }}
            numberOfLines={1}
          >
            {store.notes}
          </Text>
        ) : null}
      </View>
      {store.currency_code_override ? (
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
      ) : null}
    </Pressable>
  );
}

function EmptyState({ tokens }: { tokens: Theme }) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <MaterialIcons name="storefront" color={tokens.text.tertiary} size={44} />
      </View>
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 18,
          fontWeight: '700',
          letterSpacing: -0.2,
        }}
      >
        No stores yet
      </Text>
      <Text
        style={{
          color: tokens.text.tertiary,
          marginTop: 8,
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        Add your first store to start planning trips.
      </Text>
    </View>
  );
}

function FAB({
  onPress,
  tokens,
  bottomOffset,
}: {
  onPress: () => void;
  tokens: Theme;
  bottomOffset: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Add store"
      style={({ pressed }) => ({
        position: 'absolute',
        right: 20,
        bottom: bottomOffset,
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: tokens.accent.base,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      })}
    >
      <Text
        style={{
          color: tokens.text.onAccent,
          fontSize: 30,
          fontWeight: '400',
          lineHeight: 32,
          marginTop: -2,
        }}
      >
        +
      </Text>
    </Pressable>
  );
}
