import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSetOnboarded } from '@/ui/hooks/useOnboarded';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function ThemeModeOnboarding() {
  const { tokens } = useTheme();
  const router = useRouter();
  const setOnboarded = useSetOnboarded();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        <View style={{ marginTop: 60 }}>
          <Text style={{ color: tokens.text.primary, fontSize: 28, fontWeight: '700' }}>
            Choose a theme
          </Text>
          <Text style={{ color: tokens.text.secondary, marginTop: 12, fontSize: 16 }}>
            Light, dark, or system — change anytime in Settings.
          </Text>
        </View>
        <View>
          <Pressable
            disabled={setOnboarded.isPending}
            onPress={async () => {
              await setOnboarded.mutateAsync(true);
              router.replace('/');
            }}
            style={({ pressed }) => ({
              backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              opacity: setOnboarded.isPending ? 0.6 : 1,
            })}
          >
            <Text style={{ color: tokens.text.onAccent, fontWeight: '600', fontSize: 15 }}>
              Get started
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
