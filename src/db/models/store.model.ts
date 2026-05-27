import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stores = sqliteTable(
  'stores',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    currency_code_override: text('currency_code_override'),
    notes: text('notes'),
    created_at: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updated_at: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    archived_at: integer('archived_at', { mode: 'timestamp_ms' }),
  },
  (table) => [index('stores_name_idx').on(table.name)],
);

export type StoreRow = typeof stores.$inferSelect;
export type StoreInsert = typeof stores.$inferInsert;
