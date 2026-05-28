import { Text, View } from 'react-native';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function KpiCard({
  label,
  value,
  caption,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  caption?: string;
  tone?: 'neutral' | 'positive' | 'negative';
}) {
  const { tokens } = useTheme();
  const captionColor = toneColor(tone, tokens);
  return (
    <View
      style={{
        backgroundColor: tokens.bg.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: tokens.border.subtle,
        padding: 16,
        flex: 1,
        gap: 6,
      }}
    >
      <Text
        style={{
          color: tokens.text.tertiary,
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: tokens.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.3,
        }}
      >
        {value}
      </Text>
      {caption ? (
        <Text
          style={{
            color: captionColor,
            fontSize: 12,
            fontWeight: '600',
          }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

function toneColor(tone: 'neutral' | 'positive' | 'negative', tokens: Theme): string {
  if (tone === 'positive') return tokens.success[0];
  if (tone === 'negative') return tokens.danger[0];
  return tokens.text.tertiary;
}
