import { isFuture, isSameDay, isWithinInterval } from 'date-fns'
import { Image } from '@/models/image'
import { Location } from '@/models/location'

export interface IEvent {
  eventId: string,
  contactUserId?: string,
  name: string,
  description: string,
  eventLogo?: Image,
  location: Location,
  clubId: string,
  start: Date,
  end: Date,
  votingStart?: Date,
  votingEnd?: Date,
  maxCapacity?: number,
  currentCapacity?: number,
  stripePriceId?: string,
  preRegistration?: boolean,
  preRegistrationStripePriceId?: string,
  preRegistrationUnpaid?: boolean,
  ballotCount?: number,
  canVoteForSelf?: boolean,
  driverSelfCategorization?: boolean,
  maxSelfCategorization?: number,
  stripeCrossProductIds: string[],
  isDraft?: boolean,
}

export class Event implements IEvent {
  public readonly eventId: string
  public contactUserId?: string
  public name: string
  public description: string
  public eventLogo?: Image
  public location: Location
  public clubId: string
  public start: Date
  public end: Date
  public votingStart?: Date
  public votingEnd?: Date
  public maxCapacity: number
  public currentCapacity: number
  public stripePriceId?: string
  public preRegistration?: boolean
  public preRegistrationStripePriceId?: string
  public preRegistrationUnpaid?: boolean
  public ballotCount?: number
  public canVoteForSelf?: boolean
  public driverSelfCategorization?: boolean
  public maxSelfCategorization: number
  public stripeCrossProductIds: string[]
  public isDraft?: boolean

  public constructor(event: IEvent) {
    this.eventId = event.eventId
    this.contactUserId = event.contactUserId
    this.name = event.name
    this.description = event.description
    this.eventLogo = event.eventLogo
    this.location = event.location
    this.clubId = event.clubId
    this.start = event.start
    this.end = event.end
    this.votingStart = event.votingStart
    this.votingEnd = event.votingEnd
    this.maxCapacity = event.maxCapacity ?? Infinity
    this.stripePriceId = event.stripePriceId
    this.preRegistration = event.preRegistration
    this.preRegistrationStripePriceId = event.preRegistrationStripePriceId
    this.preRegistrationUnpaid = event.preRegistrationUnpaid
    this.ballotCount = event.ballotCount
    this.canVoteForSelf = event.canVoteForSelf
    this.driverSelfCategorization = event.driverSelfCategorization
    this.maxSelfCategorization = event.maxSelfCategorization ?? 1
    this.stripeCrossProductIds = event.stripeCrossProductIds
    this.isDraft = event.isDraft
    this.currentCapacity = event.currentCapacity ?? 0
  }

  public get isUpcoming(): boolean {
    return isFuture(this.end)
  }

  public get isToday(): boolean {
    return isSameDay(this.start, new Date())
  }

  public get isHappening(): boolean {
    const interval = { start: this.start, end: this.end }
    return isWithinInterval(new Date(), interval) || true
  }

  public get votingOpen(): boolean {
    const interval = {
      start: this.votingStart ?? this.start,
      end: this.votingEnd ?? this.end,
    }

    return isWithinInterval(new Date(), interval)
  }

  public get openSlots(): number {
    return this.maxCapacity - this.currentCapacity
  }

  public get hasCapacity(): boolean {
    return this.openSlots > 0
  }

  public get preregistrationOpen(): boolean {
    return !!this.preRegistration && this.isUpcoming && this.hasCapacity
  }
}