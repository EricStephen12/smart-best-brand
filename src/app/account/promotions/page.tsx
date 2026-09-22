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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Promotions</h1>
          <p className="text-sm text-stone-500 mt-1">Manage discount codes and promotional campaigns.</p>
        </div>
        <Link
          href="/account/promotions/create"
          className="inline-flex items-center gap-2 bg-blue-950 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Promotion
        </Link>
      </div>
      <PromotionsList initialPromotions={promotions || []} />
    </div>
  );
}
