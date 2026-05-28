import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function AddItemRow({ onPress }: { onPress: () => void }) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Add an item to this trip"
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: tokens.accent.base,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
      })}
    >
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
        <MaterialIcons name="add" color={tokens.text.onAccent} size={20} />
      </View>
      <Text
        style={{
          color: tokens.accent.base,
          fontSize: 15,
          fontWeight: '700',
          letterSpacing: 0.2,
        }}
      >
        Add an item
      </Text>
    </Pressable>
  );
}
