import React from 'react';
import CategoriesList from '@/components/admin/CategoriesList';
import { getAllCategories } from '@/actions/categories';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
    const result = await getAllCategories();
    const categories = result.success ? result.data : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-none uppercase">Product Categories</h1>
                    <p className="text-slate-400 mt-2 font-medium">Manage the organizational structure of your elite catalog.</p>
                </div>
            </div>

            <CategoriesList initialCategories={categories || []} />
        </div>
    );
}
