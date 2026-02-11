import React from 'react';
import { getAllDeliveryLocations } from '@/actions/delivery-locations';
import CheckoutForm from '@/components/CheckoutForm';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const result = await getAllDeliveryLocations();
  const zones = result.success ? result.data : [];

  return (
    <div className="pt-24 sm:pt-32 pb-24 bg-slate-50/50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl sm:text-7xl font-black text-blue-950 dark:text-white tracking-[-0.04em] leading-none mb-4 uppercase">Checkout</h1>
          <p className="text-slate-400 font-medium font-inter">Finalize your curated collection selection for elite dispatch.</p>
        </div>

        <CheckoutForm zones={zones || []} />
      </div>
    </div>
  );
}
