import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { ArchiveFooterButton } from '@/ui/components/ArchiveFooterButton';
import { GoodForm } from '@/ui/components/GoodForm';
import { PageHeader } from '@/ui/components/PageHeader';
import { useGoodEditController } from '@/ui/hooks/good-edit/useGoodEditController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function GoodEditScreen() {
  const { tokens } = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const ctrl = useGoodEditController(id);

  if (ctrl.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Good" />
      </View>
    );
  }

  if (ctrl.notFound) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Good" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: tokens.text.primary }}>Good not found</Text>
        </View>
      </View>
    );
  }

  const { good } = ctrl;
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Edit good" subtitle={good.name} />
      <GoodForm
        submitLabel="Save changes"
        busy={ctrl.saving}
        initialValues={{
          name: good.name,
          default_category_id: good.default_category_id ?? null,
          default_unit: good.default_unit ?? '',
          notes: good.notes ?? '',
        }}
        onSubmit={ctrl.save}
        footer={
          <ArchiveFooterButton
            isArchived={good.is_archived}
            entityLabel="good"
            busy={ctrl.archiveBusy}
            onPress={ctrl.toggleArchive}
          />
        }
      />
    </View>
  );
}
