import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedPill } from '@/ui/components/catalog-index/SegmentedPill';
import { CategoriesList } from '@/ui/components/CategoriesList';
import { GoodsList } from '@/ui/components/GoodsList';
import { useCatalogIndexController } from '@/ui/hooks/catalog-index/useCatalogIndexController';
import { useTheme } from '@/ui/theme/ThemeProvider';

export default function CatalogIndex() {
  const { tokens } = useTheme();
  const ctrl = useCatalogIndexController();

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
            {ctrl.subtitle}
          </Text>
          <View style={{ marginTop: 16 }}>
            <SegmentedPill active={ctrl.segment} onChange={ctrl.setSegment} />
          </View>
        </View>
      </SafeAreaView>
      <View style={{ flex: 1 }}>
        {ctrl.segment === 'goods' ? <GoodsList /> : <CategoriesList />}
      </View>
    </View>
  );
}
