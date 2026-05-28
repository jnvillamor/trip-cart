import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { CreateGoodRow } from '@/ui/components/add-items/CreateGoodRow';
import { EmptyResults } from '@/ui/components/add-items/EmptyResults';
import { GoodAddRow } from '@/ui/components/add-items/GoodAddRow';
import { SearchInput } from '@/ui/components/add-items/SearchInput';
import { SectionLabel } from '@/ui/components/add-items/SectionLabel';
import { PageHeader } from '@/ui/components/PageHeader';
import { useAddItemsController } from '@/ui/hooks/add-items/useAddItemsController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function AddItemsScreen() {
  const { tokens } = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const tripId = Number(idParam);
  const ctrl = useAddItemsController(tripId);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <PageHeader title="Add items" />

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <SearchInput value={ctrl.query} onChange={ctrl.setQuery} />
      </View>

      {ctrl.createSuggestion ? (
        <View style={{ paddingHorizontal: 16 }}>
          <CreateGoodRow
            query={ctrl.createSuggestion.query}
            suggestedCategory={ctrl.createSuggestion.suggestedCategory}
            busy={ctrl.creating}
            onPress={() =>
              ctrl.createAndAdd(
                ctrl.createSuggestion!.query,
                ctrl.createSuggestion!.suggestedCategory?.id,
              )
            }
          />
        </View>
      ) : null}

      <FlashList
        data={ctrl.rows}
        keyExtractor={(row) => row.key}
        getItemType={(row) => row.kind}
        renderItem={({ item }) => {
          if (item.kind === 'section') {
            return <SectionLabel label={item.label} />;
          }
          return (
            <GoodAddRow
              good={item.good}
              category={ctrl.categoryFor(item.good)}
              added={ctrl.isAdded(item.good.id)}
              onToggle={() => ctrl.toggle(item.good)}
            />
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          !ctrl.isLoading && !ctrl.createSuggestion ? (
            <EmptyResults query={ctrl.debouncedQuery} />
          ) : null
        }
      />
    </View>
  );
}
