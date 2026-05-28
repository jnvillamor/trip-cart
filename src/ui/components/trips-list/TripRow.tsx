import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { Trip } from '@/domain/entities';
import { ListCard } from '@/ui/components/ListCard';
import { StatusBadge } from '@/ui/components/StatusBadge';
import { formatTripShortDate } from '@/ui/lib/format';
import { useTheme } from '@/ui/theme/ThemeProvider';

export function TripRow({
  trip,
  storeName,
  selectionMode,
  selected,
  onPress,
  onLongPress,
}: {
  trip: Trip;
  storeName: string | undefined;
  selectionMode: boolean;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { tokens } = useTheme();
  const dateLabel = formatTripShortDate(trip);
  const subtitleBits = [storeName, dateLabel].filter(Boolean) as string[];
  return (
    <ListCard
      onPress={onPress}
      onLongPress={onLongPress}
      selected={selected}
      archived={trip.archived_at !== null}
      title={trip.name || 'Trip'}
      subtitle={subtitleBits.join(' · ') || undefined}
      leading={
        selectionMode ? (
          <Pressable
            onPress={onPress}
            hitSlop={6}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 2,
              borderColor: selected ? tokens.accent.base : tokens.border.default,
              backgroundColor: selected ? tokens.accent.base : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selected ? (
              <MaterialIcons name="check" color={tokens.text.onAccent} size={18} />
            ) : null}
          </Pressable>
        ) : (
          <View>
            <StatusBadge status={trip.status} />
          </View>
        )
      }
    />
  );
}
