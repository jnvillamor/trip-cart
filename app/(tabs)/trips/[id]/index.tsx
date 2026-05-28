import { useLocalSearchParams } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TripItem } from '@/domain/entities';
import { ConfirmDialog } from '@/ui/components/ConfirmDialog';
import { NumpadSheet } from '@/ui/components/NumpadSheet';
import { PageHeader } from '@/ui/components/PageHeader';
import { BottomActionBar } from '@/ui/components/trip-detail/BottomActionBar';
import { ItemRow } from '@/ui/components/trip-detail/ItemRow';
import { MoreActionsSheet } from '@/ui/components/trip-detail/MoreActionsSheet';
import { SectionHeader } from '@/ui/components/trip-detail/SectionHeader';
import { SummaryCard } from '@/ui/components/trip-detail/SummaryCard';
import { useTripDetailController } from '@/ui/hooks/trip-detail/useTripDetailController';
import { useTheme } from '@/ui/theme/ThemeProvider';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 56;

export default function TripDetailScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const ctrl = useTripDetailController(id);

  if (ctrl.loading) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Trip" />
      </View>
    );
  }

  if (ctrl.notFound) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
        <PageHeader title="Trip" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: tokens.text.primary }}>Trip not found</Text>
        </View>
      </View>
    );
  }

  const {
    trip,
    sortedItems,
    items,
    store,
    editable,
    isShopping,
    currency,
    plannedTotal,
    actualTotal,
    itemsBought,
    primary,
    moreActions,
    priceEdit,
    confirm,
    moreOpen,
    setPriceEdit,
    setConfirm,
    setMoreOpen,
    adjustQty,
    openPriceEditor,
    savePrice,
    handleDragEnd,
    categoryFor,
    goodFor,
    getItemCategoryId,
  } = ctrl;

  function renderRow({ item, drag, isActive, getIndex }: RenderItemParams<TripItem>) {
    const index = getIndex() ?? 0;
    const prev = index > 0 ? sortedItems[index - 1] : undefined;
    const showHeader = !prev || getItemCategoryId(item) !== getItemCategoryId(prev);
    const cat = categoryFor(item);
    return (
      <View>
        {showHeader ? (
          <SectionHeader
            name={cat?.name ?? 'Uncategorized'}
            color={cat?.color_hex ?? '#9E9E9E'}
          />
        ) : null}
        <ItemRow
          item={item}
          good={goodFor(item)}
          currency={currency}
          editable={editable}
          isShopping={isShopping}
          isActive={isActive}
          onLongPress={editable ? drag : undefined}
          onAdjustQty={(delta) => adjustQty(item, delta)}
          onPressPrice={() => openPriceEditor(item)}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: tokens.bg.page,
        paddingBottom: insets.bottom + TAB_BAR_HEIGHT,
      }}
    >
      <PageHeader title={trip.name} subtitle={store?.name} />

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <SummaryCard
          trip={trip}
          plannedTotal={plannedTotal}
          actualTotal={actualTotal}
          itemsBought={itemsBought}
          itemsTotal={items.length}
        />
      </View>

      <DraggableFlatList
        data={sortedItems}
        keyExtractor={(item) => String(item.id)}
        onDragEnd={({ data }) => handleDragEnd(data)}
        renderItem={renderRow}
        containerStyle={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 24,
          gap: 12,
        }}
        ListEmptyComponent={
          <View
            style={{
              backgroundColor: tokens.bg.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: tokens.border.subtle,
              padding: 24,
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '600' }}>
              No items yet
            </Text>
            <Text style={{ color: tokens.text.tertiary, fontSize: 13, textAlign: 'center' }}>
              Add goods you plan to buy on this trip.
            </Text>
          </View>
        }
      />

      <BottomActionBar
        primary={primary}
        moreCount={moreActions.length}
        onMore={() => setMoreOpen(true)}
      />

      <MoreActionsSheet
        visible={moreOpen}
        actions={moreActions}
        onClose={() => setMoreOpen(false)}
      />

      <NumpadSheet
        visible={priceEdit !== null}
        initial={priceEdit?.initial ?? 0}
        currency={currency}
        onSave={savePrice}
        onClose={() => setPriceEdit(null)}
      />

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </View>
  );
}
