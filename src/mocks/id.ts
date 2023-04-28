import { ObjectId } from 'mongodb'
import { MockFunction } from '@/services/mocker'

export const randomId: MockFunction<ObjectId, []> = function() {
  return this.createMany('char', 24).join('') as unknown as ObjectId
}