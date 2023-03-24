import { Advertisement, standardSizes } from '@/models'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities'

export const randomAdvertisement: MockFunction<Advertisement, [Partial<Advertisement>?]> = function(overrides = {}) {
  const hasText = this.create('boolean')
  const hasImage = !hasText || this.create('boolean')
  const { height, width } = pick([...standardSizes])

  return {
    advertisementId: this.create('id'),
    title: hasText ? this.create('noun') : undefined,
    description: hasText ? this.create('sentence') : undefined,
    image: hasImage ? this.create('image') : undefined,
    href: this.create('url'),
    height,
    width,
    ...overrides,
  }
}