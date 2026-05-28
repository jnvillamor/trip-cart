/**
 * JSON backup shape for export/import. All dates serialize to ISO strings;
 * numeric fields stay as-is. SCHEMA_VERSION must bump when this shape changes.
 */
import { z } from 'zod/v3';
import { Database, initDatabase } from '@/db/client';
import {
  categories as categoriesTable,
  goods as goodsTable,
  settings as settingsTable,
  stores as storesTable,
  trips as tripsTable,
  tripItems as tripItemsTable,
} from '@/db/models';
import { createCategoryRepo } from './repositories/category.repo';
import { createGoodRepo } from './repositories/good.repo';
import { createSettingsRepo } from './repositories/settings.repo';
import { createStoreRepo } from './repositories/store.repo';
import { createTripItemRepo } from './repositories/trip-item.repo';
import { createTripRepo } from './repositories/trip.repo';
import { SCHEMA_VERSION } from './version';

export const BackupSchema = z.object({
  schema_version: z.number(),
  exported_at: z.string(),
  settings: z.unknown().nullable(),
  stores: z.array(z.unknown()),
  categories: z.array(z.unknown()),
  goods: z.array(z.unknown()),
  trips: z.array(z.unknown()),
  trip_items: z.array(z.unknown()),
});
export type BackupPayload = z.infer<typeof BackupSchema>;

export async function exportBackup(db?: Database): Promise<BackupPayload> {
  const database = db ?? (await initDatabase());
  const [settings, stores, categories, goods, trips, tripItems] = await Promise.all([
    createSettingsRepo(database).get(),
    createStoreRepo(database).list({ includeArchived: true }),
    createCategoryRepo(database).list({ includeArchived: true }),
    createGoodRepo(database).list({ includeArchived: true }),
    createTripRepo(database).list({ includeArchived: true }),
    createTripItemRepo(database).list({ includeArchived: true }),
  ]);

  return {
    schema_version: SCHEMA_VERSION,
    exported_at: new Date().toISOString(),
    settings,
    stores,
    categories,
    goods,
    trips,
    trip_items: tripItems,
  };
}

/** Convert ISO date strings (anywhere in the parsed JSON) back to `Date`. */
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
export function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string' && ISO_RE.test(value)) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return value;
}

/**
 * Validate a parsed backup payload. Returns the typed payload or throws.
 * v1 migration runner is a no-op; future versions will rewrite older shapes here.
 */
export function validateBackup(raw: unknown): BackupPayload {
  const parsed = BackupSchema.parse(raw);
  if (parsed.schema_version !== SCHEMA_VERSION) {
    throw new Error(
      `Schema version mismatch (file ${parsed.schema_version} vs app ${SCHEMA_VERSION}). Update the app and try again.`,
    );
  }
  return parsed;
}

/**
 * Replace mode: wipe every row in dependency order then bulk-insert from the
 * backup. Settings row gets upserted via update.
 */
export async function replaceAllFromBackup(payload: BackupPayload, db?: Database) {
  const database = db ?? (await initDatabase());

  // Delete in FK-safe order
  await database.delete(tripItemsTable);
  await database.delete(tripsTable);
  await database.delete(goodsTable);
  await database.delete(categoriesTable);
  await database.delete(storesTable);

  if (payload.stores.length > 0) {
    await database.insert(storesTable).values(payload.stores as never);
  }
  if (payload.categories.length > 0) {
    await database.insert(categoriesTable).values(payload.categories as never);
  }
  if (payload.goods.length > 0) {
    await database.insert(goodsTable).values(payload.goods as never);
  }
  if (payload.trips.length > 0) {
    await database.insert(tripsTable).values(payload.trips as never);
  }
  if (payload.trip_items.length > 0) {
    await database.insert(tripItemsTable).values(payload.trip_items as never);
  }
  if (payload.settings && typeof payload.settings === 'object') {
    const repo = createSettingsRepo(database);
    const s = payload.settings as Record<string, unknown>;
    await repo.update({
      global_currency_code: (s.global_currency_code as string) ?? undefined,
      theme_mode: (s.theme_mode as never) ?? undefined,
      seed_color_hex: (s.seed_color_hex as string) ?? undefined,
    });
  }
}

export type BackupSummary = {
  stores: number;
  categories: number;
  goods: number;
  trips: number;
  trip_items: number;
  exported_at: string;
};

export function summarize(payload: BackupPayload): BackupSummary {
  return {
    stores: payload.stores.length,
    categories: payload.categories.length,
    goods: payload.goods.length,
    trips: payload.trips.length,
    trip_items: payload.trip_items.length,
    exported_at: payload.exported_at,
  };
}
