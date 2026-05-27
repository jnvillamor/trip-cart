import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { initDatabase } from '@/db/client';
import { Store } from '@/domain/entities';
import { createStoreRepo } from '@/domain/repositories/store.repo';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function StoresListScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const [showArchived, setShowArchived] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['stores', { archived: showArchived }],
    queryFn: async () => {
      const db = await initDatabase();
      const repo = createStoreRepo(db);
      return repo.list({ includeArchived: showArchived });
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: tokens.bg.surface,
          borderBottomWidth: 1,
          borderBottomColor: tokens.border.subtle,
        }}
      >
        <Text style={{ color: tokens.text.secondary, fontSize: 13 }}>Show archived</Text>
        <Switch
          value={showArchived}
          onValueChange={setShowArchived}
          trackColor={{ false: tokens.border.default, true: tokens.accent.base }}
          thumbColor={tokens.bg.page}
        />
      </View>

      <FlashList
        data={stores}
        keyExtractor={(item) => String(item.id)}
        estimatedItemSize={64}
        renderItem={({ item }) => (
          <StoreRow
            store={item}
            tokens={tokens}
            onPress={() => router.push(`/stores/${item.id}` as never)}
          />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: tokens.border.subtle, marginLeft: 16 }}
          />
        )}
        ListEmptyComponent={!isLoading ? <EmptyState tokens={tokens} /> : null}
        contentContainerStyle={
          stores.length === 0 ? undefined : { backgroundColor: tokens.bg.surface }
        }
      />

      <FAB onPress={() => router.push('/stores/new' as never)} tokens={tokens} />
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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
      })}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '500' }}>
          {store.name}
        </Text>
        {store.notes ? (
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}
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
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: tokens.text.secondary, fontSize: 11, fontWeight: '600' }}>
            {store.currency_code_override}
          </Text>
        </View>
      ) : null}
      {store.is_archived ? (
        <MaterialIcons name="archive" color={tokens.text.tertiary} size={16} />
      ) : null}
      <MaterialIcons name="chevron-right" color={tokens.text.tertiary} size={20} />
    </Pressable>
  );
}

function EmptyState({ tokens }: { tokens: Theme }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        minHeight: 320,
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
        <MaterialIcons name="storefront" color={tokens.text.tertiary} size={36} />
      </View>
      <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '600' }}>
        No stores yet
      </Text>
      <Text
        style={{
          color: tokens.text.tertiary,
          marginTop: 6,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Add a store to start planning trips.
      </Text>
    </View>
  );
}

function FAB({ onPress, tokens }: { onPress: () => void; tokens: Theme }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Add store"
      style={({ pressed }) => ({
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      })}
    >
      <MaterialIcons name="add" color={tokens.text.onAccent} size={28} />
    </Pressable>
  );
}
