import { Trip } from '@/domain/entities';
import { ListCard } from '@/ui/components/ListCard';
import { StatusBadge } from '@/ui/components/StatusBadge';
import { formatTripShortDate } from '@/ui/lib/format';

export function TripRow({
  trip,
  storeName,
  onPress,
}: {
  trip: Trip;
  storeName: string | undefined;
  onPress: () => void;
}) {
  const dateLabel = formatTripShortDate(trip);
  const subtitleBits = [storeName, dateLabel].filter(Boolean) as string[];
  return (
    <ListCard
      onPress={onPress}
      archived={trip.archived_at !== null}
      title={trip.name || 'Trip'}
      subtitle={subtitleBits.join(' · ') || undefined}
      leading={<StatusBadge status={trip.status} />}
    />
  );
}
