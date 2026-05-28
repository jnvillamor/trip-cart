import z from 'zod/v3';
import { currencyCodeSchema, optionalNotes, requireName } from './helper';
import { TRIP_STATUS_ENUM } from '../constants';

export const TripStatusSchema = z.nativeEnum(TRIP_STATUS_ENUM);
export type TripStatus = z.infer<typeof TripStatusSchema>;

export const CreateTripFormInputSchema = z.object({
  name: requireName('Trip name'),
  store_id: z.number().int().positive('Store is required'),
  planned_for: z.date().optional(),
  notes: optionalNotes,
});
export type CreateTripFormInput = z.infer<typeof CreateTripFormInputSchema>;

export const CreateTripInputSchema = CreateTripFormInputSchema.extend({
  resolved_currency_code: currencyCodeSchema,
});
export type CreateTripInput = z.infer<typeof CreateTripInputSchema>;

export const UpdateTripInputSchema = z.object({
  name: requireName('Trip name').optional(),
  store_id: z.number().int().positive('Store is required').optional(),
  resolved_currency_code: currencyCodeSchema.optional(),
  status: TripStatusSchema.optional(),
  planned_for: z.date().optional(),
  started_at: z.date().optional(),
  completed_at: z.date().optional(),
  notes: optionalNotes,
});
export type UpdateTripInput = z.infer<typeof UpdateTripInputSchema>;
