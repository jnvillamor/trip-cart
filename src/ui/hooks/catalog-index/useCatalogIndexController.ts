import { useState } from 'react';
import { Segment } from '@/ui/components/catalog-index/SegmentedPill';
import { useCategories } from '@/ui/hooks/useCategories';
import { useGoodsCount } from '@/ui/hooks/useGoods';

export function useCatalogIndexController() {
  const [segment, setSegment] = useState<Segment>('goods');
  const { data: categories = [] } = useCategories();
  const { data: goodsCount = 0 } = useGoodsCount();

  const subtitle =
    segment === 'goods'
      ? `${goodsCount} ${goodsCount === 1 ? 'good' : 'goods'}`
      : `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`;

  return { segment, setSegment, subtitle } as const;
}
