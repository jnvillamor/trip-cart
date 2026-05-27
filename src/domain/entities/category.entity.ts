import { CategoryInsert, CategoryRow } from '@/db/models'
import { CreateCategoryInput } from '../schemas'

export interface Category extends CategoryRow {
  readonly is_archived: boolean
}

export const toCategory = (row: CategoryRow): Category => ({
  ...row,
  is_archived: row.archived_at !== null,
})

export const toCategoryInsert = (
  input: CreateCategoryInput,
): CategoryInsert => {
  return {
    name: input.name,
    icon_name: input.icon_name ?? null,
    color_hex: input.color_hex ?? null,
  }
}
