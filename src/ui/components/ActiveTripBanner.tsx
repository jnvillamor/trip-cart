import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useActiveTrip } from '@/ui/hooks/useActiveTrip';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function ActiveTripBanner() {
  const { tokens } = useTheme();
  const router = useRouter();
  const { data: activeTrip } = useActiveTrip();

  if (!activeTrip) return null;

  return (
    <Pressable
      onPress={() => router.push(`/shopping/${activeTrip.id}` as never)}
      style={({ pressed }) => ({
        backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      })}
    >
      <MaterialIcons name="shopping-cart" color={tokens.text.onAccent} size={20} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 13 }}>
          Shopping in progress
        </Text>
        <Text
          style={{ color: tokens.text.onAccent, fontSize: 12, opacity: 0.85, marginTop: 2 }}
          numberOfLines={1}
        >
          {activeTrip.name}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" color={tokens.text.onAccent} size={20} />
    </Pressable>
  );
}
