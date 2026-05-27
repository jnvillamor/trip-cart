import { THEME_MODE_ENUM } from '@/domain/constants'
import { Database } from './client'
import * as schema from '@/db/models'

const DEFAULT_CATEGORIES: ReadonlyArray<{
  name: string
  icon_name: string
  color_hex: string
}> = [
  { name: 'Produce', icon_name: 'eco', color_hex: '#4CAF50' },
  { name: 'Dairy', icon_name: 'icecream', color_hex: '#03A9F4' },
  { name: 'Bakery', icon_name: 'bakery_dining', color_hex: '#FF9800' },
  { name: 'Meat & Seafood', icon_name: 'set_meal', color_hex: '#E91E63' },
  { name: 'Frozen', icon_name: 'ac_unit', color_hex: '#00BCD4' },
  { name: 'Beverages', icon_name: 'local_drink', color_hex: '#9C27B0' },
  { name: 'Snacks', icon_name: 'cookie', color_hex: '#FFC107' },
  { name: 'Pantry', icon_name: 'kitchen', color_hex: '#795548' },
  { name: 'Household', icon_name: 'home', color_hex: '#607D8B' },
  { name: 'Personal Care', icon_name: 'soap', color_hex: '#FF5722' },
  { name: 'Other', icon_name: 'category', color_hex: '#9E9E9E' },
]

export async function seedIfNeeded(db: Database): Promise<void> {
  await db.transaction(async (tx) => {
    // Settings is a singleton row at id=1.
    await tx
      .insert(schema.settings)
      .values({
        id: 1,
        global_currency_code: 'PHP',
        theme_mode: THEME_MODE_ENUM.SYSTEM,
        schema_version: 1,
        seed_color_hex: '#2E5C8A',
      })
      .onConflictDoNothing()

    for (const category of DEFAULT_CATEGORIES) {
      await tx.insert(schema.categories).values(category).onConflictDoNothing()
    }
  })
}
