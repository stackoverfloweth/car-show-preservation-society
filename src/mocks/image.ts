import { MockFunction } from '@/services/mocker'

export const randomImage: MockFunction<string, []> = function() {
  return `https://placekitten.com/${this.create('number', [300, 600])}/${this.create('number', [300, 600])}`
}