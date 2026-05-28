import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function SelectionActionBar({
  count,
  onCancel,
  onDelete,
  busy,
}: {
  count: number;
  onCancel: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
      }}
    >
      <Pressable
        onPress={onCancel}
        hitSlop={8}
        accessibilityLabel="Cancel selection"
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
      <Text
        style={{
          flex: 1,
          color: tokens.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.2,
        }}
      >
        {count} selected
      </Text>
      <Pressable
        onPress={onDelete}
        disabled={busy || count === 0}
        accessibilityLabel="Delete selected"
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 999,
          backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
          opacity: busy ? 0.6 : 1,
        })}
      >
        <MaterialIcons name="delete" color={tokens.danger[0]} size={18} />
        <Text style={{ color: tokens.danger[0], fontSize: 14, fontWeight: '700' }}>
          Delete
        </Text>
      </Pressable>
    </View>
  );
}
