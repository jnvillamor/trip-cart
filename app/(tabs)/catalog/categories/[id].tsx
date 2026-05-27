import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { CategoryForm } from '@/ui/components/CategoryForm';
import { PageHeader } from '@/ui/components/PageHeader';
import {
  useArchiveCategory,
  useCategory,
  useRestoreCategory,
  useUpdateCategory,
} from '@/ui/hooks/useCategories';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CategoryEditScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);

  const { data: category, isLoading } = useCategory(id);
  const updateCategory = useUpdateCategory(id);
  const archive = useArchiveCategory(id);
  const restore = useRestoreCategory(id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Category" />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Category" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: tokens.text.primary }}>Category not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Edit category" subtitle={category.name} />
      <CategoryForm
        submitLabel="Save changes"
        busy={updateCategory.isPending}
        initialValues={{
          name: category.name,
          icon_name: category.icon_name ?? '',
          color_hex: category.color_hex ?? '',
        }}
        onSubmit={async (input) => {
          await updateCategory.mutateAsync(input);
          router.back();
        }}
        footer={
          <Pressable
            onPress={async () => {
              if (category.is_archived) {
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
                color: category.is_archived ? tokens.text.primary : tokens.danger[0],
                fontWeight: '600',
                fontSize: 15,
              }}
            >
              {category.is_archived ? 'Unarchive category' : 'Archive category'}
            </Text>
          </Pressable>
        }
      />
    </View>
  );
}
