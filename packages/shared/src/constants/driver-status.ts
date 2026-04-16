/**
 * Driver status values.
 *
 * Status is not stored on the row — it is derived from the registration state
 * via `deriveDriverStatus`. A driver with no registration is "unregistered",
 * one with a registration but no carId is "registered", and one with a carId
 * assigned at check-in is "checked-in".
 */
export const DRIVER_STATUS = {
  UNREGISTERED: 'unregistered',
  REGISTERED: 'registered',
  CHECKED_IN: 'checked-in',
} as const;

export type DriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export const DRIVER_STATUS_VALUES: DriverStatus[] = Object.values(DRIVER_STATUS);

/**
 * Minimal fields from a registration row required to derive driver status.
 */
export type DerivableRegistration = {
  carId: number | null;
} | null;

/**
 * Derives the driver status from a registration record (or lack thereof).
 *
 * - null registration -> unregistered
 * - registration without carId -> registered
 * - registration with carId -> checked-in
 */
export function deriveDriverStatus(registration: DerivableRegistration): DriverStatus {
  if (!registration) {
    return DRIVER_STATUS.UNREGISTERED;
  }
  if (registration.carId === null) {
    return DRIVER_STATUS.REGISTERED;
  }
  return DRIVER_STATUS.CHECKED_IN;
}
