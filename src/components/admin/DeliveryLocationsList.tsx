'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Truck, Trash2, Edit2, Search, Check, X, Loader2 } from 'lucide-react';
import { createDeliveryLocation, updateDeliveryLocation, deleteDeliveryLocation } from '@/actions/delivery-locations';
import { toast } from 'react-hot-toast';

interface DeliveryLocation {
    id: string;
    name: string;
    basePrice: number;
    isActive: boolean;
}

interface DeliveryLocationsListProps {
    initialLocations: DeliveryLocation[];
}

export default function DeliveryLocationsList({ initialLocations }: DeliveryLocationsListProps) {
    const [locations, setLocations] = useState(initialLocations);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingLocation, setEditingLocation] = useState<DeliveryLocation | null>(null);
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async () => {
        if (!name || !basePrice) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('basePrice', basePrice);
            const result = await createDeliveryLocation(formData);
            if (result.success) {
                setLocations([result.data as DeliveryLocation, ...locations]);
                setName('');
                setBasePrice('');
                setIsAdding(false);
                toast.success('Zone established');
            } else {
                toast.error(result.error || 'Failed to create zone');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingLocation || !name || !basePrice) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('basePrice', basePrice);
            const result = await updateDeliveryLocation(editingLocation.id, formData);
            if (result.success) {
                setLocations(locations.map(l => l.id === editingLocation.id ? result.data as DeliveryLocation : l));
                setEditingLocation(null);
                setName('');
                setBasePrice('');
                toast.success('Zone updated');
            } else {
                toast.error(result.error || 'Failed to update zone');
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
            const result = await deleteDeliveryLocation(id);
            if (result.success) {
                setLocations(locations.filter(l => l.id !== id));
                toast.success('Zone deleted');
            } else {
                toast.error(result.error || 'Failed to delete zone');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setDeletingId(null);
        }
    };

    const startEditing = (loc: DeliveryLocation) => {
        setEditingLocation(loc);
        setName(loc.name);
        setBasePrice(loc.basePrice.toString());
        setIsAdding(false);
    };

    return (
        <div className="space-y-10">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-slate-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Territories</p>
                    <h3 className="text-3xl font-black text-blue-950 dark:text-white">{locations.filter(l => l.isActive).length}</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mt-2">Operational</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-slate-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg. Logistics Fee</p>
                    <h3 className="text-3xl font-black text-blue-950 dark:text-white">
                        ₦{locations.length > 0
                            ? (locations.reduce((acc, curr) => acc + curr.basePrice, 0) / locations.length).toLocaleString()
                            : '0'
                        }
                    </h3>
                    <p className="text-[10px] font-bold text-sky-600 uppercase mt-2">Zone Weighted</p>
                </div>
                <div className="bg-blue-950 rounded-[2rem] p-8 shadow-xl shadow-blue-950/20 flex flex-col justify-center">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full bg-sky-600 hover:bg-sky-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                    >
                        <Plus className="w-4 h-4" />
                        Establish New Zone
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 shadow-xl shadow-blue-950/5 overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-gray-700 flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Query jurisdictions..."
                            className="w-full bg-slate-50 dark:bg-gray-900 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium outline-none focus:ring-4 focus:ring-sky-600/10 transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-gray-700/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Jurisdiction</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Fee</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
                            {filteredLocations.map((loc) => (
                                <tr key={loc.id} className="hover:bg-slate-50/30 dark:hover:bg-gray-700/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors border border-slate-100 dark:border-gray-600">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-blue-950 dark:text-white leading-tight mb-1">{loc.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Dispatch zone</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-black text-blue-950 dark:text-white text-lg leading-none mb-1">₦{loc.basePrice.toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Base Logistics Rate</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => startEditing(loc)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg text-slate-400 hover:text-blue-950 dark:hover:text-white transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(loc.id, loc.name)}
                                                disabled={deletingId === loc.id}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === loc.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {(isAdding || editingLocation) && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsAdding(false); setEditingLocation(null); }}
                            className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-[60]"
                        />
                        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[70] p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl pointer-events-auto relative"
                            >
                                <h2 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight mb-8">
                                    {isAdding ? 'Establish Zone' : 'Edit Privilege'}
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Jurisdiction Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Abuja (Central)"
                                            className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Base Logistics Fee (₦)</label>
                                        <input
                                            type="number"
                                            value={basePrice}
                                            onChange={(e) => setBasePrice(e.target.value)}
                                            placeholder="5000"
                                            className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none transition-all placeholder:text-slate-300 font-sans"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={isAdding ? handleCreate : handleUpdate}
                                            disabled={loading}
                                            className="flex-1 bg-blue-950 hover:bg-sky-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-950/20 active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Protocol'}
                                        </button>
                                        <button
                                            onClick={() => { setIsAdding(false); setEditingLocation(null); }}
                                            className="px-6 py-4 bg-slate-100 dark:bg-gray-700 text-slate-400 hover:text-blue-950 dark:hover:text-white rounded-2xl transition-all"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
