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
        const result = await getAllOrders();
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
        <Loader2 className="w-8 h-8 text-sky-700 animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading Orders...</p>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="space-y-8 pb-20 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
            {isAdmin ? 'Orders Management' : 'My Orders'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin
              ? 'Manage store orders, fulfillment status, and customer shipments.'
              : 'Track, review, and view details for all your purchases.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-600 hover:text-blue-950 hover:border-slate-300 transition-all shadow-sm">
              Export Orders
            </button>
          </div>
        )}
      </div>

      {orders.length > 0 ? (
        <OrdersList initialOrders={orders} />
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/80 shadow-sm px-6">
          <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-stone-300">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-blue-950 mb-1.5">No Orders Found</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            {isAdmin
              ? 'No customer orders have been recorded in the store yet.'
              : 'You have not placed any orders yet. Discover our collection of premium mattresses and furniture.'}
          </p>
          {!isAdmin && (
            <a
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-950 hover:bg-sky-800 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Browse Products
            </a>
          )}
        </div>
      )}
    </div>
  );
}
