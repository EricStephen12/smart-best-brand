'use client';

import React from 'react';
import { Package, ShoppingBag, Tags, Banknote, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AdminOverviewProps {
    stats: {
        totalProducts: number;
        totalOrders: number;
        totalBrands: number;
        paidOrderCount: number;
        revenue: number;
    };
    recentOrders: Array<{
        id: string;
        customerName: string;
        total: number;
        orderNumber: string;
        status: string;
        createdAt?: string | Date;
    }>;
}

function statusStyle(status: string) {
    switch (status) {
        case 'DELIVERED':
            return 'text-emerald-700';
        case 'CANCELLED':
            return 'text-red-600';
        case 'PENDING':
            return 'text-amber-600';
        default:
            return 'text-sky-700';
    }
}

export default function AdminOverview({ stats, recentOrders }: AdminOverviewProps) {
    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                        Store Dashboard
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        High-level summary of store activity, sales revenue, and recent customer orders.
                    </p>
                </div>
                <Link
                    href="/account/analytics"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-sky-900 transition-all shadow-sm self-start sm:self-auto shrink-0"
                >
                    <BarChart3 className="w-4 h-4 text-sky-400" />
                    <span>Detailed Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat
                    label="Orders"
                    value={stats.totalOrders.toString()}
                    hint={`${stats.paidOrderCount} paid`}
                    icon={Package}
                />
                <Stat
                    label="Revenue"
                    value={`₦${Number(stats.revenue).toLocaleString()}`}
                    hint="Paid & fulfilled"
                    icon={Banknote}
                />
                <Stat
                    label="Products"
                    value={stats.totalProducts.toString()}
                    hint="Active listings"
                    icon={ShoppingBag}
                />
                <Stat
                    label="Brands"
                    value={stats.totalBrands.toString()}
                    hint="Active brands"
                    icon={Tags}
                />
            </div>

            <section className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-blue-950">Recent orders</h2>
                    <Link href="/account/orders" className="text-sm text-sky-700 hover:underline">
                        Manage orders
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <ul className="divide-y divide-stone-100">
                        {recentOrders.map((order) => (
                            <li key={order.id}>
                                <Link
                                    href={`/account/orders/${order.id}`}
                                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-stone-50 transition-colors"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-blue-950 truncate">
                                            {order.customerName}
                                        </p>
                                        <p className="text-xs text-stone-500 mt-0.5 truncate">
                                            {order.orderNumber}
                                            {order.createdAt
                                                ? ` · ${new Date(order.createdAt).toLocaleDateString('en-US', { timeZone: 'UTC' })}`
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-blue-950">
                                            ₦{Number(order.total).toLocaleString()}
                                        </p>
                                        <p className={`text-[11px] font-medium mt-0.5 ${statusStyle(order.status)}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="px-5 py-12 text-center text-sm text-stone-500">No orders yet</p>
                )}
            </section>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <QuickLink href="/account/products" label="Products" />
                <QuickLink href="/account/orders" label="Orders" />
                <QuickLink href="/account/delivery-locations" label="Delivery" />
                <QuickLink href="/account/promotions" label="Promotions" />
            </div>
        </div>
    );
}

function Stat({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label: string;
    value: string;
    hint: string;
    icon: React.ElementType;
}) {
    return (
        <div className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-stone-500">{label}</p>
                <Icon className="w-4 h-4 text-stone-400" />
            </div>
            <p className="text-xl font-semibold text-blue-950 tracking-tight">{value}</p>
            <p className="text-xs text-stone-400 mt-1">{hint}</p>
        </div>
    );
}

function QuickLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="px-3 py-2.5 text-center text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:border-stone-300 hover:text-blue-950 transition-colors"
        >
            {label}
        </Link>
    );
}
