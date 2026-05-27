import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type PrimaryAction = {
  label: string;
  onPress: () => void;
  disabled: boolean;
};

export function BottomActionBar({
  primary,
  moreCount,
  onMore,
}: {
  primary: PrimaryAction;
  moreCount: number;
  onMore: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        padding: 12,
        backgroundColor: tokens.bg.surface,
        borderTopWidth: 1,
        borderTopColor: tokens.border.subtle,
      }}
    >
      <Pressable
        onPress={primary.onPress}
        disabled={primary.disabled}
        style={({ pressed }) => ({
          flex: 1,
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: 'center',
          backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
          opacity: primary.disabled ? 0.5 : 1,
        })}
      >
        <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
          {primary.label}
        </Text>
      </Pressable>
      {moreCount > 0 ? (
        <Pressable
          onPress={onMore}
          accessibilityLabel="More actions"
          style={({ pressed }) => ({
            width: 50,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
            borderWidth: 1,
            borderColor: tokens.border.subtle,
          })}
        >
          <MaterialIcons name="more-horiz" color={tokens.text.primary} size={22} />
        </Pressable>
      ) : null}
    </View>
  );
}
