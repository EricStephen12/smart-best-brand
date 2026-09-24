'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search, Eye, Truck, CheckCircle, XCircle,
    Clock, Loader2, Package, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { updateOrderStatus } from '@/actions/orders';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';

interface OrdersListProps {
    initialOrders: any[];
}

const PAGE_SIZE = 20;

export default function OrdersList({ initialOrders }: OrdersListProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const statusCounts = {
        ALL: orders.length,
        PENDING: orders.filter(o => o.status === 'PENDING').length,
        PAID: orders.filter(o => o.status === 'PAID').length,
        PROCESSING: orders.filter(o => o.status === 'PROCESSING').length,
        SHIPPED: orders.filter(o => o.status === 'SHIPPED').length,
        DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
        CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                !searchTerm ||
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                selectedStatus === 'ALL' || order.status.toUpperCase() === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, selectedStatus]);

    // Reset page on filter change
    const prevCount = React.useRef(filteredOrders.length);
    React.useEffect(() => {
        if (prevCount.current !== filteredOrders.length) {
            setPage(1);
            prevCount.current = filteredOrders.length;
        }
    }, [filteredOrders.length]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
    const paginated = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleStatusChange = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const result = await updateOrderStatus(id, newStatus);
            if (result.success) {
                setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
                toast.success(`Order updated to ${newStatus.toLowerCase()}`);
            } else {
                toast.error(result.error || 'Failed to update status');
            }
        } catch {
            toast.error('Unexpected error');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-2xl border border-stone-200 p-3">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by order number, customer name or email…"
                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-blue-950 placeholder-stone-400 outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Status tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((st) => {
                    const active = selectedStatus === st;
                    const count = statusCounts[st];
                    const isPending = st === 'PENDING' && count > 0;
                    return (
                        <button
                            key={st}
                            type="button"
                            onClick={() => setSelectedStatus(st)}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                active
                                    ? 'bg-blue-950 text-white shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-stone-100 border border-stone-200'
                            }`}
                        >
                            {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                active ? 'bg-white/20 text-white'
                                : isPending ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-slate-500'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
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
                            {paginated.map((order) => (
                                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-700 shrink-0">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-blue-950 text-sm">{order.orderNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-blue-950 text-sm leading-tight">{order.customerName}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{order.deliveryLocation}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium text-slate-600 block">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
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
                                            {updatingId === order.id && (
                                                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                                            )}
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className="p-2 hover:bg-stone-100 rounded-lg text-slate-400 hover:text-blue-950 transition-all"
                                                title="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <p className="text-sm text-stone-500">No orders match your search or filter.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-stone-400">
                        Page <span className="font-semibold text-blue-950">{page}</span> of {totalPages}
                        {' '}· {filteredOrders.length} orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-stone-200 rounded-xl text-blue-950 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Previous
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-stone-200 rounded-xl text-blue-950 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: 'text-amber-600 bg-amber-50',
        paid: 'text-emerald-600 bg-emerald-50',
        processing: 'text-blue-600 bg-blue-50',
        shipped: 'text-sky-600 bg-sky-50',
        delivered: 'text-emerald-600 bg-emerald-50',
        cancelled: 'text-rose-600 bg-rose-50',
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
        <span className={`flex items-center gap-1.5 w-fit px-3 py-1 text-[10px] font-black uppercase tracking-widest ${styles[status] || ''}`}>
            {icons[status]}
            <span>{status}</span>
        </span>
    );
}
