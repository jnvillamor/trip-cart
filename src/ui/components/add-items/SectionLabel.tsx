import { Text } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function SectionLabel({ label }: { label: string }) {
  const { tokens } = useTheme();
  return (
    <Text
      style={{
        color: tokens.text.tertiary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginTop: 16,
        marginBottom: 4,
      }}
    >
      {label}
    </Text>
  );
}
