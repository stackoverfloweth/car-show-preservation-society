import { Image } from '@/models/image'

export type ImageResults = {
  images: Image[],
  hasMore: boolean,
}