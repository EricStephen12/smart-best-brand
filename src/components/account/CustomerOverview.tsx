'use client';

import React from 'react';
import { ArrowRight, Package } from 'lucide-react';
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

function statusStyle(status: string) {
    switch (status) {
        case 'DELIVERED':
            return 'text-emerald-700 bg-emerald-50';
        case 'PAID':
        case 'PROCESSING':
        case 'SHIPPED':
            return 'text-sky-700 bg-sky-50';
        case 'CANCELLED':
            return 'text-red-700 bg-red-50';
        default:
            return 'text-amber-700 bg-amber-50';
    }
}

export default function CustomerOverview({ user, recentOrders }: CustomerOverviewProps) {
    const firstName = user.name?.split(' ')[0] || 'there';

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-blue-950 tracking-tight">
                        Hi, {firstName}
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        Your orders and account for Smart Best Brands.
                    </p>
                </div>
                <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-950 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
                >
                    Shop products
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <section className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-blue-950">Your orders</h2>
                    <Link href="/account/orders" className="text-sm text-sky-700 hover:underline">
                        View all
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
                                            {order.orderNumber}
                                        </p>
                                        <p className="text-xs text-stone-500 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-blue-950">
                                            ₦{Number(order.total).toLocaleString()}
                                        </p>
                                        <span className={`inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded ${statusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="px-5 py-14 text-center">
                        <Package className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                        <p className="text-sm text-stone-600 mb-1">No orders yet</p>
                        <p className="text-xs text-stone-400 mb-4">When you order, it will show up here.</p>
                        <Link href="/products" className="text-sm font-medium text-sky-700 hover:underline">
                            Browse the shop
                        </Link>
                    </div>
                )}
            </section>

            <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/account/settings" className="px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-700 hover:border-stone-300">
                    Account settings
                </Link>
                <Link href="/contact" className="px-3 py-2 border border-stone-200 bg-white rounded-lg text-stone-700 hover:border-stone-300">
                    Contact support
                </Link>
            </div>
        </div>
    );
}
