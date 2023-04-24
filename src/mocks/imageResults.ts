import { ImageResults } from '@/models/imageResults'
import { MockFunction } from '@/services/mocker'

export const randomImageResults: MockFunction<ImageResults, [Partial<ImageResults>?]> = function(overrides = {}) {
  return {
    hasMore: true,
    images: this.createMany('image', this.create('number', [1, 50])),
    ...overrides,
  }
}