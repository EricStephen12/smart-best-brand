'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardStats, getRecentOrders } from '@/actions/dashboard';
import AdminOverview from '@/components/admin/AdminOverview';
import CustomerOverview from '@/components/account/CustomerOverview';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AccountOverviewPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadAccountData = async () => {
      if (authLoading || !user) return;

      setLoading(true);
      try {
        if (user.role === 'ADMIN') {
          const [statsResult, ordersResult] = await Promise.all([
            getDashboardStats(),
            getRecentOrders(5)
          ]);
          if (statsResult.success) setStats(statsResult.data);
          if (ordersResult.success) setRecentOrders(ordersResult.data || []);
        } else {
          // Customer only sees their own orders
          const ordersResult = await getRecentOrders(5, user.email);
          if (ordersResult.success) setRecentOrders(ordersResult.data || []);
        }
      } catch (error) {
        console.error('Failed to load account data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Account...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="font-sans">
      {user.role === 'ADMIN' ? (
        <div className="space-y-12">
          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-blue-950 dark:text-white tracking-tight leading-none uppercase mb-2">
                Control <span className="text-sky-600">Center</span>
              </h1>
              <p className="text-slate-400 font-medium font-inter">
                Review the latest performance metrics for Smart Best Brands.
              </p>
            </div>
            <div className="px-6 py-4 bg-blue-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-950/20">
              System Operational
            </div>
          </div>
          {stats && <AdminOverview stats={stats} recentOrders={recentOrders} />}
        </div>
      ) : (
        <CustomerOverview user={user} recentOrders={recentOrders} />
      )}
    </div>
  );
}
