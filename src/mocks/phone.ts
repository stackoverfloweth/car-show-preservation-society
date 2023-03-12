import { MockFunction } from '@/services/mocker'

export const randomPhone: MockFunction<string, []> = function() {
  return new Array(10).fill(null).map(() => this.create('number', [0, 9])).join('')
}