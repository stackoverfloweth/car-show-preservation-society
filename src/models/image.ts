export type BackgroundPosition = string | [number, number]

export type Image = {
  src: string,
  size?: string,
  position?: BackgroundPosition,
  backdrop?: boolean,
}