import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useInsightsPriceHistoryController } from '@/ui/hooks/insights-price-history/useInsightsPriceHistoryController';
import { useTheme } from '@/ui/theme/ThemeProvider';
import { GoodPicker } from './GoodPicker';
import { PriceLineChart } from './PriceLineChart';
import { PriceStats } from './PriceStats';

export function PriceHistoryTab() {
  const { tokens } = useTheme();
  const ctrl = useInsightsPriceHistoryController();

  if (ctrl.loading) {
    return <View style={{ flex: 1, backgroundColor: tokens.bg.page }} />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.bg.page }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      {ctrl.selectedGood ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: tokens.text.tertiary,
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Showing
            </Text>
            <Text
              style={{
                color: tokens.text.primary,
                fontSize: 20,
                fontWeight: '700',
                letterSpacing: -0.2,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {ctrl.selectedGood.name}
            </Text>
          </View>
          <Pressable
            onPress={() => ctrl.setGoodId(null)}
            hitSlop={6}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: pressed ? tokens.bg.elevated : tokens.bg.tonal,
            })}
          >
            <Text
              style={{
                color: tokens.text.primary,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              Change
            </Text>
          </Pressable>
        </View>
      ) : (
        <GoodPicker
          query={ctrl.query}
          onQueryChange={ctrl.setQuery}
          candidates={ctrl.candidates}
          onPick={(g) => ctrl.setGoodId(g.id)}
        />
      )}

      {ctrl.selectedGood ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: tokens.text.secondary, fontSize: 13, fontWeight: '600' }}>
              Split by store
            </Text>
            <Switch
              value={ctrl.perStore}
              onValueChange={ctrl.setPerStore}
              trackColor={{ false: tokens.bg.elevated, true: tokens.accent.base }}
              thumbColor={tokens.text.onAccent}
            />
          </View>
          <PriceLineChart series={ctrl.series} currency={ctrl.currency} />
          {ctrl.perStore ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {ctrl.series.map((s) => (
                <View
                  key={s.storeId}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: tokens.bg.tonal,
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: s.color,
                    }}
                  />
                  <Text style={{ color: tokens.text.secondary, fontSize: 11 }}>
                    {s.storeName} · {s.points.length}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          {ctrl.overall ? (
            <PriceStats overall={ctrl.overall} currency={ctrl.currency} />
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
}
