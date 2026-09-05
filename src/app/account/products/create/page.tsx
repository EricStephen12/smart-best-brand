import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getAllSizes } from '@/actions/sizes';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function CreateProductPage() {
    const [brandsResult, categoriesResult, sizesResult] = await Promise.all([
        getAllBrands(),
        getAllCategories(),
        getAllSizes()
    ]);

    const brands = brandsResult.success ? brandsResult.data : [];
    const categories = categoriesResult.success ? categoriesResult.data : [];
    const sizes = sizesResult.success ? sizesResult.data : [];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/account/products"
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight mb-1">Add New Product</h1>
                        <p className="text-sm text-slate-500">Create and list a new product in the store catalog.</p>
                    </div>
                </div>
            </div>

            <ProductForm
                brands={brands || []}
                categories={categories || []}
                sizes={sizes || []}
            />
        </div>
    );
}
