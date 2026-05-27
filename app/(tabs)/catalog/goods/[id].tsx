import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { GoodForm } from '@/ui/components/GoodForm';
import { PageHeader } from '@/ui/components/PageHeader';
import {
  useArchiveGood,
  useGood,
  useRestoreGood,
  useUpdateGood,
} from '@/ui/hooks/useGoods';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function GoodEditScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);

  const { data: good, isLoading } = useGood(id);
  const updateGood = useUpdateGood(id);
  const archive = useArchiveGood(id);
  const restore = useRestoreGood(id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Good" />
      </View>
    );
  }

  if (!good) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Good" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: tokens.text.primary }}>Good not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Edit good" subtitle={good.name} />
      <GoodForm
        submitLabel="Save changes"
        busy={updateGood.isPending}
        initialValues={{
          name: good.name,
          default_category_id: good.default_category_id ?? null,
          default_unit: good.default_unit ?? '',
          notes: good.notes ?? '',
        }}
        onSubmit={async (input) => {
          await updateGood.mutateAsync(input);
          router.back();
        }}
        footer={
          <Pressable
            onPress={async () => {
              if (good.is_archived) {
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
                color: good.is_archived ? tokens.text.primary : tokens.danger[0],
                fontWeight: '600',
                fontSize: 15,
              }}
            >
              {good.is_archived ? 'Unarchive good' : 'Archive good'}
            </Text>
          </Pressable>
        }
      />
    </View>
  );
}
