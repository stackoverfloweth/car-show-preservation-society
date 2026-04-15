/**
 * Event status values.
 *
 * Status is not stored on the row — it is derived from the event's dates and
 * presence via `deriveEventStatus`. Keep the string values stable since they
 * appear in the API as query filters.
 */
export const EVENT_STATUS = {
  DRAFT: 'draft',
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  VOTING: 'voting',
  COMPLETED: 'completed',
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export const EVENT_STATUS_VALUES: EventStatus[] = Object.values(EVENT_STATUS);

/**
 * Minimal fields from an event row required to derive its status. Dates may
 * come in as Date objects (from Drizzle) or ISO strings (from the API).
 */
export type DerivableEvent = {
  startDate: Date | string | null;
  endDate: Date | string | null;
  votingStart: Date | string | null;
  votingEnd: Date | string | null;
};

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

/**
 * Derives the status of an event from its dates.
 *
 * Ordering:
 *  - completed: current time is past `endDate`
 *  - voting: `votingStart` <= now <= `votingEnd` (takes precedence over active)
 *  - active: `startDate` <= now <= `endDate`
 *  - upcoming: now < `startDate`
 *  - draft: `startDate` not set
 *
 * Callers that also want the "draft with no registrations" case should pass
 * `hasRegistrations=false` and a far-future or null startDate.
 */
export function deriveEventStatus(
  event: DerivableEvent,
  opts: { now?: Date; hasRegistrations?: boolean } = {},
): EventStatus {
  const now = opts.now ?? new Date();
  const startDate = toDate(event.startDate);
  const endDate = toDate(event.endDate);
  const votingStart = toDate(event.votingStart);
  const votingEnd = toDate(event.votingEnd);

  if (!startDate) {
    return EVENT_STATUS.DRAFT;
  }

  if (endDate && now.getTime() > endDate.getTime()) {
    return EVENT_STATUS.COMPLETED;
  }

  if (
    votingStart &&
    votingEnd &&
    now.getTime() >= votingStart.getTime() &&
    now.getTime() <= votingEnd.getTime()
  ) {
    return EVENT_STATUS.VOTING;
  }

  if (
    endDate &&
    now.getTime() >= startDate.getTime() &&
    now.getTime() <= endDate.getTime()
  ) {
    return EVENT_STATUS.ACTIVE;
  }

  if (now.getTime() < startDate.getTime()) {
    // A future event with no registrations is a "draft" until someone engages.
    if (opts.hasRegistrations === false) {
      return EVENT_STATUS.DRAFT;
    }
    return EVENT_STATUS.UPCOMING;
  }

  return EVENT_STATUS.DRAFT;
}
