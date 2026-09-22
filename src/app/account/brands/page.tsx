import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import BrandsList from '@/components/admin/BrandsList';
import { getAllBrands } from '@/actions/brands';

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const result = await getAllBrands();
  const brands = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Brands</h1>
          <p className="text-sm text-stone-500 mt-1">Manage the mattress and furniture brands in your store.</p>
        </div>
        <Link
          href="/account/brands/create"
          className="inline-flex items-center gap-2 bg-blue-950 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </Link>
      </div>
      <BrandsList initialBrands={brands || []} />
    </div>
  );
}
