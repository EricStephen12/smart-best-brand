'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Grid, Check, X, Loader2 } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories';
import { toast } from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}

interface CategoriesListProps {
    initialCategories: Category[];
}

export default function CategoriesList({ initialCategories }: CategoriesListProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [isAdding, setIsAdding] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!name) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            const result = await createCategory(formData);
            if (result.success) {
                setCategories([result.data as Category, ...categories]);
                setName('');
                setIsAdding(false);
                toast.success('Category created');
            } else {
                toast.error(result.error || 'Failed to create category');
            }
        } catch (error) {
            toast.error('Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingCategory || !name) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            const result = await updateCategory(editingCategory.id, formData);
            if (result.success) {
                setCategories(categories.map(c => c.id === editingCategory.id ? result.data as Category : c));
                setEditingCategory(null);
                setName('');
                toast.success('Category updated');
            } else {
                toast.error(result.error || 'Failed to update category');
            }
        } catch (error) {
            toast.error('Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        setDeletingId(id);
        try {
            const result = await deleteCategory(id);
            if (result.success) {
                setCategories(categories.filter(c => c.id !== id));
                toast.success('Category deleted');
            } else {
                toast.error(result.error || 'Failed to delete category');
            }
        } catch (error) {
            toast.error('Unexpected error occurred');
        } finally {
            setDeletingId(null);
        }
    };

    const startEditing = (cat: Category) => {
        setEditingCategory(cat);
        setName(cat.name);
        setIsAdding(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories List */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {categories.map((cat) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={cat.id}
                            className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-[2rem] p-8 group hover:shadow-2xl hover:shadow-blue-900/5 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-gray-700/50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 transition-colors" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 bg-blue-950 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-sky-600 transition-colors shadow-lg shadow-blue-900/20">
                                    <Grid className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-blue-950 dark:text-white mb-2">{cat.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {cat._count?.products || 0} Active Products
                                </p>

                                <div className="mt-8 flex items-center gap-2 pt-4 border-t border-slate-50 dark:border-gray-700">
                                    <button
                                        onClick={() => startEditing(cat)}
                                        className="flex-1 bg-slate-50 dark:bg-gray-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 text-slate-400 p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id, cat.name)}
                                        disabled={deletingId === cat.id}
                                        className="w-12 h-12 bg-slate-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-slate-400 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                                    >
                                        {deletingId === cat.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add/Edit Sidebar */}
            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {(isAdding || editingCategory) ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20 sticky top-8"
                        >
                            <h2 className="text-2xl font-black mb-8 leading-tight">
                                {isAdding ? 'Create New' : 'Edit Elite'} <br /> Category
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block mb-3 opacity-60">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
                                        placeholder="e.g. Ergonomic Chairs"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={isAdding ? handleCreate : handleUpdate}
                                        disabled={loading}
                                        className="flex-1 bg-sky-600 hover:bg-sky-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4" />
                                        )}
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAdding(false);
                                            setEditingCategory(null);
                                            setName('');
                                        }}
                                        className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-[2.5rem] p-10 text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-gray-700/50 rounded-3xl flex items-center justify-center text-blue-950 dark:text-sky-400 mx-auto border border-slate-100 dark:border-gray-700">
                                <Grid className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-blue-950 dark:text-white tracking-tight">Structural Integrity</h3>
                                <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed font-inter">Categories define how customers navigate your store's essence.</p>
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all"
                                >
                                    Add New Category
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
