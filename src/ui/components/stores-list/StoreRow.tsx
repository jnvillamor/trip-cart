import { Text, View } from 'react-native';
import { Store } from '@/domain/entities';
import { ListCard } from '@/ui/components/ListCard';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function StoreRow({
  store,
  onPress,
}: {
  store: Store;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
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
