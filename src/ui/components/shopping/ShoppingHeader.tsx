import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ShoppingHeader({
  title,
  subtitle,
  itemsBought,
  itemsTotal,
  onExit,
}: {
  title: string;
  subtitle?: string;
  itemsBought: number;
  itemsTotal: number;
  onExit: () => void;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 6,
        paddingBottom: 14,
        paddingHorizontal: 16,
        backgroundColor: tokens.bg.surface,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border.subtle,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable
          onPress={onExit}
          accessibilityLabel="Exit shopping mode"
          hitSlop={8}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
          })}
        >
          <MaterialIcons name="close" color={tokens.text.primary} size={20} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: tokens.text.primary,
              fontSize: 18,
              fontWeight: '700',
              letterSpacing: -0.2,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={{ color: tokens.text.tertiary, fontSize: 12, marginTop: 2 }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: tokens.bg.tonal,
          }}
        >
          <Text
            style={{
              color: tokens.text.secondary,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {itemsBought}/{itemsTotal}
          </Text>
        </View>
      </View>
    </View>
  );
}
