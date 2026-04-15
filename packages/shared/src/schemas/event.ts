import { z } from 'zod';
import { EVENT_STATUS_VALUES, type EventStatus } from '../constants/event-status';

export const eventLocationSchema = z.object({
  address: z.string().min(1).max(500),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type EventLocationInput = z.infer<typeof eventLocationSchema>;

/**
 * Base event fields shared between create and update. All fields except
 * `name` are optional so an event can be created as a rough draft and
 * filled in progressively.
 */
const eventFieldsSchema = z.object({
  name: z.string().min(1).max(200),
  contactUserId: z.string().min(1).optional(),
  location: eventLocationSchema.nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),

  votingStart: z.string().datetime().nullable().optional(),
  votingEnd: z.string().datetime().nullable().optional(),
  ballotCount: z.number().int().min(1).max(100).optional(),
  canVoteForSelf: z.boolean().optional(),
  driverSelfCategorization: z.boolean().optional(),
  maxSelfCategorization: z.number().int().min(0).nullable().optional(),

  maxCapacity: z.number().int().min(0).nullable().optional(),
  preRegistration: z.boolean().optional(),
  preRegistrationUnpaid: z.boolean().optional(),

  stripePriceId: z.string().nullable().optional(),
  preRegistrationStripePriceId: z.string().nullable().optional(),
  stripeCrossProductIds: z.array(z.string()).optional(),
});

type EventRefineInput = Partial<z.infer<typeof eventFieldsSchema>>;

const refineDates = (data: EventRefineInput, ctx: z.RefinementCtx) => {
  if (data.startDate && data.endDate) {
    if (new Date(data.startDate).getTime() >= new Date(data.endDate).getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'endDate must be after startDate',
      });
    }
  }
  if (data.votingStart && data.votingEnd) {
    if (new Date(data.votingStart).getTime() >= new Date(data.votingEnd).getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['votingEnd'],
        message: 'votingEnd must be after votingStart',
      });
    }
  }
  if (data.preRegistrationUnpaid === true && data.preRegistration === false) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['preRegistrationUnpaid'],
      message: 'preRegistrationUnpaid requires preRegistration to be enabled',
    });
  }
};

export const createEventSchema = eventFieldsSchema.superRefine(refineDates);
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = eventFieldsSchema.partial().superRefine(refineDates);
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const addEventImageSchema = z.object({
  source: z.string().url().max(2000),
});
export type AddEventImageInput = z.infer<typeof addEventImageSchema>;

export const listEventsQuerySchema = z
  .object({
    status: z.enum(EVENT_STATUS_VALUES as [EventStatus, ...EventStatus[]]).optional(),
    clubId: z.string().optional(),
    startDateFrom: z.string().datetime().optional(),
    startDateTo: z.string().datetime().optional(),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    radiusKm: z.coerce.number().min(0).max(20000).optional(),
  })
  .superRefine((data, ctx) => {
    const geoFields = [data.lat, data.lng, data.radiusKm];
    const provided = geoFields.filter((v) => v !== undefined).length;
    if (provided !== 0 && provided !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['lat'],
        message: 'lat, lng, and radiusKm must all be provided together',
      });
    }
  });
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;

export const eventImageResponseSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  source: z.string(),
  createdAt: z.string(),
});
export type EventImageResponse = z.infer<typeof eventImageResponseSchema>;

export const eventResponseSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  contactUserId: z.string(),
  name: z.string(),
  location: eventLocationSchema.nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),

  votingStart: z.string().nullable(),
  votingEnd: z.string().nullable(),
  ballotCount: z.number().int(),
  canVoteForSelf: z.boolean(),
  driverSelfCategorization: z.boolean(),
  maxSelfCategorization: z.number().int().nullable(),

  maxCapacity: z.number().int().nullable(),
  preRegistration: z.boolean(),
  preRegistrationUnpaid: z.boolean(),

  stripePriceId: z.string().nullable(),
  preRegistrationStripePriceId: z.string().nullable(),
  stripeCrossProductIds: z.array(z.string()),

  status: z.enum(EVENT_STATUS_VALUES as [EventStatus, ...EventStatus[]]),
  images: z.array(eventImageResponseSchema),
  distanceKm: z.number().optional(),

  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});
export type EventResponse = z.infer<typeof eventResponseSchema>;
