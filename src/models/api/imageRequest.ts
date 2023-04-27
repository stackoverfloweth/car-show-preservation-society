import { BackgroundPosition } from '@/models/image'

export type ImageRequest = {
  file?: string | ArrayBuffer,
  size?: string,
  position?: BackgroundPosition,
  caption?: string,
}