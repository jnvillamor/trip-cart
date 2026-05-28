import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Good } from '@/domain/entities';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function GoodAddRow({
  good,
  category,
  added,
  onToggle,
}: {
  good: Good;
  category?: { name: string; color_hex: string | null; icon_name: string | null };
  added: boolean;
  onToggle: () => void;
}) {
  const { tokens } = useTheme();
  const color = category?.color_hex ?? tokens.bg.tonal;
  const iconName = (category?.icon_name ?? 'inventory-2').replace(
    /_/g,
    '-',
  ) as keyof typeof MaterialIcons.glyphMap;
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        marginVertical: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: added ? tokens.success[0] : tokens.border.subtle,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name={iconName} color="white" size={20} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '600' }}
          numberOfLines={1}
        >
          {good.name}
        </Text>
        {category?.name ? (
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {category.name}
          </Text>
        ) : null}
      </View>
      {added ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: tokens.bg.tonal,
            borderRadius: 999,
          }}
        >
          <MaterialIcons name="check" color={tokens.success[0]} size={14} />
          <Text
            style={{
              color: tokens.success[0],
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            ADDED
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: tokens.accent.base,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: tokens.text.onAccent,
              fontSize: 22,
              fontWeight: '400',
              lineHeight: 24,
              marginTop: -2,
            }}
          >
            +
          </Text>
        </View>
      )}
    </Pressable>
  );
}
