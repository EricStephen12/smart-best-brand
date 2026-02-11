'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Ruler, Check, X, Loader2 } from 'lucide-react';
import { createSize, updateSize, deleteSize } from '@/actions/sizes';
import { toast } from 'react-hot-toast';

interface Size {
    id: string;
    label: string;
    width: number | null;
    length: number | null;
    _count?: {
        variants: number;
    };
}

interface SizesListProps {
    initialSizes: Size[];
}

export default function SizesList({ initialSizes }: SizesListProps) {
    const [sizes, setSizes] = useState(initialSizes);
    const [isAdding, setIsAdding] = useState(false);
    const [editingSize, setEditingSize] = useState<Size | null>(null);
    const [label, setLabel] = useState('');
    const [width, setWidth] = useState('');
    const [length, setLength] = useState('');
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!label) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('label', label);
            if (width) formData.append('width', width);
            if (length) formData.append('length', length);

            const result = await createSize(formData);
            if (result.success) {
                setSizes([result.data as Size, ...sizes]);
                setLabel('');
                setWidth('');
                setLength('');
                setIsAdding(false);
                toast.success('Size standard created');
            } else {
                toast.error(result.error || 'Failed to create size');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingSize || !label) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('label', label);
            if (width) formData.append('width', width);
            if (length) formData.append('length', length);

            const result = await updateSize(editingSize.id, formData);
            if (result.success) {
                setSizes(sizes.map(s => s.id === editingSize.id ? result.data as Size : s));
                setEditingSize(null);
                setLabel('');
                setWidth('');
                setLength('');
                toast.success('Size standard updated');
            } else {
                toast.error(result.error || 'Failed to update size');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        setDeletingId(id);
        try {
            const result = await deleteSize(id);
            if (result.success) {
                setSizes(sizes.filter(s => s.id !== id));
                toast.success('Size standard deleted');
            } else {
                toast.error(result.error || 'Failed to delete size');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setDeletingId(null);
        }
    };

    const startEditing = (size: Size) => {
        setEditingSize(size);
        setLabel(size.label);
        setWidth(size.width?.toString() || '');
        setLength(size.length?.toString() || '');
        setIsAdding(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                    {sizes.map((size) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={size.id}
                            className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-3xl p-6 flex items-center justify-between group hover:shadow-xl hover:shadow-blue-900/5 transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center text-blue-950 dark:text-white group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors border border-slate-100 dark:border-gray-600">
                                    <Ruler className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-blue-950 dark:text-white">{size.label}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {size.width && size.length ? `${size.width}ft x ${size.length}ft` : 'Mixed Dimensions'}
                                        {size._count && ` • ${size._count.variants} Variants`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => startEditing(size)}
                                    className="p-3 text-slate-400 hover:text-sky-600 transition-colors"
                                >
                                    <Edit3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(size.id, size.label)}
                                    disabled={deletingId === size.id}
                                    className="p-3 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                    {deletingId === size.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {(isAdding || editingSize) ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20 sticky top-8"
                        >
                            <h2 className="text-2xl font-black mb-8 leading-tight">
                                {isAdding ? 'Define New' : 'Edit Elite'} <br /> Standard Size
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block mb-3 opacity-60">
                                        Size Label
                                    </label>
                                    <input
                                        type="text"
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                        className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
                                        placeholder="e.g. King (6x7)"
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block mb-3 opacity-60">
                                            Width (ft)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={width}
                                            onChange={(e) => setWidth(e.target.value)}
                                            className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all font-sans"
                                            placeholder="6"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block mb-3 opacity-60">
                                            Length (ft)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={length}
                                            onChange={(e) => setLength(e.target.value)}
                                            className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all font-sans"
                                            placeholder="7"
                                        />
                                    </div>
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
                                            setEditingSize(null);
                                            setLabel('');
                                            setWidth('');
                                            setLength('');
                                        }}
                                        className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-gray-800 border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-[2.5rem] p-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-3xl flex items-center justify-center text-slate-300 dark:text-sky-400 mx-auto border-2 border-slate-100 dark:border-gray-600 shadow-sm">
                                <Ruler className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-blue-950 dark:text-white">Standardized Scale</h3>
                                <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed font-inter">Uniform sizes ensure consistency across different mattress brands.</p>
                            </div>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-950 dark:hover:text-white transition-colors"
                            >
                                Define New Standard &rarr;
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
