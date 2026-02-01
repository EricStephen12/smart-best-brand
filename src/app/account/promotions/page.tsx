import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import PromotionsList from '@/components/admin/PromotionsList';
import { getAllPromotions } from '@/actions/promotions';

export const dynamic = 'force-dynamic';

export default async function PromotionsPage() {
    const result = await getAllPromotions();
    const promotions = result.success ? result.data : [];

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-blue-950 dark:text-white tracking-tight uppercase leading-none mb-2">Promotions Hub</h1>
                    <p className="text-slate-400 font-medium font-inter">Manage your elite site-wide discounts and marketing banners.</p>
                </div>
                <Link
                    href="/account/promotions/create"
                    className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20 transform active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Initialize Campaign
                </Link>
            </div>

            <PromotionsList initialPromotions={promotions || []} />
        </div>
    );
}
