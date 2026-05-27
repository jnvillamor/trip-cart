import z from 'zod/v3'
import { hexColorSchema, requireName } from './helper'

export const CreateCategoryInputSchema = z.object({
  name: requireName('Category name'),
  iconName: z
    .string()
    .trim()
    .max(50, 'Icon name must be at most 50 characters')
    .optional(),
  colorHex: hexColorSchema.optional(),
})
export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>

export const UpdateCategoryInputSchema = CreateCategoryInputSchema.partial()
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInputSchema>
