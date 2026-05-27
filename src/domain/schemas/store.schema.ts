import z from 'zod/v3'
import {
  optionalCurrencyCodeSchema,
  optionalNotes,
  requireName,
} from './helper'

export const CreateStoreInputSchema = z.object({
  name: requireName('Store name'),
  currency_code_override: optionalCurrencyCodeSchema,
  notes: optionalNotes,
})
export type CreateStoreInput = z.infer<typeof CreateStoreInputSchema>

export const UpdateStoreInputSchema = CreateStoreInputSchema.partial()
export type UpdateStoreInput = z.infer<typeof UpdateStoreInputSchema>
