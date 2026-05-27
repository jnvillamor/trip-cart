import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/db/models';
import { Database as AppDatabase } from '@/db/client';
import { createStoreRepo } from '@/domain/repositories/store.repo';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../../db/migrations');

function makeTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');

  const migrationFiles = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of migrationFiles) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    for (const stmt of sql.split('--> statement-breakpoint')) {
      const trimmed = stmt.trim();
      if (trimmed) sqlite.exec(trimmed);
    }
  }

  const db = drizzle(sqlite, { schema }) as unknown as AppDatabase;
  return { db, sqlite };
}

describe('store repo', () => {
  let db: AppDatabase;
  let sqlite: Database.Database;
  let repo: ReturnType<typeof createStoreRepo>;

  beforeEach(() => {
    ({ db, sqlite } = makeTestDb());
    repo = createStoreRepo(db);
  });

  afterEach(() => {
    sqlite.close();
  });

  describe('create', () => {
    test('persists name, override, and notes; nullifies missing optionals', async () => {
      const created = await repo.create({
        name: 'Whole Foods',
        currency_code_override: 'USD',
        notes: 'Downtown branch',
      });
      expect(created).toMatchObject({
        name: 'Whole Foods',
        currency_code_override: 'USD',
        notes: 'Downtown branch',
        archived_at: null,
        is_archived: false,
      });
      expect(typeof created.id).toBe('number');
    });

    test('omitted optional fields become null', async () => {
      const created = await repo.create({ name: 'Corner Store' });
      expect(created.currency_code_override).toBeNull();
      expect(created.notes).toBeNull();
    });
  });

  describe('findById', () => {
    test('returns store by id', async () => {
      const created = await repo.create({ name: 'SM' });
      const found = await repo.findById(created.id);
      expect(found?.id).toBe(created.id);
    });

    test('returns null when not found', async () => {
      expect(await repo.findById(9999)).toBeNull();
    });
  });

  describe('list', () => {
    test('returns non-archived stores ordered by name', async () => {
      await repo.create({ name: 'Charlie' });
      await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });

      const rows = await repo.list();
      expect(rows.map((s) => s.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);
    });

    test('excludes archived by default', async () => {
      const a = await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });
      await repo.archive(a.id);

      const rows = await repo.list();
      expect(rows.map((s) => s.name)).toEqual(['Bravo']);
    });

    test('includeArchived returns everything', async () => {
      const a = await repo.create({ name: 'Alpha' });
      await repo.create({ name: 'Bravo' });
      await repo.archive(a.id);

      const rows = await repo.list({ includeArchived: true });
      expect(rows).toHaveLength(2);
    });

    test('nameQuery filters by substring (case-insensitive)', async () => {
      await repo.create({ name: 'Whole Foods' });
      await repo.create({ name: 'Trader Joes' });
      await repo.create({ name: 'Whole Earth' });

      const rows = await repo.list({ nameQuery: 'whole' });
      expect(rows.map((s) => s.name).sort()).toEqual(['Whole Earth', 'Whole Foods']);
    });

    test('nameQuery escapes LIKE wildcards', async () => {
      await repo.create({ name: 'a_b' });
      await repo.create({ name: 'axb' });

      const rows = await repo.list({ nameQuery: '_' });
      expect(rows.map((s) => s.name)).toEqual(['a_b']);
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
        currency_code_override: 'USD',
        notes: 'keep me',
      });

      const updated = await repo.update(created.id, { name: 'Renamed' });
      expect(updated).toMatchObject({
        name: 'Renamed',
        currency_code_override: 'USD',
        notes: 'keep me',
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
