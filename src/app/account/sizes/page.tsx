import React from 'react';
import { getAllSizes } from '@/actions/sizes';
import SizesList from '@/components/admin/SizesList';

export const dynamic = 'force-dynamic';

export default async function AdminSizesPage() {
  const result = await getAllSizes();
  const sizes = result.success ? result.data : [];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Size Table</h1>
        <p className="text-sm text-stone-500 mt-1">Standardized sizes used across all brands and products.</p>
      </div>
      <SizesList initialSizes={sizes || []} />
    </div>
  );
}
