import { Image } from '@/models/image'
import { MockFunction } from '@/services/mocker'

export const randomImage: MockFunction<Image, []> = function() {
  return {
    src: `https://placekitten.com/${this.create('number', [300, 600])}/${this.create('number', [300, 600])}`,
    size: 'cover',
    caption: `${this.create('adjective')} ${this.create('noun')}`,
  }
}