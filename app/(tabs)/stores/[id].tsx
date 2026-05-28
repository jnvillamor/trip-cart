import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { ArchiveFooterButton } from '@/ui/components/ArchiveFooterButton';
import { PageHeader } from '@/ui/components/PageHeader';
import { StoreForm } from '@/ui/components/StoreForm';
import { useStoreEditController } from '@/ui/hooks/store-edit/useStoreEditController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function StoreEditScreen() {
  const { tokens } = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const ctrl = useStoreEditController(id);

  if (ctrl.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Store" />
      </View>
    );
  }

  if (ctrl.notFound) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Store" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: tokens.text.primary }}>Store not found</Text>
        </View>
      </View>
    );
  }

  const { store } = ctrl;
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Edit store" subtitle={store.name} />
      <StoreForm
        submitLabel="Save changes"
        busy={ctrl.saving}
        initialValues={{
          name: store.name,
          currency_code_override: store.currency_code_override ?? '',
          notes: store.notes ?? '',
        }}
        onSubmit={ctrl.save}
        footer={
          <ArchiveFooterButton
            isArchived={store.is_archived}
            entityLabel="store"
            busy={ctrl.archiveBusy}
            onPress={ctrl.toggleArchive}
          />
        }
      />
    </View>
  );
}
