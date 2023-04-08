import { BackgroundPosition } from '@/models/image'

export type ImageRequest = {
  src?: string,
  size?: string,
  position?: BackgroundPosition,
  caption?: string,
}