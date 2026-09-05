'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/actions/orders';
import { useAuth } from '@/hooks/use-auth';
import {
    ChevronLeft,
    Package,
    MapPin,
    CreditCard,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Loader2,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            if (!params.id) return;
            try {
                const result = await getOrderById(params.id as string);
                if (result.success && result.data) {
                    // Security check: Customer can only see their own order
                    if (user?.role !== 'ADMIN' && result.data.customerEmail?.toLowerCase() !== user?.email?.toLowerCase()) {
                        toast.error('Unauthorized access');
                        router.push('/account/orders');
                        return;
                    }
                    setOrder(result.data);
                } else {
                    toast.error('Order not found');
                    router.push('/account/orders');
                }
            } catch (error) {
                console.error('Failed to load order:', error);
                toast.error('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        if (user) loadOrder();
    }, [params.id, user, router]);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-sky-700 animate-spin" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading order details...</p>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-10 pb-24 font-sans max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <Link
                        href="/account/orders"
                        className="w-11 h-11 bg-white rounded-xl border border-stone-200 flex items-center justify-center text-slate-500 hover:text-blue-950 hover:border-stone-300 transition-all group shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
                                Order #{order.orderNumber}
                            </h1>
                            <StatusBadge status={order.status.toLowerCase()} />
                        </div>
                        <p className="text-slate-500 text-sm">
                            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                    </div>
                </div>
                {order.paymentReference && (
                    <div className="px-4 py-2 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-semibold text-sky-800">
                            Ref: {order.paymentReference}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                            <Package className="w-5 h-5 text-blue-950" />
                            <h2 className="text-lg font-bold text-blue-950">Order Items</h2>
                        </div>

                        <div className="divide-y divide-stone-100">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 sm:gap-6 group">
                                    <div className="w-20 h-20 bg-stone-50 rounded-xl flex-shrink-0 relative overflow-hidden border border-stone-100">
                                        {item.variant?.product?.images?.[0] ? (
                                            <img
                                                src={item.variant.product.images[0]}
                                                alt={item.variant.product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                <Package className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <div className="flex justify-between items-start gap-3 mb-1.5">
                                            <div>
                                                <p className="text-sm font-semibold text-blue-950 line-clamp-1">
                                                    {item.variant?.product?.name || 'Product'}
                                                </p>
                                                {item.variant?.size?.label && (
                                                    <span className="inline-block mt-1 text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                                                        Size: {item.variant.size.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-bold text-blue-950 text-sm sm:text-base shrink-0">
                                                ₦{item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <p className="text-xs text-stone-500 font-medium">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
                            <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                                <span>Subtotal</span>
                                <span className="text-blue-950 font-semibold">₦{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                                <span>Delivery Fee</span>
                                <span className="text-blue-950 font-semibold">₦{order.deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                                <span className="text-sm font-bold text-blue-950">Total</span>
                                <span className="text-xl font-black text-blue-950 tracking-tight">₦{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    {/* Delivery Card */}
                    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm">
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-stone-100">
                            <MapPin className="w-5 h-5 text-blue-950" />
                            <h3 className="text-base font-bold text-blue-950">Delivery Address</h3>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Customer Name</p>
                                <p className="font-semibold text-blue-950">{order.customerName}</p>
                                {order.customerPhone && (
                                    <p className="text-xs text-slate-500 mt-0.5">{order.customerPhone}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">State / Region</p>
                                <p className="font-semibold text-blue-950">{order.deliveryLocation}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Address</p>
                                <p className="text-slate-700 leading-relaxed">{order.deliveryAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Status Card */}
                    <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm">
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-stone-100">
                            <CreditCard className="w-5 h-5 text-blue-950" />
                            <h3 className="text-base font-bold text-blue-950">Payment Details</h3>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                                <p className="font-semibold text-blue-950 uppercase">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${order.status === 'PAID' || order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <p className="font-semibold text-blue-950">
                                        {order.status === 'PAID' || order.status === 'DELIVERED' ? 'Paid' : 'Payment Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "text-amber-500 bg-amber-50 border-amber-100",
        paid: "text-emerald-500 bg-emerald-50 border-emerald-100",
        processing: "text-blue-500 bg-blue-50 border-blue-100",
        shipped: "text-sky-500 bg-sky-50 border-sky-100",
        delivered: "text-emerald-500 bg-emerald-50 border-emerald-100",
        cancelled: "text-rose-500 bg-rose-50 border-rose-100",
    };

    const icons: Record<string, React.ReactNode> = {
        pending: <Clock className="w-3 h-3" />,
        paid: <CheckCircle2 className="w-3 h-3" />,
        processing: <Loader2 className="w-3 h-3 animate-spin" />,
        shipped: <Truck className="w-3 h-3" />,
        delivered: <CheckCircle2 className="w-3 h-3" />,
        cancelled: <XCircle className="w-3 h-3" />,
    };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {icons[status]}
            {status}
        </span>
    );
}
