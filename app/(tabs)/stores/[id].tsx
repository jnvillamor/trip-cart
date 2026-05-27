import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { StoreForm } from '@/ui/components/StoreForm';
import {
  useArchiveStore,
  useRestoreStore,
  useStore,
  useUpdateStore,
} from '@/ui/hooks/useStores';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function StoreEditScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);

  const { data: store, isLoading } = useStore(id);
  const updateStore = useUpdateStore(id);
  const archive = useArchiveStore(id);
  const restore = useRestoreStore(id);

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  if (!store) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg.page,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: tokens.text.primary }}>Store not found</Text>
      </View>
    );
  }

  return (
    <StoreForm
      submitLabel="Save changes"
      busy={updateStore.isPending}
      initialValues={{
        name: store.name,
        currency_code_override: store.currency_code_override ?? '',
        notes: store.notes ?? '',
      }}
      onSubmit={async (input) => {
        await updateStore.mutateAsync(input);
        router.back();
      }}
      footer={
        <Pressable
          onPress={async () => {
            if (store.is_archived) {
              await restore.mutateAsync();
            } else {
              await archive.mutateAsync();
            }
            router.back();
          }}
          disabled={archive.isPending || restore.isPending}
          style={({ pressed }) => ({
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: tokens.border.default,
            backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
            marginTop: 8,
          })}
        >
          <Text
            style={{
              color: store.is_archived ? tokens.text.primary : tokens.danger[0],
              fontWeight: '600',
              fontSize: 15,
            }}
          >
            {store.is_archived ? 'Unarchive store' : 'Archive store'}
          </Text>
        </Pressable>
      }
    />
  );
}
