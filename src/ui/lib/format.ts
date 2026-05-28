import { Trip } from '@/domain/entities';

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatQty(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, '');
}

export function formatTripDate(trip: Trip): string {
  const d = trip.completed_at ?? trip.started_at ?? trip.planned_for ?? trip.created_at;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTripShortDate(trip: Trip): string | undefined {
  const d = trip.completed_at ?? trip.started_at ?? trip.planned_for;
  if (!d) return undefined;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
