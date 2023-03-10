import { MockFunction } from '@/services/mocker'

export const randomEmail: MockFunction<string, []> = function() {
  return `${this.create('noun')}@email.com`
}