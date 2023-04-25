import { Image } from '@/models/image'

export type ClubVisibility = 'public' | 'private'

export interface IClub {
  clubId: string,
  name: string,
  description?: string,
  contactUserId?: string,
  stripeCustomerId?: string,
  clubLogo?: Image,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
}

export class Club implements IClub {
  public readonly clubId: string
  public name: string
  public description?: string
  public contactUserId?: string
  public stripeCustomerId?: string
  public clubLogo?: Image
  public joinableByAnyone?: boolean
  public joinableByApplication?: boolean

  public constructor(club: IClub) {
    this.clubId = club.clubId
    this.name = club.name
    this.description = club.description
    this.contactUserId = club.contactUserId
    this.stripeCustomerId = club.stripeCustomerId
    this.clubLogo = club.clubLogo
    this.joinableByAnyone = club.joinableByAnyone
    this.joinableByApplication = club.joinableByApplication
  }

  public get visibility(): ClubVisibility {
    return this.joinableByAnyone || this.joinableByApplication ? 'public' : 'private'
  }
}