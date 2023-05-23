import { Image } from '@/models/image'
import { Location } from '@/models/location'

export interface IUser {
  userId: string,
  identityId: string,
  emailAddress?: string,
  phoneNumber?: string,
  firstName?: string,
  lastName?: string,
  location?: Location,
  image?: Image,
  stripeCustomerId?: string,
  hideEmailAddress?: boolean,
  hidePhoneNumber?: boolean,
  hideLocation?: boolean,
  displayNameOverride?: string,
}

export class User implements IUser {
  public readonly userId: string
  public readonly identityId: string
  public emailAddress?: string
  public phoneNumber?: string
  public firstName?: string
  public lastName?: string
  public location?: Location
  public image?: Image
  public stripeCustomerId?: string
  public hideEmailAddress?: boolean
  public hidePhoneNumber?: boolean
  public hideLocation?: boolean
  public displayNameOverride?: string

  public constructor(user: IUser) {
    this.userId = user.userId
    this.identityId = user.identityId
    this.emailAddress = user.emailAddress
    this.phoneNumber = user.phoneNumber
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.location = user.location
    this.image = user.image
    this.stripeCustomerId = user.stripeCustomerId
    this.hideEmailAddress = user.hideEmailAddress
    this.hidePhoneNumber = user.hidePhoneNumber
    this.hideLocation = user.hideLocation
    this.displayNameOverride = user.displayNameOverride
  }

  public get displayName(): string {
    return this.displayNameOverride ?? `${this.firstName} ${this.lastName}`
  }
}