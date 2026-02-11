'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Tag as TagIcon,
    DollarSign,
    Percent,
    CheckCircle2,
    ChevronLeft,
    CalendarDays,
    Target,
    Layout,
    Save,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPromotion } from '@/actions/promotions';
import { getAllProducts } from '@/actions/products';
import { getAllCategories } from '@/actions/categories';
import { toast } from 'react-hot-toast';

export default function CreatePromotionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    // Dynamic Lists
    const [allProductsList, setAllProductsList] = useState<any[]>([]);
    const [allCategoriesList, setAllCategoriesList] = useState<any[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('Percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [minPurchase, setMinPurchase] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [appliesTo, setAppliesTo] = useState('ALL');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        const loadTargetingData = async () => {
            setFetchingData(true);
            try {
                const [pRes, cRes] = await Promise.all([
                    getAllProducts(),
                    getAllCategories()
                ]);
                if (pRes.success) setAllProductsList(pRes.data || []);
                if (cRes.success) setAllCategoriesList(cRes.data || []);
            } catch (error) {
                toast.error('Failed to load targeting data');
            } finally {
                setFetchingData(false);
            }
        };
        loadTargetingData();
    }, []);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (appliesTo !== 'ALL' && selectedIds.length === 0) {
            toast.error(`Please select at least one ${appliesTo === 'PRODUCTS' ? 'product' : 'category'}`);
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('code', code);
            formData.append('discountType', discountType);
            formData.append('discountValue', discountValue);
            formData.append('appliesTo', appliesTo);
            formData.append('selectedIds', JSON.stringify(selectedIds));

            if (minPurchase) formData.append('minPurchase', minPurchase);
            if (startDate) formData.append('startDate', startDate);
            if (endDate) formData.append('endDate', endDate);

            const result = await createPromotion(formData);
            if (result.success) {
                toast.success('Campaign initialized successfully!');
                router.push('/account/promotions');
            } else {
                toast.error(result.error || 'Failed to create campaign');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 pb-20 font-sans">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Link
                    href="/account/promotions"
                    className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight uppercase leading-none mb-1">Create Campaign</h1>
                    <p className="text-slate-400 font-medium font-inter">Initialize a new discount or marketing banner.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Basic Identity */}
                    <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 p-10 shadow-xl shadow-blue-950/5">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Campaign Identity</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Promotion Name</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="e.g. Valentines Comfort Flash Sale"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Voucher Code (Optional)</label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 rounded-2xl px-6 py-4 text-sm font-black text-blue-950 dark:text-white outline-none transition-all uppercase placeholder:text-slate-300"
                                        placeholder="SMART2026"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Promotion Scope</label>
                                    <select
                                        value={appliesTo}
                                        onChange={(e) => {
                                            setAppliesTo(e.target.value);
                                            setSelectedIds([]);
                                        }}
                                        className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="ALL">All Products (Site-wide)</option>
                                        <option value="PRODUCTS">Specific Products</option>
                                        <option value="CATEGORIES">Specific Categories</option>
                                    </select>
                                </div>
                            </div>

                            {/* Target Selection UI */}
                            {appliesTo !== 'ALL' && (
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                                            Select {appliesTo === 'PRODUCTS' ? 'Elite Products' : 'Catalog Categories'}
                                        </label>
                                        <span className="text-[10px] font-black text-sky-600 bg-sky-50 dark:bg-sky-900/30 px-3 py-1 rounded-full">{selectedIds.length} Selected</span>
                                    </div>

                                    <div className="max-h-60 overflow-y-auto bg-slate-50 dark:bg-gray-900 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-2 scrollbar-hide">
                                        {fetchingData ? (
                                            <div className="col-span-full py-8 text-center text-slate-400 font-bold flex items-center justify-center gap-3">
                                                <Loader2 className="w-5 h-5 animate-spin" /> Fetching targeting options...
                                            </div>
                                        ) : (
                                            (appliesTo === 'PRODUCTS' ? allProductsList : allCategoriesList).map((item: any) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => toggleSelection(item.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group ${selectedIds.includes(item.id)
                                                        ? 'bg-blue-950 border-blue-950 text-white shadow-lg'
                                                        : 'bg-white dark:bg-gray-800 border-transparent text-slate-600 dark:text-slate-300 hover:border-sky-200'}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full transition-colors ${selectedIds.includes(item.id) ? 'bg-sky-400' : 'bg-slate-200 group-hover:bg-sky-200'}`} />
                                                    <span className="text-xs font-bold truncate">{item.name}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 rounded-2xl px-6 py-4 text-sm font-medium text-blue-950 dark:text-white outline-none transition-all resize-none placeholder:text-slate-300"
                                    placeholder="Brief details about this marketing essence..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Logic & Values */}
                    <section className="bg-slate-50 dark:bg-gray-900 rounded-[2.5rem] border border-slate-200/50 dark:border-gray-700 p-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Incentive Logic</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Discount Basis</label>
                                    <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 border border-slate-100 dark:border-gray-700 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setDiscountType('Percentage')}
                                            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${discountType === 'Percentage' ? 'bg-blue-950 text-white shadow-lg' : 'text-slate-400 hover:text-blue-950'}`}
                                        >
                                            <Percent className="w-3 h-3" /> Percentage
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDiscountType('Fixed')}
                                            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${discountType === 'Fixed' ? 'bg-blue-950 text-white shadow-lg' : 'text-slate-400 hover:text-blue-950'}`}
                                        >
                                            <DollarSign className="w-3 h-3" /> Fixed Amount
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Value Amount</label>
                                <input
                                    type="number"
                                    required
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-black text-blue-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm font-sans"
                                    placeholder={discountType === 'Percentage' ? '15' : '5000'}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-gray-700">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Min Placement Value (Optional)</label>
                                <input
                                    type="number"
                                    value={minPurchase}
                                    onChange={(e) => setMinPurchase(e.target.value)}
                                    className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm font-sans placeholder:text-slate-300"
                                    placeholder="e.g. 100000"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {/* Schedule */}
                    <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20">
                        <div className="flex items-center gap-4 mb-8">
                            <CalendarDays className="w-5 h-5 text-sky-400" />
                            <h3 className="text-lg font-black uppercase tracking-widest leading-none">Timeline</h3>
                        </div>
                        <div className="space-y-8 font-sans">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-sky-400/60 block ml-1">Launch Protocol</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-sky-400/60 block ml-1">Expiration Protocols</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commit Section */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] p-10 border border-emerald-100 dark:border-emerald-900/20">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-none">Ready for Launch</p>
                                    <p className="text-[8px] font-black text-emerald-600/60 uppercase mt-1">System validation complete</p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-950 hover:bg-sky-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 shadow-xl transition-all transform active:scale-95 group uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                                Deploy Campaign
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

function StatCard({ icon: Icon, label, value, subValue, color }: { icon: React.ElementType, label: string, value: string, subValue: string, color: string }) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm group hover:shadow-xl hover:shadow-blue-950/5 transition-all">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-blue-950 tracking-tight mb-1">{value}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{subValue}</p>
            </div>
        </div>
    );
}
