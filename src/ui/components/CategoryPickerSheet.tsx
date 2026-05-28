import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category } from '@/domain/entities';
import { useCategories } from '@/ui/hooks/useCategories';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function CategoryPickerSheet({
  visible,
  value,
  includeNone = true,
  noneLabel = 'No category',
  onPick,
  onClose,
}: {
  visible: boolean;
  value: number | null;
  includeNone?: boolean;
  noneLabel?: string;
  onPick: (id: number | null) => void;
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 120);
  const { data: categories = [] } = useCategories();

  const filtered = useMemo<Category[]>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, debouncedQuery]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => setQuery('')}
    >
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: tokens.overlay }} />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '80%',
          backgroundColor: tokens.bg.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: tokens.border.default,
            marginBottom: 8,
          }}
        />
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 18,
              fontWeight: '700',
              letterSpacing: -0.2,
              marginBottom: 10,
            }}
          >
            Pick a category
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: tokens.bg.tonal,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <MaterialIcons name="search" color={tokens.text.tertiary} size={18} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search category"
              placeholderTextColor={tokens.text.tertiary}
              autoCorrect={false}
              style={{
                flex: 1,
                color: tokens.text.primary,
                fontSize: 15,
                paddingVertical: 0,
              }}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={6}>
                <MaterialIcons name="close" color={tokens.text.tertiary} size={18} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginTop: 4,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: tokens.border.subtle,
            backgroundColor: tokens.bg.page,
            overflow: 'hidden',
          }}
        >
          <FlashList
            data={filtered}
            keyExtractor={(c) => String(c.id)}
            ListHeaderComponent={
              includeNone && debouncedQuery.trim().length === 0 ? (
                <NoneRow
                  label={noneLabel}
                  active={value === null}
                  onPress={() => {
                    onPick(null);
                    onClose();
                  }}
                />
              ) : null
            }
            renderItem={({ item, index }) => (
              <CategoryRow
                category={item}
                active={value === item.id}
                isLast={index === filtered.length - 1}
                onPress={() => {
                  onPick(item.id);
                  onClose();
                }}
              />
            )}
            ListEmptyComponent={
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: tokens.text.tertiary, fontSize: 13 }}>
                  No category matches &ldquo;{debouncedQuery}&rdquo;
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

function NoneRow({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
        backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="block" color={tokens.text.tertiary} size={18} />
      </View>
      <Text
        style={{
          flex: 1,
          color: tokens.text.primary,
          fontSize: 15,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
      {active ? (
        <MaterialIcons name="check" color={tokens.accent.base} size={22} />
      ) : null}
    </Pressable>
  );
}

function CategoryRow({
  category,
  active,
  isLast,
  onPress,
}: {
  category: Category;
  active: boolean;
  isLast: boolean;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  const tile = category.color_hex ?? tokens.bg.tonal;
  const iconName = ((category.icon_name ?? 'category').replace(
    /_/g,
    '-',
  )) as keyof typeof MaterialIcons.glyphMap;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.border.subtle,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: tile,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={iconName} color="white" size={18} />
      </View>
      <Text
        style={{
          flex: 1,
          color: tokens.text.primary,
          fontSize: 15,
          fontWeight: '600',
        }}
      >
        {category.name}
      </Text>
      {active ? (
        <MaterialIcons name="check" color={tokens.accent.base} size={22} />
      ) : null}
    </Pressable>
  );
}
