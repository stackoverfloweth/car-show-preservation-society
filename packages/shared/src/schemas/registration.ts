import { z } from 'zod';
import { DRIVER_STATUS_VALUES, type DriverStatus } from '../constants/driver-status';

/**
 * Pre-registration: authenticated driver self-service.
 * eventId comes from the URL param; vehicleId is optional (can be assigned later).
 */
export const preRegisterSchema = z.object({
  vehicleId: z.string().min(1).optional(),
});
export type PreRegisterInput = z.infer<typeof preRegisterSchema>;
export const PreRegisterSchema = preRegisterSchema;

/**
 * Gate registration: club member host-mode, supports anonymous walk-ups.
 */
export const gateRegisterSchema = z.object({
  vehicleId: z.string().min(1).optional(),
  driverEmail: z.string().email().optional(),
  driverPhone: z.string().min(1).max(30).optional(),
});
export type GateRegisterInput = z.infer<typeof gateRegisterSchema>;
export const GateRegisterSchema = gateRegisterSchema;

/**
 * Update registration: owner or event manager can update vehicleId.
 */
export const updateRegistrationSchema = z.object({
  vehicleId: z.string().min(1).nullable().optional(),
});
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
export const UpdateRegistrationSchema = updateRegistrationSchema;

/**
 * Query params for listing registrations.
 */
export const listRegistrationsQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});
export type ListRegistrationsQuery = z.infer<typeof listRegistrationsQuerySchema>;

/**
 * Registration API response shape.
 */
export const registrationResponseSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string().nullable(),
  vehicleId: z.string().nullable(),
  registrationCode: z.string(),
  registrationDate: z.string(),
  carId: z.number().int().nullable(),
  checkedInAt: z.string().nullable(),
  stripePaymentId: z.string().nullable(),
  driverStatus: z.enum(DRIVER_STATUS_VALUES as [DriverStatus, ...DriverStatus[]]),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});
export type RegistrationResponse = z.infer<typeof registrationResponseSchema>;
