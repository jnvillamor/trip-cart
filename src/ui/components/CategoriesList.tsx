import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category } from '@/domain/entities';
import { useCategories, useCategoryItemCounts } from '@/ui/hooks/useCategories';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 56;

export function CategoriesList() {
  const { tokens } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showArchived, setShowArchived] = useState(false);

  const { data: categories = [], isLoading } = useCategories({ archived: showArchived });
  const { data: counts } = useCategoryItemCounts();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: tokens.bg.surface,
          borderBottomWidth: 1,
          borderBottomColor: tokens.border.subtle,
        }}
      >
        <Text style={{ color: tokens.text.secondary, fontSize: 14 }}>Show archived</Text>
        <Switch
          value={showArchived}
          onValueChange={setShowArchived}
          trackColor={{ false: tokens.border.default, true: tokens.accent.base }}
          thumbColor={tokens.bg.page}
        />
      </View>

      <FlashList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            count={counts?.get(item.id) ?? 0}
            tokens={tokens}
            onPress={() => router.push(`/catalog/categories/${item.id}` as never)}
          />
        )}
        ListEmptyComponent={!isLoading ? <EmptyState tokens={tokens} /> : null}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 96,
        }}
      />

      <FAB
        onPress={() => router.push('/catalog/categories/new' as never)}
        tokens={tokens}
        bottomOffset={insets.bottom + TAB_BAR_HEIGHT + 16}
      />
    </View>
  );
}

function CategoryCard({
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        marginVertical: 6,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
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
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text
            style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '600' }}
            numberOfLines={1}
          >
            {category.name}
          </Text>
          {category.is_archived ? (
            <MaterialIcons name="archive" color={tokens.text.tertiary} size={14} />
          ) : null}
        </View>
        <Text style={{ color: tokens.text.tertiary, fontSize: 13, marginTop: 2 }}>
          {count} {count === 1 ? 'item' : 'items'}
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyState({ tokens }: { tokens: Theme }) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <MaterialIcons name="category" color={tokens.text.tertiary} size={44} />
      </View>
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 18,
          fontWeight: '700',
          letterSpacing: -0.2,
        }}
      >
        No categories yet
      </Text>
      <Text
        style={{
          color: tokens.text.tertiary,
          marginTop: 8,
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        Add a category to organize your goods.
      </Text>
    </View>
  );
}

function FAB({
  onPress,
  tokens,
  bottomOffset,
}: {
  onPress: () => void;
  tokens: Theme;
  bottomOffset: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Add category"
      style={({ pressed }) => ({
        position: 'absolute',
        right: 20,
        bottom: bottomOffset,
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: tokens.accent.base,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      })}
    >
      <Text
        style={{
          color: tokens.text.onAccent,
          fontSize: 30,
          fontWeight: '400',
          lineHeight: 32,
          marginTop: -2,
        }}
      >
        +
      </Text>
    </Pressable>
  );
}
