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
          <h1 className="text-4xl font-black text-blue-950 dark:text-white tracking-tight leading-none mb-2 uppercase">Product Inventory</h1>
          <p className="text-slate-400 font-medium font-inter">Manage your elite mattress and furniture catalog with technical precision.</p>
        </div>
        <Link
          href="/account/products/create"
          className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20 transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> Establish New Essence
        </Link>
      </div>

      <ProductsList initialProducts={products || []} />
    </div>
  );
}
