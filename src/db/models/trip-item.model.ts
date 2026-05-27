import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { trips } from './trip.model';
import { goods } from './good.model';
import { sql } from 'drizzle-orm';

export const tripItems = sqliteTable(
  'trip_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    trip_id: integer('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    good_id: integer('good_id')
      .notNull()
      .references(() => goods.id, { onDelete: 'restrict' }),

    category_id_snapshot: integer('category_id_snapshot'),
    unit_snapshot: integer('unit_snapshot'),

    planned_quantity: real('planned_quantity').default(0),
    actual_quantity: real('actual_quantity').default(0),

    planned_unit_price: real('planned_unit_price').default(0),
    actual_unit_price: real('actual_unit_price').default(0),

    is_checked: integer('is_checked', { mode: 'boolean' }).notNull().default(false),
    sort_order: integer('sort_order').notNull().default(0),
    notes: text('notes'),

    created_at: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updated_at: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    archived_at: integer('archived_at', { mode: 'timestamp_ms' }),
  },
  (table) => [
    index('trip_items_trip_sort_idx').on(table.trip_id, table.sort_order),
    index('trip_items_good_idx').on(table.good_id),
  ],
);

export type TripItemRow = typeof tripItems.$inferSelect;
export type TripItemInsert = typeof tripItems.$inferInsert;
