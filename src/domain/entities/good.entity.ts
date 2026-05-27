import { GoodInsert, GoodRow } from '@/db/models';
import { CreateGoodInput } from '../schemas';

export interface Good extends GoodRow {
  readonly is_archived: boolean;
}

export const toGood = (row: GoodRow): Good => ({
  ...row,
  is_archived: row.archived_at !== null,
});

export const toGoodInsert = (input: CreateGoodInput): GoodInsert => {
  return {
    name: input.name,
    default_category_id: input.default_category_id ?? null,
    default_unit: input.default_unit ?? null,
    notes: input.notes ?? null,
  };
};
