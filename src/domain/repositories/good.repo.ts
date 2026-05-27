import { and, asc, eq, isNull, sql, type SQL } from 'drizzle-orm';
import { Database } from '@/db/client';
import { goods, GoodInsert } from '@/db/models';
import { Good, toGood, toGoodInsert } from '../entities';
import { CreateGoodInput, UpdateGoodInput } from '../schemas';

export interface ListGoodsOptions {
  includeArchived?: boolean;
  nameQuery?: string;
  categoryId?: number;
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export const createGoodRepo = (db: Database) => ({
  async create(input: CreateGoodInput): Promise<Good> {
    const [row] = await db.insert(goods).values(toGoodInsert(input)).returning();
    return toGood(row);
  },

  async findById(id: number): Promise<Good | null> {
    const [row] = await db.select().from(goods).where(eq(goods.id, id)).limit(1);
    return row ? toGood(row) : null;
  },

  async list({
    includeArchived = false,
    nameQuery,
    categoryId,
  }: ListGoodsOptions = {}): Promise<Good[]> {
    const conditions: SQL[] = [];
    if (!includeArchived) conditions.push(isNull(goods.archived_at));
    if (categoryId !== undefined) conditions.push(eq(goods.default_category_id, categoryId));
    const trimmed = nameQuery?.trim();
    if (trimmed) {
      conditions.push(sql`${goods.name} LIKE ${`%${escapeLike(trimmed)}%`} ESCAPE '\\'`);
    }

    const rows = await db
      .select()
      .from(goods)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(goods.name));
    return rows.map(toGood);
  },

  async update(id: number, input: UpdateGoodInput): Promise<Good | null> {
    const patch: Partial<GoodInsert> = { updated_at: new Date() };
    if (input.name !== undefined) patch.name = input.name;
    if (input.default_category_id !== undefined) {
      patch.default_category_id = input.default_category_id ?? null;
    }
    if (input.default_unit !== undefined) patch.default_unit = input.default_unit ?? null;
    if (input.notes !== undefined) patch.notes = input.notes ?? null;

    const [row] = await db.update(goods).set(patch).where(eq(goods.id, id)).returning();
    return row ? toGood(row) : null;
  },

  async archive(id: number): Promise<Good | null> {
    const now = new Date();
    const [row] = await db
      .update(goods)
      .set({ archived_at: now, updated_at: now })
      .where(and(eq(goods.id, id), isNull(goods.archived_at)))
      .returning();
    return row ? toGood(row) : null;
  },

  async restore(id: number): Promise<Good | null> {
    const [row] = await db
      .update(goods)
      .set({ archived_at: null, updated_at: new Date() })
      .where(eq(goods.id, id))
      .returning();
    return row ? toGood(row) : null;
  },

  async remove(id: number): Promise<boolean> {
    const result = await db.delete(goods).where(eq(goods.id, id)).returning({ id: goods.id });
    return result.length > 0;
  },
});

export type GoodRepo = ReturnType<typeof createGoodRepo>;
