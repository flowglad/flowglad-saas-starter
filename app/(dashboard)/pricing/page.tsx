import { Check } from 'lucide-react'
import { SubmitButton } from './submit-button'
import { flowgladServer } from '@/lib/flowglad'
import { checkoutAction } from '@/lib/payments/actions'

// Prices are fresh for one hour max
export const revalidate = 3600

export default async function PricingPage() {
  const { getProduct } = await flowgladServer.getBilling()
  const basePlan = getProduct('base')!
  const plusPlan = getProduct('plus')!

  const basePrice = basePlan.defaultPrice!
  const plusPrice = plusPlan.defaultPrice!

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        <PricingCard
          name={basePlan.name || 'Base'}
          price={basePrice.unitPrice}
          interval={basePrice.intervalUnit as string}
          trialDays={basePrice.trialPeriodDays as number}
          features={
            basePlan.displayFeatures?.map(
              (feature) => feature.label
            ) || []
          }
          priceId={basePrice?.id}
        />
        <PricingCard
          name={plusPlan.name || 'Plus'}
          price={plusPrice.unitPrice}
          interval={plusPrice.intervalUnit as string}
          trialDays={plusPrice.trialPeriodDays as number}
          features={
            plusPlan.displayFeatures?.map(
              (feature) => feature.label
            ) || []
          }
          priceId={plusPrice?.id}
        />
      </div>
    </main>
  )
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
}: {
  name: string
  price: number
  interval: string
  trialDays: number
  features: string[]
  priceId?: string
}) {
  return (
    <div className="pt-6">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">
        {name}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        with {trialDays} day free trial
      </p>
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <form action={checkoutAction}>
        <input type="hidden" name="priceId" value={priceId} />
        <SubmitButton />
      </form>
    </div>
  )
}
