import type Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { categories } from '@/db/models';
import { Database as AppDatabase } from '@/db/client';
import { createGoodRepo } from '@/domain/repositories/good.repo';
import { makeTestDb } from './_setup';

async function seedCategory(db: AppDatabase, name: string): Promise<number> {
  const [row] = await db.insert(categories).values({ name }).returning({ id: categories.id });
  return row.id;
}

describe('good repo', () => {
  let db: AppDatabase;
  let sqlite: Database.Database;
  let repo: ReturnType<typeof createGoodRepo>;

  beforeEach(() => {
    ({ db, sqlite } = makeTestDb());
    repo = createGoodRepo(db);
  });

  afterEach(() => {
    sqlite.close();
  });

  describe('create', () => {
    test('persists name, category, unit, and notes', async () => {
      const categoryId = await seedCategory(db, 'Produce');
      const created = await repo.create({
        name: 'Apple',
        default_category_id: categoryId,
        default_unit: 'kg',
        notes: 'Fuji preferred',
      });
      expect(created).toMatchObject({
        name: 'Apple',
        default_category_id: categoryId,
        default_unit: 'kg',
        notes: 'Fuji preferred',
        archived_at: null,
        is_archived: false,
      });
      expect(typeof created.id).toBe('number');
    });

    test('omitted optional fields become null', async () => {
      const created = await repo.create({ name: 'Banana' });
      expect(created.default_category_id).toBeNull();
      expect(created.default_unit).toBeNull();
      expect(created.notes).toBeNull();
    });

    test('allows duplicate names (no unique constraint)', async () => {
      await repo.create({ name: 'Apple' });
      await expect(repo.create({ name: 'Apple' })).resolves.toMatchObject({ name: 'Apple' });
    });
  });

  describe('findById', () => {
    test('returns good by id', async () => {
      const created = await repo.create({ name: 'Bread' });
      const found = await repo.findById(created.id);
      expect(found?.id).toBe(created.id);
    });

    test('returns null when not found', async () => {
      expect(await repo.findById(9999)).toBeNull();
    });
  });

  describe('list', () => {
    test('returns non-archived goods ordered by name', async () => {
      await repo.create({ name: 'Charlie' });
      await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });

      const rows = await repo.list();
      expect(rows.map((g) => g.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);
    });

    test('excludes archived by default', async () => {
      const a = await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });
      await repo.archive(a.id);

      const rows = await repo.list();
      expect(rows.map((g) => g.name)).toEqual(['Bravo']);
    });

    test('includeArchived returns everything', async () => {
      const a = await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });
      await repo.archive(a.id);

      const rows = await repo.list({ includeArchived: true });
      expect(rows).toHaveLength(2);
    });

    test('nameQuery filters by substring (case-insensitive)', async () => {
      await repo.create({ name: 'Apple' });
      await repo.create({ name: 'Banana' });
      await repo.create({ name: 'Pineapple' });

      const rows = await repo.list({ nameQuery: 'app' });
      expect(rows.map((g) => g.name).sort()).toEqual(['Apple', 'Pineapple']);
    });

    test('nameQuery escapes LIKE wildcards', async () => {
      await repo.create({ name: 'a_b' });
      await repo.create({ name: 'axb' });

      const rows = await repo.list({ nameQuery: '_' });
      expect(rows.map((g) => g.name)).toEqual(['a_b']);
    });

    test('blank/whitespace nameQuery is ignored', async () => {
      await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });

      const rows = await repo.list({ nameQuery: '   ' });
      expect(rows).toHaveLength(2);
    });

    test('categoryId filter narrows to goods in that category', async () => {
      const produceId = await seedCategory(db, 'Produce');
      const dairyId = await seedCategory(db, 'Dairy');

      await repo.create({ name: 'Apple', default_category_id: produceId });
      await repo.create({ name: 'Banana', default_category_id: produceId });
      await repo.create({ name: 'Milk', default_category_id: dairyId });
      await repo.create({ name: 'Uncategorized' });

      const rows = await repo.list({ categoryId: produceId });
      expect(rows.map((g) => g.name).sort()).toEqual(['Apple', 'Banana']);
    });
  });

  describe('update', () => {
    test('patches only provided fields', async () => {
      const created = await repo.create({
        name: 'Original',
        default_unit: 'kg',
        notes: 'keep me',
      });

      const updated = await repo.update(created.id, { name: 'Renamed' });
      expect(updated).toMatchObject({
        name: 'Renamed',
        default_unit: 'kg',
        notes: 'keep me',
      });
    });

    test('can reassign category', async () => {
      const produceId = await seedCategory(db, 'Produce');
      const dairyId = await seedCategory(db, 'Dairy');
      const created = await repo.create({ name: 'Yogurt', default_category_id: produceId });

      const updated = await repo.update(created.id, { default_category_id: dairyId });
      expect(updated?.default_category_id).toBe(dairyId);
    });

    test('returns null when id does not exist', async () => {
      expect(await repo.update(9999, { name: 'x' })).toBeNull();
    });
  });

  describe('archive / restore', () => {
    test('archive sets archived_at and flags is_archived', async () => {
      const created = await repo.create({ name: 'Alpha' });
      const archived = await repo.archive(created.id);
      expect(archived?.is_archived).toBe(true);
      expect(archived?.archived_at).not.toBeNull();
    });

    test('archive returns null when already archived', async () => {
      const created = await repo.create({ name: 'Alpha' });
      await repo.archive(created.id);
      expect(await repo.archive(created.id)).toBeNull();
    });

    test('restore clears archived_at', async () => {
      const created = await repo.create({ name: 'Alpha' });
      await repo.archive(created.id);
      const restored = await repo.restore(created.id);
      expect(restored?.is_archived).toBe(false);
      expect(restored?.archived_at).toBeNull();
    });
  });

  describe('remove', () => {
    test('hard-deletes and returns true', async () => {
      const created = await repo.create({ name: 'Alpha' });
      expect(await repo.remove(created.id)).toBe(true);
      expect(await repo.findById(created.id)).toBeNull();
    });

    test('returns false when id does not exist', async () => {
      expect(await repo.remove(9999)).toBe(false);
    });
  });

  describe('FK behavior', () => {
    test('deleting category nulls out default_category_id (ON DELETE SET NULL)', async () => {
      const produceId = await seedCategory(db, 'Produce');
      const created = await repo.create({ name: 'Apple', default_category_id: produceId });

      await db.delete(categories).where(eq(categories.id, produceId));

      const refetched = await repo.findById(created.id);
      expect(refetched?.default_category_id).toBeNull();
    });
  });
});
