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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-none mb-2">Brands</h1>
                    <p className="text-sm font-medium text-slate-400">Manage the elite brand partnerships displayed in your store.</p>
                </div>
                <Link
                    href="/account/brands/create"
                    className="flex items-center gap-3 bg-blue-950 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-950/10 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Elite Brand
                </Link>
            </div>

            <BrandsList initialBrands={brands || []} />
        </div>
    );
}
