import z from 'zod/v3'
import { moneyFormFieldSchema, optionalMinorUnits, optionalNotes, optionalQuantity } from './helper'

export const CreateTripItemInputSchema = z.object({
  good_id: z.number().int().positive('Good is required'),
  planned_quantity: optionalQuantity,
  planned_unit_price: optionalMinorUnits,
  notes: optionalNotes,
})
export type CreateTripItemInput = z.infer<typeof CreateTripItemInputSchema>

export const UpdateTripItemInputSchema = (currency_code: string) => z.object({
  planned_quantity: optionalQuantity,
  planned_unit_price: moneyFormFieldSchema(currency_code),

  actual_quantity: optionalQuantity,
  actual_unit_price: moneyFormFieldSchema(currency_code),

  isChecked: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),

  notes: optionalNotes,
})
export type UpdateTripItemInput = z.infer<ReturnType<typeof UpdateTripItemInputSchema>>