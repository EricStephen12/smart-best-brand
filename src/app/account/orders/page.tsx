'use client';

import React, { useEffect, useState } from 'react';
import OrdersList from '@/components/admin/OrdersList';
import { getAllOrders } from '@/actions/orders';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (authLoading || !user) return;

      setLoading(true);
      try {
        // Admins see all, customers see their own
        const result = await getAllOrders(user.role === 'ADMIN' ? undefined : user.email);
        if (result.success) {
          setOrders(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Orders...</p>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="space-y-10 pb-20 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-950 dark:text-white tracking-tight uppercase leading-none mb-1">
            {isAdmin ? 'Store Dispatch' : 'Order Dossier'}
          </h1>
          <p className="text-slate-400 font-medium font-inter">
            {isAdmin
              ? 'Manage and fulfill elite global order essences.'
              : 'Review your personalized collection of purchase history.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-950 dark:hover:text-white transition-all shadow-xl shadow-blue-900/5">
              Export Dossier
            </button>
          </div>
        )}
      </div>

      {orders.length > 0 ? (
        <OrdersList initialOrders={orders} />
      ) : (
        <div className="py-24 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 shadow-xl shadow-blue-950/5">
          <div className="w-20 h-20 bg-slate-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Package className="w-10 h-10 italic" />
          </div>
          <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tight mb-2">Empty Archives</h2>
          <p className="text-slate-400 font-medium max-w-sm mx-auto">
            {isAdmin
              ? 'No orders have been dispatched from the store yet.'
              : 'Your purchase history is currently a clean slate. Start your journey in the shop.'}
          </p>
        </div>
      )}
    </div>
  );
}
