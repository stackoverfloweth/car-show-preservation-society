import { IImage, Image } from '@/models/image'

export type ClubVisibility = 'public' | 'private'

export interface IClub {
  clubId: string,
  name: string,
  description?: string,
  contactUserId?: string,
  stripeCustomerId?: string,
  image?: IImage,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
  images: IImage[],
}

export class Club implements IClub {
  public readonly clubId: string
  public name: string
  public description?: string
  public contactUserId?: string
  public stripeCustomerId?: string
  public image?: Image
  public joinableByAnyone?: boolean
  public joinableByApplication?: boolean
  public images: Image[]

  public constructor(club: IClub) {
    this.clubId = club.clubId
    this.name = club.name
    this.description = club.description
    this.contactUserId = club.contactUserId
    this.stripeCustomerId = club.stripeCustomerId
    this.image = club.image ? new Image(club.image) : undefined
    this.joinableByAnyone = club.joinableByAnyone
    this.joinableByApplication = club.joinableByApplication
    this.images = club.images.map(image => new Image(image))
  }

  public get visibility(): ClubVisibility {
    return this.joinableByAnyone || this.joinableByApplication ? 'public' : 'private'
  }
}