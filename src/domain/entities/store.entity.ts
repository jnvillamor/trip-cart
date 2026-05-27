import { StoreInsert, StoreRow } from "@/db/models"
import { CreateStoreInput } from "../schemas"

export interface Store extends StoreRow {
  readonly is_archived: boolean
}

export const toStore = (row: StoreRow): Store => ({
  ...row,
  is_archived: row.archived_at !== null,
})

export const toStoreInsert = (input: CreateStoreInput): StoreInsert => {
  return {
    name: input.name,
    currency_code_override: input.currency_code_override ?? null,
    notes: input.notes ?? null,
  }
}
