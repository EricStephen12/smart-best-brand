import React from 'react'
import { getAllDeliveryLocations } from '@/actions/delivery-locations'
import CheckoutClientWrapper from '@/components/CheckoutClientWrapper'
import SectionHeading from '@/components/SectionHeading'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const result = await getAllDeliveryLocations()
  const zones = result.success ? result.data : []

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 bg-white min-h-screen border-t border-blue-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Checkout"
          title="Complete your order"
          description="Enter your delivery details, choose how to pay, and we’ll take it from there."
          className="mb-12 sm:mb-16"
        />

        <CheckoutClientWrapper zones={zones || []} />
      </div>
    </div>
  )
}
