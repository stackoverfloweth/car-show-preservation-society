import { MockFunction } from '@/services/mocker'

export const randomBoolean: MockFunction<boolean, []> = function() {
  return Math.random() < 0.5
}