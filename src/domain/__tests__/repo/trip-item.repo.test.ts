import type Database from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { goods, stores, trips } from '@/db/models';
import { Database as AppDatabase } from '@/db/client';
import { createTripItemRepo } from '@/domain/repositories/trip-item.repo';
import { makeTestDb } from './_setup';

async function seed(db: AppDatabase) {
  const [store] = await db.insert(stores).values({ name: 'Whole Foods' }).returning({
    id: stores.id,
  });
  const [trip] = await db
    .insert(trips)
    .values({ name: 'Weekly', store_id: store.id, resolved_currency_code: 'USD' })
    .returning({ id: trips.id });
  const [good] = await db.insert(goods).values({ name: 'Apple' }).returning({ id: goods.id });
  return { storeId: store.id, tripId: trip.id, goodId: good.id };
}

describe('trip-item repo', () => {
  let db: AppDatabase;
  let sqlite: Database.Database;
  let repo: ReturnType<typeof createTripItemRepo>;
  let tripId: number;
  let goodId: number;

  beforeEach(async () => {
    ({ db, sqlite } = makeTestDb());
    repo = createTripItemRepo(db);
    ({ tripId, goodId } = await seed(db));
  });

  afterEach(() => {
    sqlite.close();
  });

  describe('create', () => {
    test('persists fields with provided values', async () => {
      const created = await repo.create(tripId, {
        good_id: goodId,
        planned_quantity: 2,
        planned_unit_price: 199,
        notes: 'Fuji',
      });
      expect(created).toMatchObject({
        trip_id: tripId,
        good_id: goodId,
        planned_quantity: 2,
        planned_unit_price: 199,
        notes: 'Fuji',
        is_checked: false,
        sort_order: 0,
      });
      expect(typeof created.id).toBe('number');
    });

    test('defaults planned quantity/price to 0 when omitted', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      expect(created.planned_quantity).toBe(0);
      expect(created.planned_unit_price).toBe(0);
      expect(created.notes).toBeNull();
    });

    test('exposes derived totals via the entity mapper', async () => {
      const created = await repo.create(tripId, {
        good_id: goodId,
        planned_quantity: 2,
        planned_unit_price: 199,
      });
      expect(created.planned_totoal_minor).toBe(398);
      expect(created.actual_total_minor).toBe(0); // 0 * 0 rounded
      expect(created.effective_total_minor).toBe(0);
    });
  });

  describe('findById', () => {
    test('returns item by id', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      const found = await repo.findById(created.id);
      expect(found?.id).toBe(created.id);
    });

    test('returns null when not found', async () => {
      expect(await repo.findById(9999)).toBeNull();
    });
  });

  describe('list', () => {
    test('orders by sort_order asc then id asc', async () => {
      const a = await repo.create(tripId, { good_id: goodId });
      const b = await repo.create(tripId, { good_id: goodId });
      const c = await repo.create(tripId, { good_id: goodId });
      await repo.update(a.id, { sort_order: 2 });
      await repo.update(b.id, { sort_order: 1 });
      await repo.update(c.id, { sort_order: 1 });

      const rows = await repo.list({ tripId });
      // b and c both at sort_order 1 → tiebreak by id asc; a at sort_order 2 last
      expect(rows.map((r) => r.id)).toEqual([b.id, c.id, a.id]);
    });

    test('tripId filter narrows to items in that trip', async () => {
      const [otherTrip] = await db
        .insert(trips)
        .values({ name: 'Other', store_id: 1, resolved_currency_code: 'USD' })
        .returning({ id: trips.id });
      await repo.create(tripId, { good_id: goodId });
      await repo.create(otherTrip.id, { good_id: goodId });

      const rows = await repo.list({ tripId });
      expect(rows).toHaveLength(1);
      expect(rows[0].trip_id).toBe(tripId);
    });

    test('excludes archived by default', async () => {
      const a = await repo.create(tripId, { good_id: goodId });
      await repo.create(tripId, { good_id: goodId });
      await repo.archive(a.id);

      const rows = await repo.list({ tripId });
      expect(rows).toHaveLength(1);
    });

    test('includeArchived returns everything', async () => {
      const a = await repo.create(tripId, { good_id: goodId });
      await repo.create(tripId, { good_id: goodId });
      await repo.archive(a.id);

      const rows = await repo.list({ tripId, includeArchived: true });
      expect(rows).toHaveLength(2);
    });

    test('isChecked filter narrows to matching state', async () => {
      const a = await repo.create(tripId, { good_id: goodId });
      await repo.create(tripId, { good_id: goodId });
      await repo.toggleCheck(a.id);

      const checked = await repo.list({ tripId, isChecked: true });
      expect(checked).toHaveLength(1);
      expect(checked[0].id).toBe(a.id);

      const unchecked = await repo.list({ tripId, isChecked: false });
      expect(unchecked).toHaveLength(1);
      expect(unchecked[0].id).not.toBe(a.id);
    });
  });

  describe('update', () => {
    test('patches only provided fields', async () => {
      const created = await repo.create(tripId, {
        good_id: goodId,
        planned_quantity: 1,
        planned_unit_price: 100,
        notes: 'keep me',
      });

      const updated = await repo.update(created.id, {
        actual_quantity: 2,
        actual_unit_price: 150,
      });
      expect(updated).toMatchObject({
        planned_quantity: 1,
        planned_unit_price: 100,
        actual_quantity: 2,
        actual_unit_price: 150,
        notes: 'keep me',
      });
    });

    test('returns null when id does not exist', async () => {
      expect(await repo.update(9999, { sort_order: 5 })).toBeNull();
    });
  });

  describe('toggleCheck', () => {
    test('flips false → true', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      expect(created.is_checked).toBe(false);
      const toggled = await repo.toggleCheck(created.id);
      expect(toggled?.is_checked).toBe(true);
    });

    test('flips true → false on the second call', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      await repo.toggleCheck(created.id);
      const toggledBack = await repo.toggleCheck(created.id);
      expect(toggledBack?.is_checked).toBe(false);
    });

    test('returns null when id does not exist', async () => {
      expect(await repo.toggleCheck(9999)).toBeNull();
    });
  });

  describe('archive / restore', () => {
    test('archive sets archived_at', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      const archived = await repo.archive(created.id);
      expect(archived?.archived_at).not.toBeNull();
    });

    test('archive returns null when already archived', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      await repo.archive(created.id);
      expect(await repo.archive(created.id)).toBeNull();
    });

    test('restore clears archived_at', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      await repo.archive(created.id);
      const restored = await repo.restore(created.id);
      expect(restored?.archived_at).toBeNull();
    });
  });

  describe('remove', () => {
    test('hard-deletes and returns true', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      expect(await repo.remove(created.id)).toBe(true);
      expect(await repo.findById(created.id)).toBeNull();
    });

    test('returns false when id does not exist', async () => {
      expect(await repo.remove(9999)).toBe(false);
    });
  });

  describe('FK behavior', () => {
    test('deleting parent trip cascades to its items (ON DELETE CASCADE)', async () => {
      const created = await repo.create(tripId, { good_id: goodId });
      await db.delete(trips).where(eq(trips.id, tripId));
      expect(await repo.findById(created.id)).toBeNull();
    });

    test('deleting a referenced good throws (ON DELETE RESTRICT)', async () => {
      await repo.create(tripId, { good_id: goodId });
      expect(() => db.delete(goods).where(eq(goods.id, goodId)).run()).toThrow();
    });
  });
});
