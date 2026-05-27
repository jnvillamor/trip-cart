import type Database from 'better-sqlite3';
import { Database as AppDatabase } from '@/db/client';
import { settings } from '@/db/models';
import { createSettingsRepo } from '@/domain/repositories/settings.repo';
import { THEME_MODE_ENUM } from '@/domain/constants';
import { makeTestDb } from './_setup';

describe('settings repo', () => {
  let db: AppDatabase;
  let sqlite: Database.Database;
  let repo: ReturnType<typeof createSettingsRepo>;

  const seedSettings = async () => {
    await db.insert(settings).values({ id: 1 });
  };

  beforeEach(() => {
    ({ db, sqlite } = makeTestDb());
    repo = createSettingsRepo(db);
  });

  afterEach(() => {
    sqlite.close();
  });

  describe('get', () => {
    test('returns null when settings row has not been seeded', async () => {
      expect(await repo.get()).toBeNull();
    });

    test('returns the singleton row with defaults', async () => {
      await seedSettings();
      const row = await repo.get();
      expect(row).toMatchObject({
        id: 1,
        global_currency_code: 'PHP',
        theme_mode: THEME_MODE_ENUM.SYSTEM,
        seed_color_hex: '#2E5C8A',
        schema_version: 1,
      });
      expect(row?.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    test('returns null when settings row does not exist', async () => {
      expect(await repo.update({ theme_mode: THEME_MODE_ENUM.DARK })).toBeNull();
    });

    test('patches only provided fields and leaves others untouched', async () => {
      await seedSettings();
      const updated = await repo.update({ theme_mode: THEME_MODE_ENUM.DARK });
      expect(updated).toMatchObject({
        id: 1,
        theme_mode: THEME_MODE_ENUM.DARK,
        global_currency_code: 'PHP',
        seed_color_hex: '#2E5C8A',
      });
    });

    test('updates all three patchable fields at once', async () => {
      await seedSettings();
      const updated = await repo.update({
        global_currency_code: 'USD',
        theme_mode: THEME_MODE_ENUM.LIGHT,
        seed_color_hex: '#FF0000',
      });
      expect(updated).toMatchObject({
        global_currency_code: 'USD',
        theme_mode: THEME_MODE_ENUM.LIGHT,
        seed_color_hex: '#FF0000',
      });
    });

    test('bumps updated_at on write', async () => {
      await seedSettings();
      const before = await repo.get();
      await new Promise((r) => setTimeout(r, 5));
      const after = await repo.update({ theme_mode: THEME_MODE_ENUM.DARK });
      expect(after?.updated_at.getTime()).toBeGreaterThanOrEqual(before!.updated_at.getTime());
    });
  });
});
