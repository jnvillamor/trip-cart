import { RangePreset } from '@/ui/components/insights/DateRangeChips';

export function rangeStart(preset: RangePreset, now: Date = new Date()): Date | null {
  if (preset === 'all') return null;
  if (preset === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (preset === '3m') {
    return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }
  return new Date(now.getFullYear(), 0, 1);
}
