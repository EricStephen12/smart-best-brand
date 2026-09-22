import React from 'react';
import DeliveryLocationsList from '@/components/admin/DeliveryLocationsList';
import { getAllDeliveryLocations } from '@/actions/delivery-locations';

export const dynamic = 'force-dynamic';

export default async function DeliveryLocationsPage() {
  const result = await getAllDeliveryLocations();
  const locations = result.success ? result.data : [];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Delivery Locations</h1>
        <p className="text-sm text-stone-500 mt-1">Manage delivery regions, cities, and shipping fees.</p>
      </div>
      <DeliveryLocationsList initialLocations={locations || []} />
    </div>
  );
}
