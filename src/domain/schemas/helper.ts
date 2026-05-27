import z from 'zod/v3'
import { parseMoneyToMinorUnits } from '../currency'

export const currencyCodeSchema = z
  .string()
  .length(3, 'Currency code must be at most 3 characters')
  .trim()
  .regex(/^[A-Z]+$/, 'Currency code must be uppercase letters only')

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Must be a valid hex color')

export const optionalCurrencyCodeSchema = currencyCodeSchema.optional()

export const requireName = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(255, `${label} must be at most 255 characters`)

export const optionalNotes = z
  .string()
  .trim()
  .max(1000, 'Notes must be at most 1000 characters')
  .optional()

export const optionalQuantity = z
  .number()
  .nonnegative('Value must be positive or zero')
  .finite('Must be a real number')
  .optional()

export const optionalMinorUnits = z
  .number()
  .int('Money must be stored as integer minor units')
  .nonnegative('Amount must be zero or positive')
  .nullable()
  .optional()

// Form-input money string → minor units. Null if blank.
// Factory so each form closes over its own currency code.
export const moneyFormFieldSchema = (currencyCode: string) =>
  z
    .string()
    .trim()
    .max(20)
    .transform((str, ctx) => {
      if (str === '') return null
      const minor = parseMoneyToMinorUnits(str, currencyCode)
      if (minor == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid amount, e.g. 19.99',
        })
        return z.NEVER
      }
      return minor
    })
