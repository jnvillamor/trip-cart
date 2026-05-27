# Catalog Page — Design Options

Snapshots of the catalog page header/control treatments for comparison.

## Option A — MaterialTopTabs under a large title

Inline 34pt "Catalog" title, then `material-top-tabs` with an animated 3px accent underline indicator. Swipeable between Goods and Categories scenes.

**Pros**
- Native swipe gesture between scenes
- Animated indicator slides between segments
- Familiar Android/material aesthetic

**Cons**
- Underline indicator feels material-design-y rather than iOS-native
- Tab bar takes ~46px of vertical chrome on top of the title

**Code summary**
- `catalog/_layout.tsx` — `<Stack.Screen name="index" options={{ headerShown: false }} />`
- `catalog/index.tsx` — `<View>` → `<SafeAreaView>` + 34pt title → `<TopTab.Navigator>` (Goods/Categories) → scene components

```tsx
<View style={{ flex: 1, backgroundColor: tokens.bg.page }}>
  <SafeAreaView edges={['top']}>
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
      <Text style={{ fontSize: 34, fontWeight: '700', letterSpacing: -0.5 }}>Catalog</Text>
    </View>
  </SafeAreaView>
  <TopTab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: tokens.bg.page, borderBottomWidth: 1, borderBottomColor: tokens.border.subtle },
      tabBarIndicatorStyle: { backgroundColor: tokens.accent.base, height: 3, borderRadius: 2 },
      tabBarLabelStyle: { fontWeight: '600', fontSize: 13, textTransform: 'none' },
      tabBarActiveTintColor: tokens.text.primary,
      tabBarInactiveTintColor: tokens.text.tertiary,
    }}
  >
    <TopTab.Screen name="Goods" component={GoodsTab} />
    <TopTab.Screen name="Categories" component={CategoriesTab} />
  </TopTab.Navigator>
</View>
```

## Option B — iOS-style segmented control pill

Same large 34pt title, but instead of material top tabs there's a centered **pill-style segmented control** (`Goods │ Categories`) underneath the title. The active segment is a solid accent-filled rounded rectangle inside a tonal track. No swipe — switch via state + conditional render.

**Pros**
- Tighter, more iOS-native aesthetic (UISegmentedControl style)
- Fully on-brand (uses cffy accent / tonal / surface tokens)
- Less vertical chrome — the pill is ~36px tall

**Cons**
- No swipe gesture between scenes (tap-only)
- No animated indicator (active state just changes)

**Code summary**
- `useState<Segment>('goods' | 'categories')` for active tab
- Pill: `flexDirection: 'row'` container with `bg.tonal` track, two `Pressable` segments inside
- Active segment: `backgroundColor: accent.base` + `text.onAccent` label
- Inactive: transparent bg + `text.secondary` label
- Content below: conditional render `<CategoriesList />` or `<GoodsScene />`

```tsx
<View style={{ flex: 1 }}>
  <SafeAreaView edges={['top']}>
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
      <Text style={{ fontSize: 34, fontWeight: '700' }}>Catalog</Text>
      <View style={{ flexDirection: 'row', backgroundColor: tokens.bg.tonal, borderRadius: 12, padding: 4, marginTop: 16 }}>
        <Pressable onPress={() => setActive('goods')} style={{ flex: 1, paddingVertical: 10, borderRadius: 9, backgroundColor: active === 'goods' ? tokens.accent.base : 'transparent' }}>
          <Text style={{ color: active === 'goods' ? tokens.text.onAccent : tokens.text.secondary, fontWeight: '600' }}>Goods</Text>
        </Pressable>
        <Pressable onPress={() => setActive('categories')} style={{ flex: 1, paddingVertical: 10, borderRadius: 9, backgroundColor: active === 'categories' ? tokens.accent.base : 'transparent' }}>
          <Text style={{ color: active === 'categories' ? tokens.text.onAccent : tokens.text.secondary, fontWeight: '600' }}>Categories</Text>
        </Pressable>
      </View>
    </View>
  </SafeAreaView>
  {active === 'goods' ? <GoodsScene /> : <CategoriesList />}
</View>
```

## Option C — Typographic text tabs with active underline

Compact 28pt title with a small "N sections" subtitle. Below the title, **text tabs inline** ("Goods" / "Categories") with a 3px accent underline appearing only under the active label. No pill background, no tab bar, no chrome — just typography.

**Pros**
- Most minimal of the three; lets content breathe
- Editorial / Apple News–like aesthetic
- Smallest header height (~110px including subtitle)

**Cons**
- Tabs are less obviously "tabs" (looks like inline links)
- No swipe gesture
- Active state is subtle — may need a slight lift to feel "selected"

See `app/(tabs)/catalog/index.tsx` for the active implementation.
