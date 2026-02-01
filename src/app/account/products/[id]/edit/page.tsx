import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '@/actions/products';
import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getAllSizes } from '@/actions/sizes';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [productResult, brandsResult, categoriesResult, sizesResult] = await Promise.all([
        getProductById(id),
        getAllBrands(),
        getAllCategories(),
        getAllSizes()
    ]);

    if (!productResult.success || !productResult.data) {
        return notFound();
    }

    const product = productResult.data;
    const brands = brandsResult.success ? brandsResult.data : [];
    const categories = categoriesResult.success ? categoriesResult.data : [];
    const sizes = sizesResult.success ? sizesResult.data : [];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/account/products"
                        className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 dark:bg-sky-900/20 px-2 py-0.5 rounded">Refining Essence</span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">ID: {product.id.substring(0, 8)}</span>
                        </div>
                        <h1 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-none">{product.name}</h1>
                    </div>
                </div>
            </div>

            <ProductForm
                brands={brands || []}
                categories={categories || []}
                sizes={sizes || []}
                initialData={product}
            />
        </div>
    );
}
