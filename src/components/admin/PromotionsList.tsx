'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Calendar,
    Tag as TagIcon,
    CheckCircle2,
    XCircle,
    Clock,
    Zap,
    Layout,
    Loader2
} from 'lucide-react';
import { deletePromotion } from '@/actions/promotions';
import { toast } from 'react-hot-toast';

interface Promotion {
    id: string;
    title: string;
    code: string | null;
    discountType: string;
    discountValue: number;
    isActive: boolean;
    startDate: Date | null;
    endDate: Date | null;
}

interface PromotionsListProps {
    initialPromotions: any[];
}

export default function PromotionsList({ initialPromotions }: PromotionsListProps) {
    const [promotions, setPromotions] = useState(initialPromotions);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredPromotions = promotions.filter(promo =>
        promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete ${title}?`)) return;
        setDeletingId(id);
        try {
            const result = await deletePromotion(id);
            if (result.success) {
                setPromotions(promotions.filter(p => p.id !== id));
                toast.success('Promotion deleted');
            } else {
                toast.error(result.error || 'Failed to delete promotion');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setDeletingId(null);
        }
    };

    const getStatus = (promo: Promotion) => {
        const now = new Date();
        if (!promo.isActive) return 'INACTIVE';
        if (promo.startDate && new Date(promo.startDate) > now) return 'SCHEDULED';
        if (promo.endDate && new Date(promo.endDate) < now) return 'EXPIRED';
        return 'ACTIVE';
    };

    return (
        <div className="space-y-10">
            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Zap}
                    label="Active Campaigns"
                    value={promotions.filter(p => getStatus(p) === 'ACTIVE').length.toString()}
                    subValue="Currently live"
                    color="bg-sky-50 text-sky-600"
                />
                <StatCard
                    icon={Clock}
                    label="Scheduled"
                    value={promotions.filter(p => getStatus(p) === 'SCHEDULED').length.toString()}
                    subValue="Awaiting launch"
                    color="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Total Strategy"
                    value={promotions.length.toString()}
                    subValue="Campaign definitions"
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-gray-700 p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-sky-600/10 transition-all outline-none font-sans"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 overflow-hidden shadow-xl shadow-blue-950/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-gray-700/50 border-b border-slate-100 dark:border-gray-700">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Promo Code</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Discount</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
                            {filteredPromotions.map((promo) => {
                                const status = getStatus(promo);
                                return (
                                    <tr key={promo.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center text-sky-600">
                                                    <Layout className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-blue-950 dark:text-white leading-tight mb-1">{promo.title}</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                            <Calendar className="w-3 h-3" />
                                                            {promo.endDate ? `Until ${new Date(promo.endDate).toLocaleDateString()}` : 'Perpetual'}
                                                        </div>
                                                        <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${promo.appliesTo === 'ALL' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                            {promo.appliesTo === 'ALL' ? 'Site-wide' : 'Targeted'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-gray-600">
                                                {promo.code || 'NO CODE'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-blue-950 dark:text-white text-lg leading-none mb-1">
                                                    {promo.discountType === 'Percentage' ? `${promo.discountValue}% OFF` : `₦${promo.discountValue.toLocaleString()} OFF`}
                                                </span>
                                                <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{promo.discountType} Base</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/account/promotions/${promo.id}/edit`}
                                                    className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-slate-400 hover:text-sky-600 transition-all font-sans"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(promo.id, promo.title)}
                                                    disabled={deletingId === promo.id}
                                                    className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-slate-400 hover:text-red-600 transition-all font-sans disabled:opacity-50"
                                                >
                                                    {deletingId === promo.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, subValue, color }: { icon: React.ElementType, label: string, value: string, subValue: string, color: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-slate-100 dark:border-gray-700 p-8 shadow-sm group hover:shadow-xl hover:shadow-blue-950/5 transition-all">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-none mb-1">{value}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{subValue}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        ACTIVE: 'bg-emerald-50 text-emerald-600',
        SCHEDULED: 'bg-sky-50 text-sky-600',
        EXPIRED: 'bg-slate-50 text-slate-400',
        INACTIVE: 'bg-red-50 text-red-400'
    };

    const icons: Record<string, React.ElementType> = {
        ACTIVE: CheckCircle2,
        SCHEDULED: Clock,
        EXPIRED: XCircle,
        INACTIVE: XCircle
    };

    const Icon = icons[status] || XCircle;

    return (
        <span className={`flex items-center gap-2 w-fit px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
}
