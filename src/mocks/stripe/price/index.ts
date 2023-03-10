import { randomPriceBillingScheme } from '@/mocks/stripe/price/billingScheme'
import { randomPrice } from '@/mocks/stripe/price/price'
import { randomPriceType } from '@/mocks/stripe/price/priceType'
import { randomPriceRecurring } from '@/mocks/stripe/price/recurring'
import { randomPriceRecurringAggregateUsage } from '@/mocks/stripe/price/recurringAggregateUsage'
import { randomPriceRecurringInterval } from '@/mocks/stripe/price/recurringInterval'
import { randomPriceRecurringUsageType } from '@/mocks/stripe/price/recurringUsageType'
import { randomPriceTaxBehavior } from '@/mocks/stripe/price/taxBehavior'
import { randomPriceTiersMode } from '@/mocks/stripe/price/tiersMode'

export const mocks = {
  'stripe.price.aggregateUsage': randomPriceRecurringAggregateUsage,
  'stripe.price.billingScheme': randomPriceBillingScheme,
  'stripe.price.interval': randomPriceRecurringInterval,
  'stripe.price.recurring': randomPriceRecurring,
  'stripe.price.taxBehavior': randomPriceTaxBehavior,
  'stripe.price.tiersMode': randomPriceTiersMode,
  'stripe.price.type': randomPriceType,
  'stripe.price.usageType': randomPriceRecurringUsageType,
  'stripe.price': randomPrice,
}