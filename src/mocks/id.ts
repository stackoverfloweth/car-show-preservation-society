import { MockFunction } from '@/services/mocker'

export const randomId: MockFunction<string, []> = function() {
  return this.createMany('char', 24).join('')
}