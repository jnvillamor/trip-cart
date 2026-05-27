import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { Trip } from '@/domain/entities';
import { TripStatus } from '@/domain/schemas';
import { ActiveTripBanner } from '@/ui/components/ActiveTripBanner';
import { FAB, useFabBottomReserve } from '@/ui/components/FAB';
import { ListCard } from '@/ui/components/ListCard';
import { ListEmptyState } from '@/ui/components/ListEmptyState';
import { useStores } from '@/ui/hooks/useStores';
import { useTrips } from '@/ui/hooks/useTrips';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

type StatusFilter = 'all' | TripStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: TRIP_STATUS_ENUM.PLANNED, label: 'Planned' },
  { value: TRIP_STATUS_ENUM.IN_PROGRESS, label: 'Shopping' },
  { value: TRIP_STATUS_ENUM.COMPLETED, label: 'Completed' },
  { value: TRIP_STATUS_ENUM.CANCELED, label: 'Canceled' },
];

export default function TripsListScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const fabReserve = useFabBottomReserve();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: trips = [], isLoading } = useTrips({
    statuses: statusFilter === 'all' ? undefined : [statusFilter],
  });
  const { data: stores = [] } = useStores();
  const storeById = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <SafeAreaView edges={['top']}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
          <Text
            style={{
              color: tokens.text.primary,
              fontSize: 34,
              fontWeight: '700',
              letterSpacing: -0.5,
            }}
          >
            Trips
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 2, marginTop: 16 }}
          >
            {STATUS_FILTERS.map((f) => (
              <StatusChip
                key={f.value}
                label={f.label}
                active={statusFilter === f.value}
                onPress={() => setStatusFilter(f.value)}
                tokens={tokens}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      <ActiveTripBanner />

      <FlashList
        data={trips}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TripRow
            trip={item}
            storeName={storeById.get(item.store_id)?.name}
            tokens={tokens}
            onPress={() => router.push(`/trips/${item.id}` as never)}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <ListEmptyState
              icon="shopping-cart"
              title="No trips yet"
              subtitle={
                statusFilter === 'all'
                  ? 'Plan your first trip to get started.'
                  : 'No trips match this filter.'
              }
            />
          ) : null
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: fabReserve,
        }}
      />

      <FAB
        onPress={() => router.push('/trips/new' as never)}
        accessibilityLabel="New trip"
      />
    </View>
  );
}

function StatusChip({
  label,
  active,
  onPress,
  tokens,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  tokens: Theme;
}) {
  return (
    <Pressable
      onPress={onPress}
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
        {label}
      </Text>
    </Pressable>
  );
}

function TripRow({
  trip,
  storeName,
  tokens,
  onPress,
}: {
  trip: Trip;
  storeName: string | undefined;
  tokens: Theme;
  onPress: () => void;
}) {
  const dateLabel = formatTripDate(trip);
  const subtitleBits = [storeName, dateLabel].filter(Boolean) as string[];
  return (
    <ListCard
      onPress={onPress}
      archived={trip.archived_at !== null}
      title={trip.name || 'Trip'}
      subtitle={subtitleBits.join(' · ') || undefined}
      leading={<StatusBadge status={trip.status} tokens={tokens} />}
    />
  );
}

function StatusBadge({ status, tokens }: { status: TripStatus; tokens: Theme }) {
  const { color, label } = statusVisuals(status, tokens);
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

function statusVisuals(status: TripStatus, tokens: Theme) {
  switch (status) {
    case TRIP_STATUS_ENUM.PLANNED:
      return { color: tokens.info[0], label: 'Planned' };
    case TRIP_STATUS_ENUM.IN_PROGRESS:
      return { color: tokens.accent.base, label: 'Shopping' };
    case TRIP_STATUS_ENUM.COMPLETED:
      return { color: tokens.success[0], label: 'Done' };
    case TRIP_STATUS_ENUM.CANCELED:
      return { color: tokens.text.tertiary, label: 'Canceled' };
  }
}

function formatTripDate(trip: Trip): string | undefined {
  if (trip.completed_at) return formatDate(trip.completed_at);
  if (trip.started_at) return formatDate(trip.started_at);
  if (trip.planned_for) return formatDate(trip.planned_for);
  return undefined;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
