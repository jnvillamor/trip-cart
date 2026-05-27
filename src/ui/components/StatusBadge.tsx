import { Text, View } from 'react-native';
import { TripStatus } from '@/domain/schemas';
import { tripStatusVisuals } from '@/ui/lib/trip-status';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function StatusBadge({ status }: { status: TripStatus }) {
  const { tokens } = useTheme();
  const { color, label } = tripStatusVisuals(status, tokens);
  return (
    <View
      style={{
        backgroundColor: tokens.bg.tonal,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
      <Text style={{ color, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}
