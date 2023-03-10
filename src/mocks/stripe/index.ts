import { randomMetadata } from '@/mocks/stripe/metadata'
import { mocks as priceMocks } from '@/mocks/stripe/price'
import { randomProduct } from '@/mocks/stripe/product'
import { randomProductType } from '@/mocks/stripe/productType'

export const mocks = {
  'stripe.metadata': randomMetadata,
  'stripe.product': randomProduct,
  'stripe.product.type': randomProductType,
  ...priceMocks,
}