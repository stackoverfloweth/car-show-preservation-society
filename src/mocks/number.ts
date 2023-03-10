import { MockFunction } from '@/services/mocker'

const uniform = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)

export const randomNumber: MockFunction<number, [number?, number?]> = function(min = 0, max = 100) {
  return uniform(min, max)
}