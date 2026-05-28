import { and, desc, eq, inArray, isNull, sql, type SQL } from 'drizzle-orm';
import { Database } from '@/db/client';
import { trips, TripInsert } from '@/db/models';
import { Trip, toTrip, toTripInsert } from '../entities';
import { CreateTripInput, TripStatus, UpdateTripInput } from '../schemas';
import { TRIP_STATUS_ENUM } from '../constants';

export interface ListTripsOptions {
  includeArchived?: boolean;
  nameQuery?: string;
  storeId?: number;
  statuses?: TripStatus[];
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export const createTripRepo = (db: Database) => ({
  async create(input: CreateTripInput): Promise<Trip> {
    const [row] = await db.insert(trips).values(toTripInsert(input)).returning();
    return toTrip(row);
  },

  async findById(id: number): Promise<Trip | null> {
    const [row] = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
    return row ? toTrip(row) : null;
  },

  async list({
    includeArchived = false,
    nameQuery,
    storeId,
    statuses,
  }: ListTripsOptions = {}): Promise<Trip[]> {
    const conditions: SQL[] = [];
    if (!includeArchived) conditions.push(isNull(trips.archived_at));
    if (storeId !== undefined) conditions.push(eq(trips.store_id, storeId));
    if (statuses && statuses.length > 0) conditions.push(inArray(trips.status, statuses));
    const trimmed = nameQuery?.trim();
    if (trimmed) {
      conditions.push(sql`${trips.name} LIKE ${`%${escapeLike(trimmed)}%`} ESCAPE '\\'`);
    }

    const rows = await db
      .select()
      .from(trips)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(trips.created_at), desc(trips.id));
    return rows.map(toTrip);
  },

  async update(id: number, input: UpdateTripInput): Promise<Trip | null> {
    const patch: Partial<TripInsert> = { updated_at: new Date() };
    if (input.name !== undefined) patch.name = input.name;
    if (input.store_id !== undefined) patch.store_id = input.store_id;
    if (input.resolved_currency_code !== undefined) {
      patch.resolved_currency_code = input.resolved_currency_code;
    }
    if (input.status !== undefined) patch.status = input.status;
    if (input.planned_for !== undefined) patch.planned_for = input.planned_for ?? null;
    if (input.started_at !== undefined) patch.started_at = input.started_at ?? null;
    if (input.completed_at !== undefined) patch.completed_at = input.completed_at ?? null;
    if (input.notes !== undefined) patch.notes = input.notes ?? null;

    const [row] = await db.update(trips).set(patch).where(eq(trips.id, id)).returning();
    return row ? toTrip(row) : null;
  },

  async start(id: number, startedAt: Date = new Date()): Promise<Trip | null> {
    return this.update(id, {
      status: TRIP_STATUS_ENUM.IN_PROGRESS,
      started_at: startedAt,
    });
  },

  async complete(id: number, completedAt: Date = new Date()): Promise<Trip | null> {
    return this.update(id, {
      status: TRIP_STATUS_ENUM.COMPLETED,
      completed_at: completedAt,
    });
  },

  async archive(id: number): Promise<Trip | null> {
    const now = new Date();
    const [row] = await db
      .update(trips)
      .set({ archived_at: now, updated_at: now })
      .where(and(eq(trips.id, id), isNull(trips.archived_at)))
      .returning();
    return row ? toTrip(row) : null;
  },

  async restore(id: number): Promise<Trip | null> {
    const [row] = await db
      .update(trips)
      .set({ archived_at: null, updated_at: new Date() })
      .where(eq(trips.id, id))
      .returning();
    return row ? toTrip(row) : null;
  },

  async remove(id: number): Promise<boolean> {
    const result = await db.delete(trips).where(eq(trips.id, id)).returning({ id: trips.id });
    return result.length > 0;
  },
});

export type TripRepo = ReturnType<typeof createTripRepo>;
