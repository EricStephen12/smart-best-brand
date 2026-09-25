'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Edit3, Trash2, Package, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { deleteProduct } from '@/actions/products';
import { toast } from 'react-hot-toast';

interface Brand { id: string; name: string }
interface Category { id: string; name: string }

interface ProductsListProps {
  initialProducts: any[];
  brands?: Brand[];
  categories?: Category[];
}

type StockFilter = 'all' | 'in_stock' | 'out_of_stock';
const PAGE_SIZE = 20;

export default function ProductsList({ initialProducts, brands = [], categories = [] }: ProductsListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand?.name?.toLowerCase().includes(q);

      const matchesBrand =
        selectedBrandId === 'all' || p.brandId === selectedBrandId || p.brand?.id === selectedBrandId;

      const matchesCategory =
        selectedCategoryId === 'all' ||
        p.categories?.some(
          (c: any) => c.categoryId === selectedCategoryId || c.category?.id === selectedCategoryId
        );

      const totalStock = p.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) ?? 0;
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in_stock' && totalStock > 0) ||
        (stockFilter === 'out_of_stock' && totalStock === 0);

      return matchesSearch && matchesBrand && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedBrandId, selectedCategoryId, stockFilter]);

  const isFiltered =
    searchTerm !== '' ||
    selectedBrandId !== 'all' ||
    selectedCategoryId !== 'all' ||
    stockFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrandId('all');
    setSelectedCategoryId('all');
    setStockFilter('all');
    setPage(1);
  };

  // Reset to page 1 whenever filters change
  const prevFiltered = React.useRef(filtered.length)
  React.useEffect(() => {
    if (prevFiltered.current !== filtered.length) {
      setPage(1)
      prevFiltered.current = filtered.length
    }
  }, [filtered.length])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted');
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    } catch {
      toast.error('Unexpected error');
    } finally {
      setDeletingId(null);
    }
  };

  const selectClass =
    'px-3 py-2.5 border border-stone-200 rounded-xl text-xs font-medium text-blue-950 bg-white outline-none focus:border-blue-950/50 focus:ring-2 focus:ring-blue-950/10 transition-all cursor-pointer';

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name or brand…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-blue-950 placeholder:text-stone-400 outline-none focus:border-blue-950/50 focus:ring-2 focus:ring-blue-950/10 transition-all"
            />
          </div>

          {/* Brand filter */}
          {brands.length > 0 && (
            <select value={selectedBrandId} onChange={(e) => setSelectedBrandId(e.target.value)} className={selectClass}>
              <option value="all">All brands</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}

          {/* Category filter */}
          {categories.length > 0 && (
            <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className={selectClass}>
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}

          {/* Stock filter */}
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value as StockFilter)} className={selectClass}>
            <option value="all">All stock</option>
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </div>

        {/* Active filter summary + clear */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-stone-400">
            <span className="font-semibold text-blue-950">{filtered.length}</span> of {products.length} products
          </p>
          {isFiltered && (
            <button onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-blue-950 transition-colors">
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Product</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500">Price</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginated.map((product) => {
                const minPrice = product.variants?.length
                  ? Math.min(...product.variants.map((v: any) => v.promoPrice || v.price))
                  : 0;
                const totalStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) ?? 0;

                return (
                  <tr key={product.id} className="group hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-stone-100 rounded-xl relative overflow-hidden shrink-0 border border-stone-200">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-950 group-hover:text-sky-700 transition-colors leading-snug">
                            {product.name}
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {product.brand?.name}
                            {product.categories?.[0]?.category?.name && (
                              <> · {product.categories[0].category.name}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-500 border border-stone-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${totalStock > 0 ? 'text-blue-950' : 'text-rose-500'}`}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-blue-950">
                        From ₦{minPrice.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/account/products/${product.id}/edit`}
                          className="p-2 text-stone-400 hover:text-sky-700 hover:bg-stone-100 rounded-xl transition-all">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(product.id, product.name)}
                          disabled={deletingId === product.id}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50">
                          {deletingId === product.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <p className="text-sm text-stone-500">
                      {isFiltered ? 'No products match your filters.' : 'No products yet.'}
                    </p>
                    {isFiltered && (
                      <button onClick={clearFilters}
                        className="mt-2 text-xs font-semibold text-sky-700 hover:underline">
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-stone-400">
            Page <span className="font-semibold text-blue-950">{page}</span> of {totalPages}
            {' '}· {filtered.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-stone-200 rounded-xl text-blue-950 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-stone-200 rounded-xl text-blue-950 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
