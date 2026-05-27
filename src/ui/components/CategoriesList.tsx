import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Category } from '@/domain/entities';
import { useCategories, useCategoryItemCounts } from '@/ui/hooks/useCategories';
import { ArchivedToggle } from '@/ui/components/ArchivedToggle';
import { FAB, useFabBottomReserve } from '@/ui/components/FAB';
import { ListCard } from '@/ui/components/ListCard';
import { ListEmptyState } from '@/ui/components/ListEmptyState';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function CategoriesList() {
  const { tokens } = useTheme();
  const router = useRouter();
  const fabReserve = useFabBottomReserve();
  const [showArchived, setShowArchived] = useState(false);

  const { data: categories = [], isLoading } = useCategories({ archived: showArchived });
  const { data: counts } = useCategoryItemCounts();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: tokens.bg.surface,
          borderBottomWidth: 1,
          borderBottomColor: tokens.border.subtle,
        }}
      >
        <ArchivedToggle value={showArchived} onChange={setShowArchived} />
      </View>

      <FlashList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CategoryRow
            category={item}
            count={counts?.get(item.id) ?? 0}
            tokens={tokens}
            onPress={() => router.push(`/catalog/categories/${item.id}` as never)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <ListEmptyState
              icon="category"
              title="No categories yet"
              subtitle="Add a category to organize your goods."
            />
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: fabReserve,
        }}
      />

      <FAB
        onPress={() => router.push('/catalog/categories/new' as never)}
        accessibilityLabel="Add category"
      />
    </View>
  );
}

function CategoryRow({
  category,
  count,
  tokens,
  onPress,
}: {
  category: Category;
  count: number;
  tokens: Theme;
  onPress: () => void;
}) {
  const color = category.color_hex ?? tokens.accent.base;
  const iconName = (category.icon_name ?? 'category').replace(
    /_/g,
    '-',
  ) as keyof typeof MaterialIcons.glyphMap;
  return (
    <ListCard
      onPress={onPress}
      archived={category.is_archived}
      title={category.name}
      subtitle={`${count} ${count === 1 ? 'item' : 'items'}`}
      leading={
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name={iconName} color="white" size={22} />
        </View>
      }
    />
  );
}
