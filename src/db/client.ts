import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import * as schema from '@/db/models'
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite'
import migrations from './migrations/migrations'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { seedIfNeeded } from './seeder'

export type Database = ExpoSQLiteDatabase<typeof schema>

let sqliteInstance: SQLiteDatabase | null = null
let dbInstance: Database | null = null

const DB_NAME = 'trip_cart.db'

export async function initDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance
  sqliteInstance = await openDatabaseAsync(DB_NAME, {
    enableChangeListener: true,
  })

  await sqliteInstance.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;
  `)

  dbInstance = drizzle(sqliteInstance, { schema, logger: __DEV__ })

  await migrate(dbInstance, migrations)

  await seedIfNeeded(dbInstance)

  return dbInstance
}

