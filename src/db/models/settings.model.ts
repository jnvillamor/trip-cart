import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { ThemeMode } from '@/domain/schemas/settings.schema';
import { THEME_MODE_ENUM } from '@/domain/constants';

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey(),
  global_currency_code: text('global_currency_code').notNull().default('PHP'),
  theme_mode: text('theme_mode').$type<ThemeMode>().notNull().default(THEME_MODE_ENUM.SYSTEM),
  seed_color_hex: text('seed_color_hex').notNull().default('#2E5C8A'),
  schema_version: integer('schema_version').notNull().default(1),
  updated_at: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type SettingsRow = typeof settings.$inferSelect;
export type SettingsInsert = typeof settings.$inferInsert;
