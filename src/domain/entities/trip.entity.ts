import { TripInsert, TripRow } from '@/db/models'
import { TRIP_STATUS_ENUM } from '../constants'
import { CreateTripInput } from '../schemas'

export interface Trip extends TripRow {
  readonly is_active: boolean
  readonly is_editable: boolean
}

export function toTrip(row: TripRow): Trip {
  return {
    ...row,
    is_active:
      row.status === TRIP_STATUS_ENUM.PLANNED ||
      row.status === TRIP_STATUS_ENUM.IN_PROGRESS,
    is_editable:
      row.status === TRIP_STATUS_ENUM.PLANNED ||
      row.status === TRIP_STATUS_ENUM.IN_PROGRESS,
  }
}

export const toTripInsert = (input: CreateTripInput): TripInsert => {
  return {
    name: input.name,
    store_id: input.store_id,
    planned_for: input.planned_for ?? null,
    notes: input.notes ?? null,
    resolved_currency_code: input.resolved_currency_code,
  }
}
