'use client';

import React from 'react';
import {
    Package,
    Heart,
    History,
    ArrowRight,
    Star,
    ShieldCheck,
    HeadphonesIcon
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CustomerOverviewProps {
    user: {
        name?: string;
        email: string;
    };
    recentOrders: any[];
}

export default function CustomerOverview({ user, recentOrders }: CustomerOverviewProps) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Elite Welcome Hero */}
            <div className="relative overflow-hidden bg-blue-950 rounded-[2.5rem] p-10 md:p-14 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-300 border border-sky-500/20">
                            <Star className="w-3 h-3 fill-sky-300" /> Elite Member
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
                            Welcome Back, <span className="text-sky-400">{user.name || 'Member'}</span>
                        </h1>
                        <p className="text-slate-300 font-medium max-w-md">
                            Your personal collection of comfort and luxury. Manage your orders and enjoy elite benefits.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/shop"
                            className="bg-white text-blue-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-xl"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard
                    icon={Package}
                    label="Recent Order"
                    value={recentOrders.length > 0 ? recentOrders[0].orderNumber : 'No Orders yet'}
                    status={recentOrders.length > 0 ? recentOrders[0].status : 'N/A'}
                    href="/account/orders"
                />
                <StatusCard
                    icon={Heart}
                    label="Favorites"
                    value="0 Items"
                    status="View Wishlist"
                    href="/account/wishlist"
                />
                <StatusCard
                    icon={ShieldCheck}
                    label="Elite Security"
                    value="Protected"
                    status="Account Verified"
                    href="/account/settings"
                />
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 p-8 shadow-xl shadow-blue-950/5">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                            <History className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Recent Activity</h2>
                    </div>
                    <Link href="/account/orders" className="text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                        See All History <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-gray-900 rounded-2xl border border-transparent hover:border-sky-100 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-950 dark:text-white uppercase tracking-tight">{order.orderNumber}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-blue-950 dark:text-white">₦{order.total.toLocaleString()}</p>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto text-slate-200">
                            <Package className="w-10 h-10 italic" />
                        </div>
                        <p className="text-slate-400 font-bold">No orders found. Your comfort journey starts here.</p>
                        <Link href="/shop" className="inline-block text-sky-600 font-black text-[10px] uppercase tracking-widest border-b-2 border-sky-100 pb-1">Browse Catalog</Link>
                    </div>
                )}
            </div>

            {/* Support Call-to-Action */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <HeadphonesIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-tight">Need Assistance?</h3>
                        <p className="text-sm text-indigo-800/60 dark:text-indigo-300 font-medium">Our elite support team is ready to help you 24/7.</p>
                    </div>
                </div>
                <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">
                    Contact Specialist
                </button>
            </div>
        </div>
    );
}

function StatusCard({ icon: Icon, label, value, status, href }: { icon: any, label: string, value: string, status: string, href: string }) {
    return (
        <Link href={href} className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-gray-700 p-8 shadow-xl shadow-blue-950/5 hover:-translate-y-1 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-950 transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black text-blue-950 dark:text-white tracking-tight uppercase leading-none mb-2">{value}</p>
                <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{status}</p>
            </div>
        </Link>
    );
}
