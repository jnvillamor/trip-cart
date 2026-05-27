import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/db/models';
import { Database as AppDatabase } from '@/db/client';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../../db/migrations');

export function makeTestDb(): { db: AppDatabase; sqlite: Database.Database } {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');

  const migrationFiles = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of migrationFiles) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    for (const stmt of sql.split('--> statement-breakpoint')) {
      const trimmed = stmt.trim();
      if (trimmed) sqlite.exec(trimmed);
    }
  }

  const db = drizzle(sqlite, { schema }) as unknown as AppDatabase;
  return { db, sqlite };
}
