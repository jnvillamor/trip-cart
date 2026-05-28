import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { ConfirmDialog } from '@/ui/components/ConfirmDialog';
import { NumpadSheet } from '@/ui/components/NumpadSheet';
import { AddItemRow } from '@/ui/components/shopping/AddItemRow';
import { BoughtDivider } from '@/ui/components/shopping/BoughtDivider';
import { CompleteTripSheet } from '@/ui/components/shopping/CompleteTripSheet';
import { ItemEditSheet } from '@/ui/components/shopping/ItemEditSheet';
import { ShoppingHeader } from '@/ui/components/shopping/ShoppingHeader';
import { ShoppingItemRow } from '@/ui/components/shopping/ShoppingItemRow';
import { TotalFooter } from '@/ui/components/shopping/TotalFooter';
import { useShoppingController } from '@/ui/hooks/shopping/useShoppingController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function ShoppingModeScreen() {
  const { tokens } = useTheme();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const ctrl = useShoppingController(id);

  if (ctrl.loading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  if (ctrl.notFound) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg.page,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: tokens.text.primary }}>Trip not found</Text>
      </View>
    );
  }

  const empty = ctrl.unboughtItems.length === 0 && ctrl.boughtItems.length === 0;
  const transition = LinearTransition.duration(180);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
      <ShoppingHeader
        title={ctrl.trip.name}
        subtitle={ctrl.store?.name}
        itemsBought={ctrl.itemsBought}
        itemsTotal={ctrl.itemsTotal}
        onExit={ctrl.exit}
      />

      {empty ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            gap: 12,
          }}
        >
          <Text style={{ color: tokens.text.primary, fontSize: 16, fontWeight: '700' }}>
            No items yet
          </Text>
          <Text
            style={{ color: tokens.text.tertiary, fontSize: 13, textAlign: 'center' }}
          >
            Add the first item to start tracking what you buy.
          </Text>
          <Pressable
            onPress={ctrl.openAddItems}
            style={({ pressed }) => ({
              marginTop: 8,
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: pressed ? tokens.accent.active : tokens.accent.base,
            })}
          >
            <Text style={{ color: tokens.text.onAccent, fontWeight: '700', fontSize: 15 }}>
              Add items
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 24,
            gap: 10,
          }}
        >
          <AddItemRow onPress={ctrl.openAddItems} />

          {ctrl.unboughtItems.map((item) => (
            <Animated.View key={item.id} layout={transition}>
              <ShoppingItemRow
                item={item}
                good={ctrl.goodFor(item)}
                currency={ctrl.currency}
                onToggleChecked={() => ctrl.toggleChecked(item)}
                onEdit={() => ctrl.setEditing(item.id)}
              />
            </Animated.View>
          ))}

          {ctrl.boughtItems.length > 0 ? (
            <Animated.View layout={transition}>
              <BoughtDivider count={ctrl.boughtItems.length} />
            </Animated.View>
          ) : null}

          {ctrl.boughtItems.map((item) => (
            <Animated.View key={item.id} layout={transition}>
              <ShoppingItemRow
                item={item}
                good={ctrl.goodFor(item)}
                currency={ctrl.currency}
                onToggleChecked={() => ctrl.toggleChecked(item)}
                onEdit={() => ctrl.setEditing(item.id)}
              />
            </Animated.View>
          ))}
        </ScrollView>
      )}

      <TotalFooter
        runningTotal={ctrl.runningTotal}
        plannedTotal={ctrl.plannedTotal}
        currency={ctrl.currency}
        onComplete={ctrl.confirmComplete}
        completing={ctrl.completing}
      />

      <ItemEditSheet
        visible={ctrl.editing != null}
        item={ctrl.editingItem}
        good={ctrl.editingItem ? ctrl.goodFor(ctrl.editingItem) : undefined}
        currency={ctrl.currency}
        onAdjustQty={(delta) =>
          ctrl.editingItem ? ctrl.adjustQty(ctrl.editingItem, delta) : undefined
        }
        onEditPrice={() =>
          ctrl.editingItem ? ctrl.openPriceEditor(ctrl.editingItem) : undefined
        }
        onClose={() => ctrl.setEditing(null)}
      />

      <NumpadSheet
        visible={ctrl.priceEdit !== null}
        initial={ctrl.priceEdit?.initial ?? 0}
        currency={ctrl.currency}
        onSave={ctrl.savePrice}
        onClose={() => ctrl.setPriceEdit(null)}
      />

      <ConfirmDialog request={ctrl.confirm} onClose={() => ctrl.setConfirm(null)} />

      <CompleteTripSheet
        visible={ctrl.completeOpen}
        plannedTotal={ctrl.plannedTotal}
        actualTotal={ctrl.runningTotal}
        itemsBought={ctrl.itemsBought}
        itemsTotal={ctrl.itemsTotal}
        currency={ctrl.currency}
        busy={ctrl.completing}
        onConfirm={ctrl.doComplete}
        onClose={() => ctrl.setCompleteOpen(false)}
      />
    </View>
  );
}
