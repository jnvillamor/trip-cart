import type Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { stores } from '@/db/models';
import { Database as AppDatabase } from '@/db/client';
import { createTripRepo } from '@/domain/repositories/trip.repo';
import { TRIP_STATUS_ENUM } from '@/domain/constants';
import { makeTestDb } from './_setup';

async function seedStore(db: AppDatabase, name: string): Promise<number> {
  const [row] = await db.insert(stores).values({ name }).returning({ id: stores.id });
  return row.id;
}

describe('trip repo', () => {
  let db: AppDatabase;
  let sqlite: Database.Database;
  let repo: ReturnType<typeof createTripRepo>;
  let storeId: number;

  beforeEach(async () => {
    ({ db, sqlite } = makeTestDb());
    repo = createTripRepo(db);
    storeId = await seedStore(db, 'Whole Foods');
  });

  afterEach(() => {
    sqlite.close();
  });

  describe('create', () => {
    test('persists all fields and defaults status to PLANNED', async () => {
      const plannedFor = new Date('2026-06-01T00:00:00Z');
      const created = await repo.create({
        name: 'Weekly groceries',
        store_id: storeId,
        resolved_currency_code: 'USD',
        planned_for: plannedFor,
        notes: 'Get strawberries',
      });
      expect(created).toMatchObject({
        name: 'Weekly groceries',
        store_id: storeId,
        resolved_currency_code: 'USD',
        status: TRIP_STATUS_ENUM.PLANNED,
        notes: 'Get strawberries',
        is_active: true,
        is_editable: true,
        archived_at: null,
      });
      expect(created.planned_for?.getTime()).toBe(plannedFor.getTime());
    });

    test('omitted optional fields become null', async () => {
      const created = await repo.create({
        name: 'Quick run',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      expect(created.planned_for).toBeNull();
      expect(created.notes).toBeNull();
      expect(created.started_at).toBeNull();
      expect(created.completed_at).toBeNull();
    });
  });

  describe('findById', () => {
    test('returns trip by id', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const found = await repo.findById(created.id);
      expect(found?.id).toBe(created.id);
    });

    test('returns null when not found', async () => {
      expect(await repo.findById(9999)).toBeNull();
    });
  });

  describe('list', () => {
    test('returns trips ordered by created_at desc', async () => {
      // Use explicit different created_at by inserting with a small delay equivalent
      const t1 = await repo.create({
        name: 'First',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const t2 = await repo.create({
        name: 'Second',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const t3 = await repo.create({
        name: 'Third',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });

      const rows = await repo.list();
      // Most recent first; ids are auto-incremented so newer = higher id
      expect(rows.map((t) => t.id)).toEqual([t3.id, t2.id, t1.id]);
    });

    test('excludes archived by default', async () => {
      const a = await repo.create({
        name: 'Alpha',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      await repo.create({ name: 'Bravo', store_id: storeId, resolved_currency_code: 'USD' });
      await repo.archive(a.id);

      const rows = await repo.list();
      expect(rows.map((t) => t.name)).toEqual(['Bravo']);
    });

    test('includeArchived returns everything', async () => {
      const a = await repo.create({
        name: 'Alpha',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      await repo.create({ name: 'Bravo', store_id: storeId, resolved_currency_code: 'USD' });
      await repo.archive(a.id);

      const rows = await repo.list({ includeArchived: true });
      expect(rows).toHaveLength(2);
    });

    test('storeId filter narrows to trips at that store', async () => {
      const otherStoreId = await seedStore(db, 'Trader Joes');
      await repo.create({ name: 'A', store_id: storeId, resolved_currency_code: 'USD' });
      await repo.create({ name: 'B', store_id: otherStoreId, resolved_currency_code: 'USD' });
      await repo.create({ name: 'C', store_id: storeId, resolved_currency_code: 'USD' });

      const rows = await repo.list({ storeId });
      expect(rows.map((t) => t.name).sort()).toEqual(['A', 'C']);
    });

    test('statuses filter narrows to matching statuses', async () => {
      const planned = await repo.create({
        name: 'P',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const inProgress = await repo.create({
        name: 'IP',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const completed = await repo.create({
        name: 'C',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });

      await repo.start(inProgress.id);
      await repo.complete(completed.id);

      const active = await repo.list({
        statuses: [TRIP_STATUS_ENUM.PLANNED, TRIP_STATUS_ENUM.IN_PROGRESS],
      });
      expect(active.map((t) => t.id).sort()).toEqual([planned.id, inProgress.id].sort());
    });

    test('nameQuery filters by substring (case-insensitive)', async () => {
      await repo.create({
        name: 'Weekly groceries',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      await repo.create({ name: 'Party run', store_id: storeId, resolved_currency_code: 'USD' });
      await repo.create({
        name: 'Weekend trip',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });

      const rows = await repo.list({ nameQuery: 'week' });
      expect(rows.map((t) => t.name).sort()).toEqual(['Weekend trip', 'Weekly groceries']);
    });

    test('nameQuery escapes LIKE wildcards', async () => {
      await repo.create({ name: 'a_b', store_id: storeId, resolved_currency_code: 'USD' });
      await repo.create({ name: 'axb', store_id: storeId, resolved_currency_code: 'USD' });

      const rows = await repo.list({ nameQuery: '_' });
      expect(rows.map((t) => t.name)).toEqual(['a_b']);
    });

    test('blank/whitespace nameQuery is ignored', async () => {
      await repo.create({ name: 'Alpha', store_id: storeId, resolved_currency_code: 'USD' });
      await repo.create({ name: 'Bravo', store_id: storeId, resolved_currency_code: 'USD' });

      const rows = await repo.list({ nameQuery: '   ' });
      expect(rows).toHaveLength(2);
    });
  });

  describe('update', () => {
    test('patches only provided fields', async () => {
      const created = await repo.create({
        name: 'Original',
        store_id: storeId,
        resolved_currency_code: 'USD',
        notes: 'keep me',
      });

      const updated = await repo.update(created.id, { name: 'Renamed' });
      expect(updated).toMatchObject({
        name: 'Renamed',
        notes: 'keep me',
      });
    });

    test('returns null when id does not exist', async () => {
      expect(await repo.update(9999, { name: 'x' })).toBeNull();
    });
  });

  describe('start', () => {
    test('moves trip to IN_PROGRESS and stamps started_at', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const started = await repo.start(created.id);
      expect(started?.status).toBe(TRIP_STATUS_ENUM.IN_PROGRESS);
      expect(started?.started_at).not.toBeNull();
      expect(started?.is_active).toBe(true);
    });

    test('accepts an explicit started_at override', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const startedAt = new Date('2026-01-15T12:00:00Z');
      const started = await repo.start(created.id, startedAt);
      expect(started?.started_at?.getTime()).toBe(startedAt.getTime());
    });
  });

  describe('complete', () => {
    test('moves trip to COMPLETED and stamps completed_at', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const completed = await repo.complete(created.id);
      expect(completed?.status).toBe(TRIP_STATUS_ENUM.COMPLETED);
      expect(completed?.completed_at).not.toBeNull();
      expect(completed?.is_active).toBe(false);
      expect(completed?.is_editable).toBe(false);
    });

    test('accepts an explicit completed_at override', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const completedAt = new Date('2026-02-20T18:30:00Z');
      const completed = await repo.complete(created.id, completedAt);
      expect(completed?.completed_at?.getTime()).toBe(completedAt.getTime());
    });

    test('can complete a trip that was started first', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      await repo.start(created.id);
      const completed = await repo.complete(created.id);
      expect(completed?.status).toBe(TRIP_STATUS_ENUM.COMPLETED);
      expect(completed?.started_at).not.toBeNull();
      expect(completed?.completed_at).not.toBeNull();
    });
  });

  describe('archive / restore', () => {
    test('archive sets archived_at', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      const archived = await repo.archive(created.id);
      expect(archived?.archived_at).not.toBeNull();
    });

    test('archive returns null when already archived', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      await repo.archive(created.id);
      expect(await repo.archive(created.id)).toBeNull();
    });

    test('restore clears archived_at', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      await repo.archive(created.id);
      const restored = await repo.restore(created.id);
      expect(restored?.archived_at).toBeNull();
    });
  });

  describe('remove', () => {
    test('hard-deletes and returns true', async () => {
      const created = await repo.create({
        name: 'T',
        store_id: storeId,
        resolved_currency_code: 'USD',
      });
      expect(await repo.remove(created.id)).toBe(true);
      expect(await repo.findById(created.id)).toBeNull();
    });

    test('returns false when id does not exist', async () => {
      expect(await repo.remove(9999)).toBe(false);
    });
  });

  describe('FK behavior', () => {
    test('deleting a referenced store throws (ON DELETE RESTRICT)', async () => {
      await repo.create({ name: 'T', store_id: storeId, resolved_currency_code: 'USD' });
      expect(() => {
        // Drizzle better-sqlite3 returns a sync-ish handle; the FK violation
        // surfaces synchronously when the statement runs.
        return db.delete(stores).where(eq(stores.id, storeId)).run();
      }).toThrow();
    });
  });
});
