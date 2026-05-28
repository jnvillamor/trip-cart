import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function CreateGoodRow({
  query,
  suggestedCategory,
  busy,
  onPress,
}: {
  query: string;
  suggestedCategory?: { name: string; color_hex: string | null };
  busy: boolean;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        marginVertical: 4,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: tokens.accent.base,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.surface,
        opacity: busy ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: tokens.accent.base,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="add" color={tokens.text.onAccent} size={22} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: tokens.text.primary, fontSize: 15, fontWeight: '600' }}
          numberOfLines={1}
        >
          Create &ldquo;{query}&rdquo;
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          {suggestedCategory ? (
            <>
              {suggestedCategory.color_hex ? (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: suggestedCategory.color_hex,
                  }}
                />
              ) : null}
              <Text style={{ color: tokens.text.tertiary, fontSize: 12 }} numberOfLines={1}>
                Add to {suggestedCategory.name}
              </Text>
            </>
          ) : (
            <Text style={{ color: tokens.text.tertiary, fontSize: 12 }} numberOfLines={1}>
              Add new good
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
