import z from 'zod/v3'
import { currencyCodeSchema, hexColorSchema } from './helper'
import { THEME_MODE_ENUM } from '../constants'

export const ThemeModeEnum = z.nativeEnum(THEME_MODE_ENUM)
export type ThemeMode = z.infer<typeof ThemeModeEnum>

export const settingsUpdateSchema = z
  .object({
    global_currency_code: currencyCodeSchema.optional(),
    theme_mode: ThemeModeEnum.optional(),
    seed_color_hex: hexColorSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  })

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>
