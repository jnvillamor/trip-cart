import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesList } from '@/ui/components/CategoriesList';
import { GoodsList } from '@/ui/components/GoodsList';
import { useCategories } from '@/ui/hooks/useCategories';
import { useGoodsCount } from '@/ui/hooks/useGoods';
import { Theme } from '@/ui/theme/tokens';
import { useTheme } from '@/ui/theme/ThemeProvider';

type Segment = 'goods' | 'categories';

export default function CatalogIndex() {
  const { tokens } = useTheme();
  const [active, setActive] = useState<Segment>('goods');
  const { data: categories = [] } = useCategories();
  const { data: goodsCount = 0 } = useGoodsCount();

  const subtitle =
    active === 'goods'
      ? `${goodsCount} ${goodsCount === 1 ? 'good' : 'goods'}`
      : `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`;

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
            Catalog
          </Text>
          <Text style={{ color: tokens.text.tertiary, fontSize: 13, marginTop: 2 }}>
            {subtitle}
          </Text>
          <View style={{ marginTop: 16 }}>
            <SegmentedPill active={active} onChange={setActive} tokens={tokens} />
          </View>
        </View>
      </SafeAreaView>
      <View style={{ flex: 1 }}>
        {active === 'goods' ? <GoodsList /> : <CategoriesList />}
      </View>
    </View>
  );
}

function SegmentedPill({
  active,
  onChange,
  tokens,
}: {
  active: Segment;
  onChange: (next: Segment) => void;
  tokens: Theme;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: tokens.bg.tonal,
        borderRadius: 12,
        padding: 4,
        gap: 4,
      }}
    >
      <Segment
        label="Goods"
        active={active === 'goods'}
        onPress={() => onChange('goods')}
        tokens={tokens}
      />
      <Segment
        label="Categories"
        active={active === 'categories'}
        onPress={() => onChange('categories')}
        tokens={tokens}
      />
    </View>
  );
}

function Segment({
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
        flex: 1,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: 'center',
        backgroundColor: active
          ? tokens.accent.base
          : pressed
            ? tokens.bg.elevated
            : 'transparent',
      })}
    >
      <Text
        style={{
          color: active ? tokens.text.onAccent : tokens.text.secondary,
          fontWeight: '600',
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
