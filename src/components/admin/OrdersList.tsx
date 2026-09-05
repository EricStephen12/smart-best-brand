'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Eye,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    Package
} from 'lucide-react';
import { updateOrderStatus } from '@/actions/orders';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    deliveryLocation: string;
    total: number;
    status: string;
    createdAt: Date;
    items: any[];
}

interface OrdersListProps {
    initialOrders: any[];
}

export default function OrdersList({ initialOrders }: OrdersListProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const result = await updateOrderStatus(id, newStatus);
            if (result.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
                toast.success(`Order ${newStatus.toLowerCase()}`);
            } else {
                toast.error(result.error || 'Failed to update status');
            }
        } catch (error) {
            toast.error('Unexpected error');
        } finally {
            setUpdatingId(null);
        }
    };

    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by order number or customer name..."
                        className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm font-medium text-blue-950 placeholder-stone-400 outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all font-sans"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4">Order #</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-700">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-blue-950 text-sm">{order.orderNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-blue-950 text-sm leading-tight">{order.customerName}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{order.deliveryLocation}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-600">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-[11px] text-slate-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status.toLowerCase()} />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-blue-950 text-sm">
                                        ₦{order.total.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {isAdmin && (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    disabled={updatingId === order.id}
                                                    className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-950/20 outline-none cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PAID">Paid</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            )}
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className="p-2 hover:bg-stone-100 rounded-lg text-slate-400 hover:text-blue-950 transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-14 text-center">
                                        <p className="text-sm font-medium text-slate-500">No matching orders found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "text-amber-500 bg-amber-50",
        paid: "text-emerald-500 bg-emerald-50",
        processing: "text-blue-500 bg-blue-50",
        shipped: "text-sky-500 bg-sky-50",
        delivered: "text-emerald-500 bg-emerald-50",
        cancelled: "text-rose-500 bg-rose-50",
    };

    const icons: Record<string, React.ReactNode> = {
        pending: <Clock className="w-3 h-3" />,
        paid: <CheckCircle className="w-3 h-3" />,
        processing: <Loader2 className="w-3 h-3 animate-spin" />,
        shipped: <Truck className="w-3 h-3" />,
        delivered: <CheckCircle className="w-3 h-3" />,
        cancelled: <XCircle className="w-3 h-3" />,
    };

    return (
        <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
            {icons[status]}
            <span>{status}</span>
        </span>
    );
}
