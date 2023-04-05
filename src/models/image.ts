export type BackgroundPosition = string | [number, number]

export type Image = {
  imageId: string,
  src: string,
  size?: string,
  position?: BackgroundPosition,
  caption?: string,
}