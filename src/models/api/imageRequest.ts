import { BackgroundPosition } from '@/models/image'

export type ImageRequest = {
  file: string,
  size?: string,
  position?: BackgroundPosition,
  caption?: string,
}