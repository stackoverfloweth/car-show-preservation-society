export interface IVotingCategory {
  votingCategoryId: string,
  eventId: string,
  name: string,
  description: string,
  maxCapacity?: number,
  currentCapacity?: number,
  driversOnly?: boolean,
  membersOnly?: boolean,
  automaticEntry?: boolean,
  featured?: boolean,
  stripePriceId?: string,
}

export class VotingCategory implements IVotingCategory {
  public readonly votingCategoryId: string
  public readonly eventId: string
  public name: string
  public description: string
  public maxCapacity?: number
  public currentCapacity: number
  public driversOnly?: boolean
  public membersOnly?: boolean
  public automaticEntry?: boolean
  public featured?: boolean
  public stripePriceId?: string

  public constructor(category: IVotingCategory) {
    this.votingCategoryId = category.votingCategoryId
    this.eventId = category.eventId
    this.name = category.name
    this.description = category.description
    this.maxCapacity = category.maxCapacity
    this.currentCapacity = category.currentCapacity ?? 0
    this.driversOnly = category.driversOnly
    this.membersOnly = category.membersOnly
    this.automaticEntry = category.automaticEntry
    this.featured = category.featured
    this.stripePriceId = category.stripePriceId
  }

  public get openSlots(): number {
    return this.maxCapacity ?? Infinity - this.currentCapacity
  }

  public get hasCapacity(): boolean {
    return this.openSlots > 0
  }
}