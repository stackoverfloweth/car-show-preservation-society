import { ObjectId } from 'mongodb'
import { env } from '@/utilities'

export type BackgroundPosition = string | [number, number]

export interface IImage {
  _id: ObjectId,
  cloudinaryId: string,
  version: number,
  width: number,
  height: number,
  format: string,
  resource: string,
  bytes: number,
  type: string,
  size?: string,
  position?: BackgroundPosition,
  caption?: string,
}

export class Image implements IImage {
  public readonly _id: ObjectId
  public readonly cloudinaryId: string
  public version: number
  public width: number
  public height: number
  public format: string
  public resource: string
  public bytes: number
  public type: string
  public size?: string
  public position?: BackgroundPosition
  public caption?: string

  public constructor(image: IImage) {
    this._id = image._id
    this.cloudinaryId = image.cloudinaryId
    this.version = image.version
    this.width = image.width
    this.height = image.height
    this.format = image.format
    this.resource = image.resource
    this.bytes = image.bytes
    this.type = image.type
    this.size = image.size
    this.position = image.position
    this.caption = image.caption
  }

  public get imageId(): string {
    return this._id.toString()
  }

  public get src(): string {
    return `https://res.cloudinary.com/${env().cloudinaryName}/${this.resource}/${this.type}/v${this.version}/${this.cloudinaryId}.${this.format}`
  }
}