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
                <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifying Dossier...</p>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-12 pb-24 font-sans max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/account/orders"
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-blue-950 tracking-tight uppercase leading-none">
                                Order {order.orderNumber}
                            </h1>
                            <StatusBadge status={order.status.toLowerCase()} />
                        </div>
                        <p className="text-slate-400 font-medium font-inter">
                            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                    </div>
                </div>
                {order.paymentReference && (
                    <div className="px-6 py-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-sky-600" />
                        <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                            Ref: {order.paymentReference}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Items List */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-xl shadow-blue-950/5">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <Package className="w-5 h-5 text-blue-950" />
                            <h2 className="text-xl font-black text-blue-950 uppercase tracking-tight">Purchase Dossier</h2>
                        </div>

                        <div className="space-y-8">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-6 group">
                                    <div className="w-24 h-24 bg-slate-50 rounded-2xl flex-shrink-0 relative overflow-hidden">
                                        {item.variant.product.images?.[0] ? (
                                            <img
                                                src={item.variant.product.images[0]}
                                                alt={item.variant.product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                <Package className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs font-black text-blue-950 uppercase tracking-widest mb-1">
                                                    {item.variant.product.name}
                                                </p>
                                                <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded uppercase">
                                                    {item.variant.size?.label || 'Universal'}
                                                </span>
                                            </div>
                                            <p className="font-black text-blue-950">₦{item.price.toLocaleString()}</p>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Subtotal Value</span>
                                <span className="text-blue-950">₦{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Logistics Protocol</span>
                                <span className="text-blue-950">₦{order.deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                <span className="text-xs font-black text-sky-600 uppercase tracking-[0.2em]">Total Liquidation</span>
                                <span className="text-2xl font-black text-blue-950 tracking-tighter">₦{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    {/* Delivery Card */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200/50">
                        <div className="flex items-center gap-4 mb-8">
                            <MapPin className="w-5 h-5 text-blue-950" />
                            <h3 className="text-lg font-black text-blue-950 uppercase tracking-widest">Logistics</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recipient</p>
                                <p className="text-sm font-bold text-blue-950">{order.customerName}</p>
                                <p className="text-[10px] font-medium text-slate-500">{order.customerPhone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Jurisdiction</p>
                                <p className="text-sm font-bold text-blue-950 uppercase">{order.deliveryLocation}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precise Destination</p>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{order.deliveryAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Status Card */}
                    <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20">
                        <div className="flex items-center gap-4 mb-8">
                            <CreditCard className="w-5 h-5 text-sky-400" />
                            <h3 className="text-lg font-black uppercase tracking-widest">Settlement</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-sky-400/60 uppercase tracking-widest mb-2">Mechanism</p>
                                <p className="text-sm font-black uppercase tracking-widest">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-sky-400/60 uppercase tracking-widest mb-2">Condition</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${order.status === 'PAID' || order.status === 'DELIVERED' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                    <p className="text-sm font-black uppercase tracking-widest">
                                        {order.status === 'PAID' || order.status === 'DELIVERED' ? 'Secured' : 'Awaiting Settlement'}
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
