import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { categories } from './category.model'
import { sql } from 'drizzle-orm'

export const goods = sqliteTable(
  'goods',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    default_category_id: integer('default_category_id').references(
      () => categories.id,
      { onDelete: 'set null' },
    ),
    default_unit: text('default_unit'),
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
    index('goods_name_idx').on(table.name),
    index('goods_category_idx').on(table.default_category_id),
  ],
)

export type GoodRow = typeof goods.$inferSelect
export type GoodInsert = typeof goods.$inferInsert