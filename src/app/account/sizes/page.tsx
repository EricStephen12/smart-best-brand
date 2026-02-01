import React from 'react';
import { getAllSizes } from '@/actions/sizes';
import SizesList from '@/components/admin/SizesList';

export const dynamic = 'force-dynamic';

export default async function AdminSizesPage() {
    const result = await getAllSizes();
    const sizes = result.success ? result.data : [];

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-none uppercase">Global Size Table</h1>
                    <p className="text-slate-400 mt-2 font-medium">Standardized sizes used across all brands and products.</p>
                </div>
            </div>

            <SizesList initialSizes={sizes || []} />
        </div>
    );
}
