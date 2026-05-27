import { sql } from 'drizzle-orm'
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable(
  'categories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    /** Material icon identifier */
    icon_name: text('icon_name'),
    color_hex: text('color_hex'),
    created_at: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updated_at: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    archived_at: integer('archived_at', { mode: 'timestamp_ms' }),
  },
  (table) => [uniqueIndex('categories_name_idx').on(table.name)],
)

export type CategoryRow = typeof categories.$inferSelect
export type CategoryInsert = typeof categories.$inferInsert