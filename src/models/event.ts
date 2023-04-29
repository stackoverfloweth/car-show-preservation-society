import { isFuture, isPast as dateInPast, isSameDay, isWithinInterval, addHours, endOfDay, startOfDay } from 'date-fns'
import { ref } from 'vue'
import { IImage, Image } from '@/models/image'
import { Location } from '@/models/location'
import { mocker } from '@/services'

export const isToday = ref(false)
export const isHappening = ref(false)
export const votingOpen = ref(false)
export const isEnded = ref(false)

export interface IEvent {
  eventId: string,
  contactUserId?: string,
  name: string,
  description?: string,
  image?: IImage,
  location?: Location,
  clubId: string,
  start: Date,
  end: Date,
  votingStart?: Date,
  votingEnd?: Date,
  mustBePresentToWin?: boolean,
  maxCapacity?: number,
  stripePriceId?: string,
  preRegistration?: boolean,
  preRegistrationStripePriceId?: string,
  preRegistrationUnpaid?: boolean,
  ballotCount?: number,
  canVoteForSelf?: boolean,
  driverSelfCategorization?: boolean,
  maxSelfCategorization?: number,
  stripeCrossProductIds: string[],
  images?: IImage[],
  isDraft?: boolean,
}

export class Event implements IEvent {
  public readonly eventId: string
  public contactUserId?: string
  public name: string
  public description?: string
  public image?: Image
  public location?: Location
  public clubId: string
  public start: Date
  public end: Date
  public votingStart?: Date
  public votingEnd?: Date
  public maxCapacity?: number
  public stripePriceId?: string
  public preRegistration?: boolean
  public preRegistrationStripePriceId?: string
  public preRegistrationUnpaid?: boolean
  public ballotCount?: number
  public canVoteForSelf?: boolean
  public driverSelfCategorization?: boolean
  public maxSelfCategorization: number
  public stripeCrossProductIds: string[]
  public images: Image[]
  public isDraft?: boolean

  public constructor(event: IEvent) {
    this.eventId = event.eventId
    this.contactUserId = event.contactUserId
    this.name = event.name
    this.description = event.description
    this.image = event.image ? new Image(event.image) : undefined
    this.location = event.location
    this.clubId = event.clubId
    this.start = event.start
    this.end = event.end
    this.votingStart = event.votingStart
    this.votingEnd = event.votingEnd
    this.maxCapacity = event.maxCapacity
    this.stripePriceId = event.stripePriceId
    this.preRegistration = event.preRegistration
    this.preRegistrationStripePriceId = event.preRegistrationStripePriceId
    this.preRegistrationUnpaid = event.preRegistrationUnpaid
    this.ballotCount = event.ballotCount
    this.canVoteForSelf = event.canVoteForSelf
    this.driverSelfCategorization = event.driverSelfCategorization
    this.maxSelfCategorization = event.maxSelfCategorization ?? 1
    this.stripeCrossProductIds = event.stripeCrossProductIds
    this.images = (event.images ?? []).map(image => new Image(image))
    this.isDraft = event.isDraft

    if (isToday.value) {
      this.start = mocker.create('date', [new Date(), endOfDay(new Date())])
      this.end = endOfDay(this.start)
    }

    if (isHappening.value) {
      this.start = startOfDay(this.start)
      this.votingStart = addHours(new Date(), 3)
    }

    if (votingOpen.value) {
      this.votingStart = addHours(new Date(), -1)
    }

    if (isEnded.value) {
      this.end = addHours(new Date(), -1)
    }
  }

  public get isUpcoming(): boolean {
    return isFuture(this.start)
  }

  public get isPast(): boolean {
    return dateInPast(this.end)
  }

  public get isToday(): boolean {
    return !this.isPast && isSameDay(this.start, new Date())
  }

  public get isHappening(): boolean {
    const interval = { start: this.start, end: this.end }
    return isWithinInterval(new Date(), interval)
  }

  public get votingOpen(): boolean {
    const interval = {
      start: this.votingStart ?? this.start,
      end: this.votingEnd ?? this.end,
    }

    return isWithinInterval(new Date(), interval)
  }

  public get preregistrationOpen(): boolean {
    return !!this.preRegistration && this.isUpcoming
  }

  public get registrationOpen(): boolean {
    return isFuture(this.votingStart ?? this.start)
  }
}