import { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ActiveTripBanner } from '@/ui/components/ActiveTripBanner';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function HomeScreen() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <ActiveTripBanner />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Section title="Active trip" tokens={tokens}>
          <Text style={{ color: tokens.text.secondary }}>No active trip.</Text>
        </Section>
        <Section title="Recent trips" tokens={tokens}>
          <Text style={{ color: tokens.text.secondary }}>Coming soon.</Text>
        </Section>
        <Section title="This month" tokens={tokens}>
          <Text style={{ color: tokens.text.secondary }}>Coming soon.</Text>
        </Section>
        <Section title="Insights" tokens={tokens}>
          <Text style={{ color: tokens.text.secondary }}>Coming soon.</Text>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
  tokens,
}: {
  title: string;
  children: ReactNode;
  tokens: Theme;
}) {
  return (
    <View>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: tokens.text.tertiary,
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: tokens.bg.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: tokens.border.subtle,
        }}
      >
        {children}
      </View>
    </View>
  );
}
