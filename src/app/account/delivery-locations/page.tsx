import React from 'react';
import DeliveryLocationsList from '@/components/admin/DeliveryLocationsList';
import { getAllDeliveryLocations } from '@/actions/delivery-locations';

export default async function DeliveryLocationsPage() {
    const result = await getAllDeliveryLocations();
    const locations = result.success ? result.data : [];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-blue-950 dark:text-white tracking-tight uppercase leading-none mb-2">
                        Logistics <span className="text-sky-600">&</span> Delivery
                    </h1>
                    <p className="text-slate-400 font-medium font-inter">Expand your elite reach by managing delivery jurisdictions.</p>
                </div>
            </div>

            <DeliveryLocationsList initialLocations={locations || []} />
        </div>
    );
}
