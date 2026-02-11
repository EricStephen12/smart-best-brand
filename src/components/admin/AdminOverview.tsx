'use client';

import React from 'react';
import {
    Package,
    ShoppingBag,
    Users,
    DollarSign,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface AdminOverviewProps {
    stats: any;
    recentOrders: any[];
}

export default function AdminOverview({ stats, recentOrders }: AdminOverviewProps) {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Listing Value"
                    value={`₦ ${stats.totalValue.toLocaleString()}`}
                    change={stats.valueChange}
                    icon={DollarSign}
                    color="blue-950"
                />
                <StatCard
                    title="Procurement Volume"
                    value={stats.totalOrders.toString()}
                    change={stats.orderChange}
                    icon={Package}
                    color="sky"
                />
                <StatCard
                    title="Active Essences"
                    value={stats.totalProducts.toString()}
                    change={stats.productChange}
                    icon={ShoppingBag}
                    color="blue-950"
                />
                <StatCard
                    title="Patron Base"
                    value={stats.totalBrands.toString()}
                    change={stats.brandChange}
                    icon={Users}
                    color="sky"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-slate-100 dark:border-gray-700 shadow-xl shadow-blue-950/5">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-widest">Recent Orders</h2>
                        <Link href="/account/orders" className="text-[10px] font-black text-sky-600 uppercase tracking-widest hover:text-blue-950 dark:hover:text-white transition-colors">View All &rarr;</Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-900 rounded-2xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center text-white font-black text-xs">
                                        {order.customerName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-950 dark:text-white">{order.customerName}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase">₦ {order.total.toLocaleString()} &bull; {order.orderNumber}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-sky-600'}`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <p className="text-center text-slate-400 font-bold py-10 uppercase tracking-widest text-xs">No Recent Activity</p>
                        )}
                    </div>
                </div>

                <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/10">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black uppercase tracking-widest">System Protocols</h2>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-6">
                        <div className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Automated Optimization</p>
                            <p className="text-sm font-bold mb-4 font-inter">Global stock levels are synchronized with production facilities in real-time.</p>
                            <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/20 rounded-xl hover:bg-white hover:text-blue-950 transition-all">Review Logistics</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string | number, icon: React.ElementType, color: string }) {
    const isBlue = color === 'blue-950';

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 shadow-lg shadow-blue-950/5 hover:shadow-xl hover:shadow-blue-950/10 transition-all group">
            <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl transition-all duration-500 ${isBlue ? 'bg-blue-950 text-white group-hover:bg-sky-600' : 'bg-sky-100 dark:bg-sky-900/20 text-sky-600 group-hover:bg-blue-950 group-hover:text-white'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 dark:bg-green-900/10 px-3 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span>{change}</span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-blue-950 dark:text-white tracking-tighter leading-none">{value}</h3>
            </div>
        </div>
    );
}
