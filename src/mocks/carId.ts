import { MockFunction } from '@/services/mocker'
import { capitalize } from '@/utilities'

export const randomCarId: MockFunction<string, []> = function() {
  return capitalize(this.create('char')) + this.create('number', [100, 999])
}