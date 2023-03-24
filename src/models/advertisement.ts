import { Image } from '@/models/image'
import { Size } from '@/models/size'

export type Advertisement = {
  advertisementId: string,
  image?: Image,
  title?: string,
  description?: string,
  href?: string,
  size?: Size,
}

export const defaultSize: Readonly<Size> = { height: '200px', width: '300px' }
export const standardSizes: Readonly<Size[]> = [
  defaultSize,
  { height: '100px', width: '300px' },
  { height: '50px', width: '300px' },
  { height: '200px', width: '200px' },
  { height: '250px', width: '250px' },
] as const