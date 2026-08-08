'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardStats, getRecentOrders } from '@/actions/dashboard';
import AdminOverview from '@/components/admin/AdminOverview';
import CustomerOverview from '@/components/account/CustomerOverview';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalBrands: number;
  paidOrderCount: number;
  revenue: number;
};

type RecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string | Date;
};

export default function AccountOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const loadAccountData = async () => {
      if (authLoading || !user) return;

      setLoading(true);
      try {
        if (user.role === 'ADMIN') {
          const [statsResult, ordersResult] = await Promise.all([
            getDashboardStats(),
            getRecentOrders(8),
          ]);
          if (statsResult.success && statsResult.data) setStats(statsResult.data);
          if (ordersResult.success) setRecentOrders(ordersResult.data || []);
        } else {
          const ordersResult = await getRecentOrders(8, user.email);
          if (ordersResult.success) setRecentOrders(ordersResult.data || []);
        }
      } catch (error) {
        console.error('Failed to load account data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadAccountData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-sky-700 animate-spin" />
        <p className="text-sm text-stone-500">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  if (user.role === 'ADMIN') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-950 tracking-tight">
            Dashboard
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Orders, products, and store activity.
          </p>
        </div>
        {stats ? (
          <AdminOverview stats={stats} recentOrders={recentOrders} />
        ) : (
          <p className="text-sm text-stone-500">Couldn’t load dashboard stats.</p>
        )}
      </div>
    );
  }

  return <CustomerOverview user={user} recentOrders={recentOrders} />;
}
