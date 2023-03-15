export type BackgroundPosition = string | [number, number]

export type Image = {
  src: string,
  position?: BackgroundPosition,
  backdrop?: boolean,
}