import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { CurrencyMeta } from '@/domain/currency';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function CurrencyRow({
  currency,
  active,
  isLast,
  onPress,
}: {
  currency: CurrencyMeta;
  active: boolean;
  isLast: boolean;
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
        backgroundColor: pressed ? tokens.bg.elevated : 'transparent',
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: tokens.border.subtle,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: active ? tokens.accent.base : tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: active ? tokens.text.onAccent : tokens.text.primary,
            fontSize: 14,
            fontWeight: '700',
          }}
        >
          {currency.symbol.slice(0, 3)}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '600' }}>
          {currency.code}
        </Text>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 12,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {currency.name}
        </Text>
      </View>
      {active ? (
        <MaterialIcons name="check" color={tokens.accent.base} size={22} />
      ) : null}
    </Pressable>
  );
}
