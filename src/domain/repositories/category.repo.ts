import { and, asc, eq, isNull, sql, type SQL } from 'drizzle-orm';
import { Database } from '@/db/client';
import { categories, CategoryInsert } from '@/db/models';
import { Category, toCategory, toCategoryInsert } from '../entities';
import { CreateCategoryInput, UpdateCategoryInput } from '../schemas';

export interface ListCategoriesOptions {
  includeArchived?: boolean;
  nameQuery?: string;
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export const createCategoryRepo = (db: Database) => ({
  async create(input: CreateCategoryInput): Promise<Category> {
    const [row] = await db.insert(categories).values(toCategoryInsert(input)).returning();
    return toCategory(row);
  },

  async findById(id: number): Promise<Category | null> {
    const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return row ? toCategory(row) : null;
  },

  async list({
    includeArchived = false,
    nameQuery,
  }: ListCategoriesOptions = {}): Promise<Category[]> {
    const conditions: SQL[] = [];
    if (!includeArchived) conditions.push(isNull(categories.archived_at));
    const trimmed = nameQuery?.trim();
    if (trimmed) {
      conditions.push(sql`${categories.name} LIKE ${`%${escapeLike(trimmed)}%`} ESCAPE '\\'`);
    }

    const rows = await db
      .select()
      .from(categories)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(categories.name));
    return rows.map(toCategory);
  },

  async update(id: number, input: UpdateCategoryInput): Promise<Category | null> {
    const patch: Partial<CategoryInsert> = { updated_at: new Date() };
    if (input.name !== undefined) patch.name = input.name;
    if (input.icon_name !== undefined) patch.icon_name = input.icon_name ?? null;
    if (input.color_hex !== undefined) patch.color_hex = input.color_hex ?? null;

    const [row] = await db
      .update(categories)
      .set(patch)
      .where(eq(categories.id, id))
      .returning();
    return row ? toCategory(row) : null;
  },

  async archive(id: number): Promise<Category | null> {
    const now = new Date();
    const [row] = await db
      .update(categories)
      .set({ archived_at: now, updated_at: now })
      .where(and(eq(categories.id, id), isNull(categories.archived_at)))
      .returning();
    return row ? toCategory(row) : null;
  },

  async restore(id: number): Promise<Category | null> {
    const [row] = await db
      .update(categories)
      .set({ archived_at: null, updated_at: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return row ? toCategory(row) : null;
  },

  async remove(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    return result.length > 0;
  },
});

export type CategoryRepo = ReturnType<typeof createCategoryRepo>;
