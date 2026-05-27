import { and, asc, eq, isNull, sql, type SQL } from 'drizzle-orm';
import { Database } from '@/db/client';
import { tripItems, TripItemInsert } from '@/db/models';
import { TripItem, toTripItem } from '../entities';
import { CreateTripItemInput, UpdateTripItemInput } from '../schemas';

export interface ListTripItemsOptions {
  tripId?: number;
  includeArchived?: boolean;
  isChecked?: boolean;
}

export const createTripItemRepo = (db: Database) => ({
  async create(tripId: number, input: CreateTripItemInput): Promise<TripItem> {
    const [row] = await db
      .insert(tripItems)
      .values({
        trip_id: tripId,
        good_id: input.good_id,
        planned_quantity: input.planned_quantity ?? 0,
        planned_unit_price: input.planned_unit_price ?? 0,
        notes: input.notes ?? null,
      })
      .returning();
    return toTripItem(row);
  },

  async findById(id: number): Promise<TripItem | null> {
    const [row] = await db.select().from(tripItems).where(eq(tripItems.id, id)).limit(1);
    return row ? toTripItem(row) : null;
  },

  async list({
    tripId,
    includeArchived = false,
    isChecked,
  }: ListTripItemsOptions = {}): Promise<TripItem[]> {
    const conditions: SQL[] = [];
    if (tripId !== undefined) conditions.push(eq(tripItems.trip_id, tripId));
    if (!includeArchived) conditions.push(isNull(tripItems.archived_at));
    if (isChecked !== undefined) conditions.push(eq(tripItems.is_checked, isChecked));

    const rows = await db
      .select()
      .from(tripItems)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(tripItems.sort_order), asc(tripItems.id));
    return rows.map(toTripItem);
  },

  async update(id: number, input: UpdateTripItemInput): Promise<TripItem | null> {
    const patch: Partial<TripItemInsert> = { updated_at: new Date() };
    if (input.planned_quantity !== undefined) patch.planned_quantity = input.planned_quantity ?? 0;
    if (input.planned_unit_price !== undefined) {
      patch.planned_unit_price = input.planned_unit_price ?? 0;
    }
    if (input.actual_quantity !== undefined) patch.actual_quantity = input.actual_quantity ?? 0;
    if (input.actual_unit_price !== undefined) {
      patch.actual_unit_price = input.actual_unit_price ?? 0;
    }
    if (input.is_checked !== undefined) patch.is_checked = input.is_checked;
    if (input.sort_order !== undefined) patch.sort_order = input.sort_order;
    if (input.notes !== undefined) patch.notes = input.notes ?? null;

    const [row] = await db.update(tripItems).set(patch).where(eq(tripItems.id, id)).returning();
    return row ? toTripItem(row) : null;
  },

  async toggleCheck(id: number): Promise<TripItem | null> {
    const [row] = await db
      .update(tripItems)
      .set({ is_checked: sql`NOT ${tripItems.is_checked}`, updated_at: new Date() })
      .where(eq(tripItems.id, id))
      .returning();
    return row ? toTripItem(row) : null;
  },

  async archive(id: number): Promise<TripItem | null> {
    const now = new Date();
    const [row] = await db
      .update(tripItems)
      .set({ archived_at: now, updated_at: now })
      .where(and(eq(tripItems.id, id), isNull(tripItems.archived_at)))
      .returning();
    return row ? toTripItem(row) : null;
  },

  async restore(id: number): Promise<TripItem | null> {
    const [row] = await db
      .update(tripItems)
      .set({ archived_at: null, updated_at: new Date() })
      .where(eq(tripItems.id, id))
      .returning();
    return row ? toTripItem(row) : null;
  },

  async remove(id: number): Promise<boolean> {
    const result = await db
      .delete(tripItems)
      .where(eq(tripItems.id, id))
      .returning({ id: tripItems.id });
    return result.length > 0;
  },
});

export type TripItemRepo = ReturnType<typeof createTripItemRepo>;
