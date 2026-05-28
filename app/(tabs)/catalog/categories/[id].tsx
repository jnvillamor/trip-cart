import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { ArchiveFooterButton } from '@/ui/components/ArchiveFooterButton';
import { CategoryForm } from '@/ui/components/CategoryForm';
import { PageHeader } from '@/ui/components/PageHeader';
import { useCategoryEditController } from '@/ui/hooks/category-edit/useCategoryEditController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CategoryEditScreen() {
  const { tokens } = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const ctrl = useCategoryEditController(id);

  if (ctrl.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Category" />
      </View>
    );
  }

  if (ctrl.notFound) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Category" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: tokens.text.primary }}>Category not found</Text>
        </View>
      </View>
    );
  }

  const { category } = ctrl;
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Edit category" subtitle={category.name} />
      <CategoryForm
        submitLabel="Save changes"
        busy={ctrl.saving}
        initialValues={{
          name: category.name,
          icon_name: category.icon_name ?? '',
          color_hex: category.color_hex ?? '',
        }}
        onSubmit={ctrl.save}
        footer={
          <ArchiveFooterButton
            isArchived={category.is_archived}
            entityLabel="category"
            busy={ctrl.archiveBusy}
            onPress={ctrl.toggleArchive}
          />
        }
      />
    </View>
  );
}
