'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, updateOrderStatus } from '@/actions/orders';
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
    Printer,
    ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [adminStatus, setAdminStatus] = useState<string>('');
    const [trackingNote, setTrackingNote] = useState<string>('');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

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
                    setAdminStatus(result.data.status);
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

    const handleUpdateStatus = async () => {
        if (!order || !adminStatus) return;
        setIsUpdatingStatus(true);
        try {
            const result = await updateOrderStatus(order.id, adminStatus, trackingNote);
            if (result.success && result.data) {
                setOrder((prev: any) => ({ ...prev, ...result.data }));
                toast.success(`Order status updated to ${adminStatus} and email notification dispatched`);
                setTrackingNote('');
            } else {
                toast.error(result.error || 'Failed to update order status');
            }
        } catch {
            toast.error('Unexpected error updating order');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 print:hidden">
                <Loader2 className="w-8 h-8 text-sky-700 animate-spin" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading order details...</p>
            </div>
        );
    }

    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* SCREEN VIEW */}
            <div className="space-y-10 pb-24 font-sans max-w-5xl mx-auto print:hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <Link
                            href="/account/orders"
                            className="w-10 h-10 bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-blue-950 hover:border-stone-300 transition-all group"
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
                    <div className="flex items-center gap-3">
                        {order.paymentReference && (
                            <div className="px-4 py-2 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-2.5">
                                <CreditCard className="w-4 h-4 text-sky-700" />
                                <span className="text-xs font-semibold text-sky-800">
                                    Ref: {order.paymentReference}
                                </span>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white text-xs font-black uppercase tracking-wider hover:bg-sky-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print Invoice</span>
                        </button>
                    </div>
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
                                    <span>Delivery &amp; Bulky Handling Fee</span>
                                    <span className="text-blue-950 font-semibold">₦{order.deliveryFee.toLocaleString()}</span>
                                </div>
                                {order.discount > 0 ? (
                                    <div className="flex justify-between items-center text-xs font-medium text-sky-700">
                                        <span>Promo Discount {order.promoCode ? `(${order.promoCode})` : ''}</span>
                                        <span className="font-semibold">-₦{order.discount.toLocaleString()}</span>
                                    </div>
                                ) : null}
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

                        {/* Admin Backoffice Order Management */}
                        {user?.role === 'ADMIN' && (
                            <div className="bg-blue-950 text-white rounded-2xl p-6 shadow-sm space-y-4 print:hidden">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                        Admin Order Desk
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block mb-1.5">
                                            Update Order Status
                                        </label>
                                        <select
                                            value={adminStatus}
                                            onChange={(e) => setAdminStatus(e.target.value)}
                                            disabled={isUpdatingStatus}
                                            className="w-full bg-blue-900 border border-blue-800 text-white rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer disabled:opacity-50"
                                        >
                                            <option value="PENDING">PENDING (Awaiting Payment)</option>
                                            <option value="PAID">PAID (Payment Confirmed)</option>
                                            <option value="PROCESSING">PROCESSING (Preparing Dispatch)</option>
                                            <option value="SHIPPED">SHIPPED (In Transit)</option>
                                            <option value="DELIVERED">DELIVERED (Fulfilled)</option>
                                            <option value="CANCELLED">CANCELLED (Void / Restocked)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block mb-1.5">
                                            Tracking / Delivery Note (Optional)
                                        </label>
                                        <textarea
                                            value={trackingNote}
                                            onChange={(e) => setTrackingNote(e.target.value)}
                                            placeholder="e.g. Driver Emeka: 08012345678, dispatched at 10:30am..."
                                            rows={2}
                                            disabled={isUpdatingStatus}
                                            className="w-full bg-blue-900/80 border border-blue-800 text-white placeholder-blue-300/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                                        />
                                        <p className="text-[10px] text-blue-300/70 mt-1">
                                            This note will be included directly in the customer's status update email.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleUpdateStatus}
                                        disabled={isUpdatingStatus || (!trackingNote && adminStatus === order.status)}
                                        className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                                    >
                                        {isUpdatingStatus ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Updating Order…</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Update &amp; Notify Customer</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRINT-ONLY FORMAL A4 INVOICE */}
            <div className="hidden print:block max-w-[210mm] mx-auto bg-white text-black p-8 font-sans leading-normal">
                {/* Invoice Header */}
                <div className="border-b-2 border-slate-900 pb-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-black tracking-wider uppercase text-slate-900">
                                SMART BEST BRANDS
                            </h1>
                            <p className="text-xs text-slate-600 mt-1">
                                Premium Mattresses, Pillows &amp; Furniture
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Lagos, Nigeria · +234 806 461 9479 · orders@smartbestbrands.com
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                                Official Invoice
                            </h2>
                            <p className="font-mono text-sm font-bold text-slate-800 mt-1">
                                #{order.orderNumber}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Date: {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bill To & Payment Info */}
                <div className="grid grid-cols-2 gap-8 mb-6 text-xs">
                    <div>
                        <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">Customer / Delivery To:</p>
                        <p className="font-semibold text-slate-800 text-sm">{order.customerName}</p>
                        <p className="text-slate-600 mt-0.5">{order.customerPhone}</p>
                        <p className="text-slate-600">{order.customerEmail}</p>
                        <p className="text-slate-700 mt-1 leading-relaxed">
                            {order.deliveryAddress}, {order.deliveryLocation}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">Payment Summary:</p>
                        <p className="text-slate-700">
                            <span className="font-semibold">Method: </span>
                            <span className="uppercase font-mono">{order.paymentMethod}</span>
                        </p>
                        <p className="text-slate-700 mt-0.5">
                            <span className="font-semibold">Status: </span>
                            <span className="uppercase font-bold">{order.status}</span>
                        </p>
                        {order.paymentReference && (
                            <p className="text-slate-700 mt-0.5">
                                <span className="font-semibold">Ref: </span>
                                <span className="font-mono">{order.paymentReference}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-xs mb-6 border-collapse">
                    <thead>
                        <tr className="border-y-2 border-slate-900 bg-slate-100">
                            <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-slate-900">Item Description</th>
                            <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-slate-900">Size</th>
                            <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-slate-900 text-center">Qty</th>
                            <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-slate-900 text-right">Unit Price</th>
                            <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-slate-900 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {order.items.map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="py-3 px-3 font-medium text-slate-900">
                                    {item.variant?.product?.name || 'Mattress Item'}
                                </td>
                                <td className="py-3 px-3 text-slate-600">
                                    {item.variant?.size?.label || 'Standard'}
                                </td>
                                <td className="py-3 px-3 text-center text-slate-900 font-semibold">
                                    {item.quantity}
                                </td>
                                <td className="py-3 px-3 text-right text-slate-700 font-mono">
                                    ₦{item.price.toLocaleString()}
                                </td>
                                <td className="py-3 px-3 text-right text-slate-900 font-bold font-mono">
                                    ₦{(item.price * item.quantity).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Calculation Totals */}
                <div className="flex justify-end mb-8">
                    <div className="w-72 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                            <span>Subtotal:</span>
                            <span className="font-mono font-semibold text-slate-900">₦{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                            <span>Delivery &amp; Freight:</span>
                            <span className="font-mono font-semibold text-slate-900">₦{order.deliveryFee.toLocaleString()}</span>
                        </div>
                        {order.discount > 0 ? (
                            <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                                <span>Discount {order.promoCode ? `(${order.promoCode})` : ''}:</span>
                                <span className="font-mono font-semibold text-slate-900">-₦{order.discount.toLocaleString()}</span>
                            </div>
                        ) : null}
                        <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-bold text-slate-900">
                            <span>Grand Total:</span>
                            <span className="font-mono text-base">₦{order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notice */}
                <div className="border-t border-slate-300 pt-6 text-[10px] text-slate-500 leading-relaxed">
                    <p className="font-semibold text-slate-700 mb-1">
                        Thank you for choosing Smart Best Brands.
                    </p>
                    <p>
                        All products come with our authentic manufacturer warranty. For questions or delivery scheduling, contact customer care at +234 806 461 9479 or email orders@smartbestbrands.com.
                    </p>
                    <p className="mt-2 text-slate-400">
                        This is a computer-generated commercial document. Valid without physical signature.
                    </p>
                </div>
            </div>
        </>
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
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {icons[status]}
            {status}
        </span>
    );
}
