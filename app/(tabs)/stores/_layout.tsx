import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function StoresLayout() {
  const { tokens } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: tokens.bg.surface },
        headerTintColor: tokens.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: tokens.bg.page },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="new"
        options={{
          title: 'New store',
          presentation: 'formSheet',
          sheetAllowedDetents: 'large',
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Store',
          headerBackVisible: false,
          headerLeft: () => <BackChip />,
        }}
      />
    </Stack>
  );
}

function BackChip() {
  const { tokens } = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityLabel="Back"
      hitSlop={8}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: tokens.border.subtle,
      })}
    >
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 22,
          fontWeight: '500',
          lineHeight: 22,
          marginTop: -2,
          marginLeft: -2,
        }}
      >
        ‹
      </Text>
    </Pressable>
  );
}
