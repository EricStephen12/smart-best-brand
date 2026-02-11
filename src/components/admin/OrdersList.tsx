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

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-gray-700 p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search order ID or patron name..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold text-blue-950 dark:text-white outline-none focus:ring-4 focus:ring-sky-600/10 transition-all font-sans"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 shadow-xl shadow-blue-950/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-gray-700/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="px-8 py-6">Identity</th>
                                <th className="px-8 py-6">Patron</th>
                                <th className="px-8 py-6">Timeline</th>
                                <th className="px-8 py-6">Condition</th>
                                <th className="px-8 py-6">Value</th>
                                <th className="px-8 py-6 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <span className="font-black text-blue-950 dark:text-white">{order.orderNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-blue-950 dark:text-white leading-tight">{order.customerName}</p>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{order.deliveryLocation}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-300 italic">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={order.status.toLowerCase()} />
                                    </td>
                                    <td className="px-8 py-6 font-black text-blue-950 dark:text-white">
                                        ₦ {order.total.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={updatingId === order.id}
                                                className="bg-slate-50 dark:bg-gray-900 border-none rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:ring-4 focus:ring-sky-600/10 outline-none cursor-pointer disabled:opacity-50"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PAID">Paid</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                            <Link
                                                href={`/account/orders/${order.id}`}
                                                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl text-slate-300 hover:text-sky-600 transition-all shadow-sm"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No dispatches found in archives.</p>
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
        pending: "text-amber-500 bg-amber-50 dark:bg-amber-900/10",
        paid: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10",
        processing: "text-blue-500 bg-blue-50 dark:bg-blue-900/10",
        shipped: "text-sky-500 bg-sky-50 dark:bg-sky-900/10",
        delivered: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10",
        cancelled: "text-rose-500 bg-rose-50 dark:bg-rose-900/10",
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
