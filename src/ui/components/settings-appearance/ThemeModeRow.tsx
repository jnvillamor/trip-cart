import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ThemeModeRow({
  icon,
  label,
  description,
  active,
  isLast,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description: string;
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
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: active ? tokens.accent.base : tokens.bg.tonal,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons
          name={icon}
          color={active ? tokens.text.onAccent : tokens.accent.base}
          size={20}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: tokens.text.primary,
            fontSize: 15,
            fontWeight: '600',
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: tokens.text.tertiary,
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {description}
        </Text>
      </View>
      {active ? (
        <MaterialIcons name="check" color={tokens.accent.base} size={22} />
      ) : null}
    </Pressable>
  );
}
