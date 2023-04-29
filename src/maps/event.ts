import { Event } from '@/models'
import { EventRequest, EventResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapEventResponseToEvent: MapFunction<EventResponse, Event> = function(source) {
  return new Event({
    eventId: source._id.toString(),
    contactUserId: source.contactUserId,
    name: source.name,
    description: source.description,
    image: this.map('ImageResponse', source.image, 'Image'),
    location: source.location,
    clubId: source.clubId,
    start: this.map('String', source.start, 'Date'),
    end: this.map('String', source.end, 'Date'),
    votingStart: this.map('String', source.votingStart, 'Date'),
    votingEnd: this.map('String', source.votingEnd, 'Date'),
    mustBePresentToWin: source.mustBePresentToWin,
    maxCapacity: source.maxCapacity,
    stripePriceId: source.stripePriceId,
    preRegistration: source.preRegistration,
    preRegistrationStripePriceId: source.preRegistrationStripePriceId,
    preRegistrationUnpaid: source.preRegistrationUnpaid,
    ballotCount: source.ballotCount,
    canVoteForSelf: source.canVoteForSelf,
    driverSelfCategorization: source.driverSelfCategorization,
    maxSelfCategorization: source.maxSelfCategorization,
    stripeCrossProductIds: source.stripeCrossProductIds ?? [],
    images: source.images ? this.map('ImageResponse', source.images, 'Image') : [],
    isDraft: source.isDraft,
  })
}

export const mapEventToEventRequest: MapFunction<Event, EventRequest> = function(source) {
  return {
    eventId: source.eventId,
    contactUserId: source.contactUserId,
    name: source.name,
    description: source.description,
    image: undefined,
    location: source.location,
    clubId: source.clubId,
    start: this.map('Date', source.start, 'String'),
    end: this.map('Date', source.end, 'String'),
    votingStart: this.map('Date', source.votingStart, 'String'),
    votingEnd: this.map('Date', source.votingEnd, 'String'),
    mustBePresentToWin: source.mustBePresentToWin,
    maxCapacity: source.maxCapacity,
    stripePriceId: source.stripePriceId,
    preRegistration: source.preRegistration,
    preRegistrationStripePriceId: source.preRegistrationStripePriceId,
    preRegistrationUnpaid: source.preRegistrationUnpaid,
    ballotCount: source.ballotCount,
    canVoteForSelf: source.canVoteForSelf,
    driverSelfCategorization: source.driverSelfCategorization,
    maxSelfCategorization: source.maxSelfCategorization,
    stripeCrossProductIds: source.stripeCrossProductIds,
    isDraft: source.isDraft,
  }
}