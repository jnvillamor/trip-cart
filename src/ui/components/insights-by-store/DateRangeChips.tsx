import { Pressable, ScrollView, Text } from 'react-native';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type RangePreset = 'month' | '3m' | 'year' | 'all';

const PRESETS: { value: RangePreset; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: '3m', label: '3 months' },
  { value: 'year', label: 'Year' },
  { value: 'all', label: 'All time' },
];

export function DateRangeChips({
  value,
  onChange,
}: {
  value: RangePreset;
  onChange: (next: RangePreset) => void;
}) {
  const { tokens } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {PRESETS.map((p) => {
        const active = p.value === value;
        return (
          <Pressable
            key={p.value}
            onPress={() => onChange(p.value)}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: active
                ? tokens.accent.base
                : pressed
                  ? tokens.bg.elevated
                  : tokens.bg.surface,
              borderWidth: 1,
              borderColor: active ? tokens.accent.base : tokens.border.subtle,
            })}
          >
            <Text
              style={{
                color: active ? tokens.text.onAccent : tokens.text.secondary,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              {p.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
