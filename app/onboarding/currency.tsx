import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CurrencyOnboarding() {
  const { tokens } = useTheme();
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        <View style={{ marginTop: 60 }}>
          <Text style={{ color: tokens.text.primary, fontSize: 28, fontWeight: '700' }}>
            Welcome to TripCart
          </Text>
          <Text style={{ color: tokens.text.secondary, marginTop: 12, fontSize: 16 }}>
            Pick your default currency to get started.
          </Text>
        </View>
        <View>
          <Pressable
            onPress={() => router.push('/onboarding/theme-mode')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
            })}
          >
            <Text style={{ color: tokens.text.onAccent, fontWeight: '600', fontSize: 15 }}>
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
