import z from 'zod/v3'
import { optionalNotes, requireName } from './helper'

export const CreateGoodInputSchema = z.object({
  name: requireName('Good name'),
  default_category_id: z.number().int().positive().optional(),
  default_unit: z
    .string()
    .trim()
    .max(20, 'Default unit must be at most 20 characters')
    .optional(),
  notes: optionalNotes,
})
export type CreateGoodInput = z.infer<typeof CreateGoodInputSchema>

export const UpdateGoodInputSchema = CreateGoodInputSchema.partial()
export type UpdateGoodInput = z.infer<typeof UpdateGoodInputSchema>
