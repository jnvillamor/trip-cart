import { Pressable, ScrollView, Text } from 'react-native';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { TripStatus } from '@/domain/schemas';
import { useTheme } from '@/ui/theme/ThemeProvider';

export type StatusFilter = 'all' | TripStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: TRIP_STATUS_ENUM.PLANNED, label: 'Planned' },
  { value: TRIP_STATUS_ENUM.IN_PROGRESS, label: 'Shopping' },
  { value: TRIP_STATUS_ENUM.COMPLETED, label: 'Completed' },
  { value: TRIP_STATUS_ENUM.CANCELED, label: 'Canceled' },
];

export function StatusFilterChips({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (next: StatusFilter) => void;
}) {
  const { tokens } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2, marginTop: 16 }}
    >
      {STATUS_FILTERS.map((f) => {
        const active = value === f.value;
        return (
          <Pressable
            key={f.value}
            onPress={() => onChange(f.value)}
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
                fontWeight: '600',
                fontSize: 13,
              }}
            >
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
