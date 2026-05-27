import { and, asc, eq, isNull, sql, type SQL } from 'drizzle-orm';
import { Database } from '@/db/client';
import { stores, StoreInsert } from '@/db/models';
import { Store, toStore, toStoreInsert } from '../entities';
import { CreateStoreInput, UpdateStoreInput } from '../schemas';

export interface ListStoresOptions {
  includeArchived?: boolean;
  nameQuery?: string;
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export const createStoreRepo = (db: Database) => ({
  async create(input: CreateStoreInput): Promise<Store> {
    const [row] = await db.insert(stores).values(toStoreInsert(input)).returning();
    return toStore(row);
  },

  async findById(id: number): Promise<Store | null> {
    const [row] = await db.select().from(stores).where(eq(stores.id, id)).limit(1);
    return row ? toStore(row) : null;
  },

  async list({ includeArchived = false, nameQuery }: ListStoresOptions = {}): Promise<Store[]> {
    const conditions: SQL[] = [];
    if (!includeArchived) conditions.push(isNull(stores.archived_at));
    const trimmed = nameQuery?.trim();
    if (trimmed) {
      conditions.push(sql`${stores.name} LIKE ${`%${escapeLike(trimmed)}%`} ESCAPE '\\'`);
    }

    const rows = await db
      .select()
      .from(stores)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(stores.name));
    return rows.map(toStore);
  },

  async update(id: number, input: UpdateStoreInput): Promise<Store | null> {
    const patch: Partial<StoreInsert> = { updated_at: new Date() };
    if (input.name !== undefined) patch.name = input.name;
    if (input.currency_code_override !== undefined) {
      patch.currency_code_override = input.currency_code_override ?? null;
    }
    if (input.notes !== undefined) patch.notes = input.notes ?? null;

    const [row] = await db.update(stores).set(patch).where(eq(stores.id, id)).returning();
    return row ? toStore(row) : null;
  },

  async archive(id: number): Promise<Store | null> {
    const now = new Date();
    const [row] = await db
      .update(stores)
      .set({ archived_at: now, updated_at: now })
      .where(and(eq(stores.id, id), isNull(stores.archived_at)))
      .returning();
    return row ? toStore(row) : null;
  },

  async restore(id: number): Promise<Store | null> {
    const [row] = await db
      .update(stores)
      .set({ archived_at: null, updated_at: new Date() })
      .where(eq(stores.id, id))
      .returning();
    return row ? toStore(row) : null;
  },

  async remove(id: number): Promise<boolean> {
    const result = await db.delete(stores).where(eq(stores.id, id)).returning({ id: stores.id });
    return result.length > 0;
  },
});

export type StoreRepo = ReturnType<typeof createStoreRepo>;
