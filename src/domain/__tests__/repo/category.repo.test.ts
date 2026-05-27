import type Database from 'better-sqlite3';
import { Database as AppDatabase } from '@/db/client';
import { createCategoryRepo } from '@/domain/repositories/category.repo';
import { makeTestDb } from './_setup';

describe('category repo', () => {
  let db: AppDatabase;
  let sqlite: Database.Database;
  let repo: ReturnType<typeof createCategoryRepo>;

  beforeEach(() => {
    ({ db, sqlite } = makeTestDb());
    repo = createCategoryRepo(db);
  });

  afterEach(() => {
    sqlite.close();
  });

  describe('create', () => {
    test('persists name, icon, and color', async () => {
      const created = await repo.create({
        name: 'Produce',
        icon_name: 'eco',
        color_hex: '#4CAF50',
      });
      expect(created).toMatchObject({
        name: 'Produce',
        icon_name: 'eco',
        color_hex: '#4CAF50',
        archived_at: null,
        is_archived: false,
      });
      expect(typeof created.id).toBe('number');
    });

    test('omitted optional fields become null', async () => {
      const created = await repo.create({ name: 'Other' });
      expect(created.icon_name).toBeNull();
      expect(created.color_hex).toBeNull();
    });

    test('throws on duplicate name (unique index)', async () => {
      await repo.create({ name: 'Produce' });
      await expect(repo.create({ name: 'Produce' })).rejects.toThrow();
    });
  });

  describe('findById', () => {
    test('returns category by id', async () => {
      const created = await repo.create({ name: 'Dairy' });
      const found = await repo.findById(created.id);
      expect(found?.id).toBe(created.id);
    });

    test('returns null when not found', async () => {
      expect(await repo.findById(9999)).toBeNull();
    });
  });

  describe('list', () => {
    test('returns non-archived categories ordered by name', async () => {
      await repo.create({ name: 'Charlie' });
      await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });

      const rows = await repo.list();
      expect(rows.map((c) => c.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);
    });

    test('excludes archived by default', async () => {
      const a = await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });
      await repo.archive(a.id);

      const rows = await repo.list();
      expect(rows.map((c) => c.name)).toEqual(['Bravo']);
    });

    test('includeArchived returns everything', async () => {
      const a = await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });
      await repo.archive(a.id);

      const rows = await repo.list({ includeArchived: true });
      expect(rows).toHaveLength(2);
    });

    test('nameQuery filters by substring (case-insensitive)', async () => {
      await repo.create({ name: 'Produce' });
      await repo.create({ name: 'Pantry' });
      await repo.create({ name: 'Dairy' });

      const rows = await repo.list({ nameQuery: 'pro' });
      expect(rows.map((c) => c.name)).toEqual(['Produce']);
    });

    test('nameQuery escapes LIKE wildcards', async () => {
      await repo.create({ name: 'a_b' });
      await repo.create({ name: 'axb' });

      const rows = await repo.list({ nameQuery: '_' });
      expect(rows.map((c) => c.name)).toEqual(['a_b']);
    });

    test('blank/whitespace nameQuery is ignored', async () => {
      await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });

      const rows = await repo.list({ nameQuery: '   ' });
      expect(rows).toHaveLength(2);
    });
  });

  describe('update', () => {
    test('patches only provided fields', async () => {
      const created = await repo.create({
        name: 'Original',
        icon_name: 'eco',
        color_hex: '#4CAF50',
      });

      const updated = await repo.update(created.id, { name: 'Renamed' });
      expect(updated).toMatchObject({
        name: 'Renamed',
        icon_name: 'eco',
        color_hex: '#4CAF50',
      });
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
});
