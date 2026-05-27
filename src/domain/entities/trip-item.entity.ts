import { TripItemRow } from '@/db/models'

export interface TripItem extends TripItemRow {
  readonly planned_totoal_minor: number | null
  readonly actual_total_minor: number | null
  readonly effective_total_minor: number | null
  readonly is_missing_actual: boolean
}

export function toTripItem(row: TripItemRow): TripItem {
  // quantity * unitPriceMinor → may produce a non-integer because
  // quantity is real (e.g. 1.5 kg * 199 cents = 298.5 cents). Round
  // back to integer minor units so aggregates stay exact.
  const plannedTotalMinor =
    row.planned_quantity != null && row.planned_unit_price != null
      ? Math.round(row.planned_quantity * row.planned_unit_price)
      : null

  const actualTotalMinor =
    row.actual_quantity != null && row.actual_unit_price != null
      ? Math.round(row.actual_quantity * row.actual_unit_price)
      : null

  const effectiveTotalMinor = actualTotalMinor ?? plannedTotalMinor
  const isMissingActuals = row.is_checked && actualTotalMinor === null

  return {
    ...row,
    planned_totoal_minor: plannedTotalMinor,
    actual_total_minor: actualTotalMinor,
    effective_total_minor: effectiveTotalMinor,
    is_missing_actual: isMissingActuals,
  }
}
