import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductsList from '@/components/admin/ProductsList';
import { getAllProducts } from '@/actions/products';
import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [productsResult, brandsResult, categoriesResult] = await Promise.all([
    getAllProducts({ includeInactive: true }),
    getAllBrands(),
    getAllCategories(),
  ]);
  const products = productsResult.success ? productsResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Products</h1>
          <p className="text-sm text-stone-500 mt-1">Manage your mattress, pillow, and furniture catalog.</p>
        </div>
        <Link
          href="/account/products/create"
          className="inline-flex items-center gap-2 bg-blue-950 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>
      <ProductsList initialProducts={products || []} brands={brands || []} categories={categories || []} />
    </div>
  );
}
