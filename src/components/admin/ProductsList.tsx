'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Edit3,
    Trash2,
    Package,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import Image from 'next/image';
import { deleteProduct } from '@/actions/products';
import { toast } from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    slug: string;
    brand: { name: string };
    categories: { category: { name: string } }[];
    variants: { price: number; promoPrice: number | null; stock: number }[];
    isActive: boolean;
    images: string[];
}

interface ProductsListProps {
    initialProducts: any[];
}

export default function ProductsList({ initialProducts }: ProductsListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        setDeletingId(id);
        try {
            const result = await deleteProduct(id);
            if (result.success) {
                setProducts(products.filter(p => p.id !== id));
                toast.success('Product deleted');
            } else {
                toast.error(result.error || 'Failed to delete product');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 shadow-xl shadow-blue-950/5 overflow-hidden">
            {/* Table Header / Filters */}
            <div className="p-8 border-b border-slate-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products, brands, categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-gray-900 border-none focus:ring-4 focus:ring-sky-600/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-blue-950 dark:text-white outline-none transition-all duration-300 font-sans"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 dark:bg-gray-700 text-slate-400 hover:text-blue-950 dark:hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-gray-700/50">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product Essence</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financials</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
                        {filteredProducts.map((product) => {
                            const minPrice = Math.min(...product.variants.map((v: any) => v.promoPrice || v.price));
                            const totalStock = product.variants.reduce((acc: number, curr: any) => acc + curr.stock, 0);

                            return (
                                <tr key={product.id} className="group hover:bg-slate-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-2xl relative overflow-hidden flex-shrink-0 border border-slate-200 dark:border-gray-600">
                                                {product.images?.[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <Package className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-blue-950 dark:text-white group-hover:text-sky-600 transition-colors mb-1">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1">
                                                        <Package className="w-3 h-3" /> {product.categories?.[0]?.category?.name || 'Uncategorized'}
                                                    </span>
                                                    <span className="text-slate-200 dark:text-gray-600">/</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-sky-600">
                                                        {product.brand?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <span className={`text-sm font-black ${totalStock > 0 ? 'text-blue-950 dark:text-white' : 'text-red-500'}`}>
                                                {totalStock} Units
                                            </span>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Aggregated Stock</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <span className="text-sm font-black text-blue-950 dark:text-white">From ₦{minPrice.toLocaleString()}</span>
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Variant Minimum</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/account/products/${product.id}/edit`}
                                                className="p-3 text-slate-300 hover:text-sky-600 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                disabled={deletingId === product.id}
                                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all disabled:opacity-50"
                                            >
                                                {deletingId === product.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No products in inventory.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
