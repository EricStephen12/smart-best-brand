import React from 'react';
import CategoriesList from '@/components/admin/CategoriesList';
import { getAllCategories } from '@/actions/categories';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const result = await getAllCategories();
  const categories = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Product Categories</h1>
        <p className="text-sm text-stone-500 mt-1">Manage product categories displayed across your store.</p>
      </div>
      <CategoriesList initialCategories={categories || []} />
    </div>
  );
}
