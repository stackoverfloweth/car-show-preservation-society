import { ObjectId } from 'mongodb'
import { IImage, Image } from '@/models/image'

export type ClubVisibility = 'public' | 'private'

export interface IClub {
  _id: ObjectId,
  name: string,
  description?: string,
  contactUserId?: string,
  stripeCustomerId?: string,
  image?: IImage,
  joinableByAnyone?: boolean,
  joinableByApplication?: boolean,
  images?: IImage[],
  isDeleted?: boolean,
}

export class Club implements IClub {
  public readonly _id: ObjectId
  public name: string
  public description?: string
  public contactUserId?: string
  public stripeCustomerId?: string
  public image?: Image
  public joinableByAnyone?: boolean
  public joinableByApplication?: boolean
  public images: Image[]
  public isDeleted?: boolean

  public constructor(club: IClub) {
    this._id = club._id
    this.name = club.name
    this.description = club.description
    this.contactUserId = club.contactUserId
    this.stripeCustomerId = club.stripeCustomerId
    this.image = club.image ? new Image(club.image) : undefined
    this.joinableByAnyone = club.joinableByAnyone
    this.joinableByApplication = club.joinableByApplication
    this.images = (club.images ?? []).map(image => new Image(image))
    this.isDeleted = club.isDeleted
  }

  public get clubId(): string {
    return this._id.toString()
  }

  public get visibility(): ClubVisibility {
    return this.joinableByAnyone || this.joinableByApplication ? 'public' : 'private'
  }
}