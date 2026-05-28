import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trip } from '@/domain/entities';
import { ActiveTripBanner } from '@/ui/components/ActiveTripBanner';
import { FAB, useFabBottomReserve } from '@/ui/components/FAB';
import { ListEmptyState } from '@/ui/components/ListEmptyState';
import { StatusFilterChips } from '@/ui/components/trips-list/StatusFilterChips';
import { TripRow } from '@/ui/components/trips-list/TripRow';
import { useTripsListController } from '@/ui/hooks/trips-list/useTripsListController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function TripsListScreen() {
  const { tokens } = useTheme();
  const fabReserve = useFabBottomReserve();
  const ctrl = useTripsListController();

  const listRef = useRef<FlashListRef<Trip>>(null);
  const previousFirstId = useRef<number | null>(null);

  useEffect(() => {
    const firstId = ctrl.trips[0]?.id ?? null;
    if (
      previousFirstId.current !== null &&
      firstId !== null &&
      firstId !== previousFirstId.current
    ) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
    previousFirstId.current = firstId;
  }, [ctrl.trips]);

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
          <StatusFilterChips value={ctrl.statusFilter} onChange={ctrl.setStatusFilter} />
        </View>
      </SafeAreaView>

      <ActiveTripBanner />

      <FlashList
        ref={listRef}
        data={ctrl.trips}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TripRow
            trip={item}
            storeName={ctrl.storeNameFor(item.store_id)}
            onPress={() => ctrl.openTrip(item.id)}
          />
        )}
        ListEmptyComponent={
          !ctrl.isLoading ? (
            <ListEmptyState
              icon="shopping-cart"
              title="No trips yet"
              subtitle={
                ctrl.statusFilter === 'all'
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

      <FAB onPress={ctrl.openNewTrip} accessibilityLabel="New trip" />
    </View>
  );
}
