'use client';

import React from 'react';
import { ArrowRight, Package, ShoppingBag, ShieldCheck, Truck, Clock, ChevronRight, User, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface CustomerOrder {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string | Date;
}

interface CustomerOverviewProps {
    user: {
        name?: string | null;
        email: string;
    };
    recentOrders: CustomerOrder[];
}

function statusBadge(status: string) {
    const s = status.toUpperCase();
    switch (s) {
        case 'DELIVERED':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Delivered
                </span>
            );
        case 'SHIPPED':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    Shipped
                </span>
            );
        case 'PAID':
        case 'PROCESSING':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {s === 'PAID' ? 'Paid' : 'Processing'}
                </span>
            );
        case 'CANCELLED':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Cancelled
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Pending
                </span>
            );
    }
}

export default function CustomerOverview({ user, recentOrders }: CustomerOverviewProps) {
    const displayName = user.name ? user.name.split(' ')[0] : 'there';

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Greeting Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-slate-600 text-xs font-semibold mb-3">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Customer Account
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
                        Welcome back, {displayName}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1.5 max-w-xl">
                        Manage your orders, track active deliveries, and update your account details.
                    </p>
                </div>
                <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-950 hover:bg-sky-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all shrink-0"
                >
                    Explore Shop
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700 shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
                        <p className="text-xl font-black text-blue-950 mt-0.5">{recentOrders.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Status</p>
                        <p className="text-sm font-bold text-emerald-700 mt-0.5">Active & Verified</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Delivery</p>
                        <p className="text-sm font-bold text-blue-950 mt-0.5">Nationwide Nigeria</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <section className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-blue-950">Recent Orders</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Your latest purchases and current fulfillment status</p>
                    </div>
                    {recentOrders.length > 0 && (
                        <Link
                            href="/account/orders"
                            className="text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors inline-flex items-center gap-1"
                        >
                            View All Orders
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    )}
                </div>

                {recentOrders.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50/70 transition-colors group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-950 transition-colors">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-blue-950 truncate group-hover:text-sky-700 transition-colors">
                                            Order #{order.orderNumber}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-5">
                                    {statusBadge(order.status)}
                                    <p className="text-sm font-black text-blue-950">
                                        ₦{Number(order.total).toLocaleString()}
                                    </p>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-950 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-400">
                            <Package className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-blue-950 mb-1">No Orders Yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                            When you place an order for mattresses, pillows, or furniture, you will be able to track delivery here.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-950 hover:bg-sky-800 text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                            Browse Store Collection
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                )}
            </section>

            {/* Helpful Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/account/settings"
                    className="p-5 bg-white border border-stone-200/80 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all flex items-start gap-4 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-950 group-hover:text-white transition-colors shrink-0">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-950 group-hover:text-sky-700 transition-colors">
                            Account Settings
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Update your name, email, and password security.
                        </p>
                    </div>
                </Link>

                <Link
                    href="/contact"
                    className="p-5 bg-white border border-stone-200/80 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all flex items-start gap-4 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-950 group-hover:text-white transition-colors shrink-0">
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-950 group-hover:text-sky-700 transition-colors">
                            Customer Support
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Questions regarding an order, custom sizing, or delivery? Contact our team.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
