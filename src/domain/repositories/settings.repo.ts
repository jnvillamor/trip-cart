import { eq } from 'drizzle-orm';
import { Database } from '@/db/client';
import { settings, SettingsInsert } from '@/db/models';
import { Settings } from '../entities';
import { SettingsUpdateInput } from '../schemas';

const SETTINGS_ID = 1;

export const createSettingsRepo = (db: Database) => ({
  async get(): Promise<Settings | null> {
    const [row] = await db.select().from(settings).where(eq(settings.id, SETTINGS_ID)).limit(1);
    return row ?? null;
  },

  async update(input: SettingsUpdateInput): Promise<Settings | null> {
    const patch: Partial<SettingsInsert> = { updated_at: new Date() };
    if (input.global_currency_code !== undefined) patch.global_currency_code = input.global_currency_code;
    if (input.theme_mode !== undefined) patch.theme_mode = input.theme_mode;
    if (input.seed_color_hex !== undefined) patch.seed_color_hex = input.seed_color_hex;

    const [row] = await db
      .update(settings)
      .set(patch)
      .where(eq(settings.id, SETTINGS_ID))
      .returning();
    return row ?? null;
  },
});

export type SettingsRepo = ReturnType<typeof createSettingsRepo>;
