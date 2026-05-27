import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { stores } from './store.model'
import { sql } from 'drizzle-orm'
import { TripStatus } from '@/domain/schemas/trip.schema'
import { TRIP_STATUS_ENUM } from '@/domain/constants'

export const trips = sqliteTable(
  'trips',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    store_id: integer('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'restrict' }),

    resolved_currency_code: text('resolved_currency_code').notNull(),
    status: text('status')
      .$type<TripStatus>()
      .notNull()
      .default(TRIP_STATUS_ENUM.PLANNED),
    notes: text('notes'),

    planned_for: integer('planned_for', { mode: 'timestamp_ms' }),
    started_at: integer('started_at', { mode: 'timestamp_ms' }),
    completed_at: integer('completed_at', { mode: 'timestamp_ms' }),

    created_at: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updated_at: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    archived_at: integer('archived_at', { mode: 'timestamp_ms' }),
  },
  (table) => [
    index('trips_store_idx').on(table.store_id),
    index('trips_status_idx').on(table.status),
    index('trips_completed_at_idx').on(table.completed_at),
  ],
)

export type TripRow = typeof trips.$inferSelect
export type TripInsert = typeof trips.$inferInsert
