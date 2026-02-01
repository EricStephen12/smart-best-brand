'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import { deleteBrand } from '@/actions/brands';
import { toast } from 'react-hot-toast';

interface BrandsListProps {
    initialBrands: any[];
}

export default function BrandsList({ initialBrands }: BrandsListProps) {
    const [brands, setBrands] = useState(initialBrands);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;

        setDeletingId(id);
        try {
            const result = await deleteBrand(id);
            if (result.success) {
                setBrands(brands.filter(b => b.id !== id));
                toast.success('Brand deleted successfully');
            } else {
                toast.error(result.error || 'Failed to delete brand');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none text-gray-900 dark:text-white transition-all"
                    />
                </div>
            </div>

            {/* Brands Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-[10px] uppercase text-gray-400 font-bold tracking-widest">
                        <tr>
                            <th className="px-6 py-5">Brand Details</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5">Products</th>
                            <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredBrands.length > 0 ? (
                            filteredBrands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            {brand.logoUrl ? (
                                                <img src={brand.logoUrl} alt={brand.name} className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-100" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-600 flex items-center justify-center font-bold text-lg">
                                                    {brand.name[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white leading-none mb-1">{brand.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">/{brand.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${brand.isActive
                                                ? 'bg-green-50 text-green-600 border border-green-100'
                                                : 'bg-gray-50 text-gray-400 border border-gray-100'
                                            }`}>
                                            {brand.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {brand._count?.products || 0} Products
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/account/brands/${brand.id}/edit`}
                                                className="p-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg text-gray-400 hover:text-sky-600 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(brand.id, brand.name)}
                                                disabled={deletingId === brand.id}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                            >
                                                {deletingId === brand.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="font-bold text-gray-500">No brands found</p>
                                        <p className="text-sm text-gray-400">Try searching for something else or add a new brand.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
