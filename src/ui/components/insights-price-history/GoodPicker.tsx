import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Good } from '@/domain/entities';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function GoodPicker({
  query,
  onQueryChange,
  candidates,
  onPick,
}: {
  query: string;
  onQueryChange: (next: string) => void;
  candidates: { good: Good; pointCount: number }[];
  onPick: (good: Good) => void;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 12,
        gap: 10,
      }}
    >
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
          onChangeText={onQueryChange}
          placeholder="Search a good to chart"
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
          <Pressable onPress={() => onQueryChange('')} hitSlop={6}>
            <MaterialIcons name="close" color={tokens.text.tertiary} size={18} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ height: candidates.length > 0 ? 240 : 60 }}>
        {candidates.length === 0 ? (
          <Text
            style={{
              color: tokens.text.tertiary,
              fontSize: 12,
              textAlign: 'center',
              paddingTop: 20,
            }}
          >
            {query
              ? `No goods match "${query}" with price history`
              : 'Start typing or pick from your priced goods.'}
          </Text>
        ) : (
          <FlashList
            data={candidates}
            keyExtractor={(c) => String(c.good.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onPick(item.good)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
                })}
              >
                <Text
                  style={{
                    color: tokens.text.primary,
                    fontSize: 14,
                    fontWeight: '500',
                  }}
                  numberOfLines={1}
                >
                  {item.good.name}
                </Text>
                <Text
                  style={{
                    color: tokens.text.tertiary,
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                  }}
                >
                  {item.pointCount} {item.pointCount === 1 ? 'point' : 'points'}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
}
