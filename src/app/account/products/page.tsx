import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductsList from '@/components/admin/ProductsList';
import { getAllProducts } from '@/actions/products';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const result = await getAllProducts();
  const products = result.success ? result.data : [];

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-950 tracking-tight leading-none mb-1.5">Product Inventory</h1>
          <p className="text-slate-500 text-sm">Manage your mattress, pillow, and furniture catalog.</p>
        </div>
        <Link
          href="/account/products/create"
          className="bg-blue-950 hover:bg-sky-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-xs transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      <ProductsList initialProducts={products || []} />
    </div>
  );
}
