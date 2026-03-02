'use client';

import React, { useState } from 'react';
import { ShoppingBag, CreditCard, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/hooks/use-auth';
// usePaystackPayment removed
import { createOrder, updatePaymentReference } from '@/actions/orders';
import { validatePromotionCode } from '@/actions/promotions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Ticket } from 'lucide-react';

interface DeliveryZone {
    id: string;
    name: string;
    basePrice: number;
}

interface CheckoutFormProps {
    zones: DeliveryZone[];
}

export default function CheckoutForm({ zones }: CheckoutFormProps) {
    const { state, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [selectedZone, setSelectedZone] = useState<DeliveryZone>(zones[0] || { id: 'custom', name: 'Other Locations', basePrice: 0 });
    const [paymentMethod, setPaymentMethod] = useState('whatsapp');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const [couponCode, setCouponCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    // Pre-fill form with authenticated user data
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || user.name || '',
                email: prev.email || user.email || ''
            }));
        }
    }, [user]);

    const cartTotal = state.items.reduce((acc, item) => {
        const price = item.variant?.promoPrice || item.variant?.price || 0
        return acc + (price * item.quantity)
    }, 0);

    const discount = appliedPromo?.discount || 0;
    const total = cartTotal + (selectedZone?.basePrice || 0) - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidatingCoupon(true);
        try {
            const items = state.items.map(i => ({
                productId: i.product?.id,
                categoryIds: i.product?.categories?.map((c: any) => c.categoryId) || []
            }));

            const result = await validatePromotionCode(couponCode, cartTotal, items);
            if (result.success && result.data) {
                setAppliedPromo(result.data);
                toast.success(`Discount Applied: ₦${result.data.discount.toLocaleString()}`);
            } else {
                toast.error(result.error || 'Invalid code');
                setAppliedPromo(null);
            }
        } catch (error) {
            toast.error('Failed to validate code');
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    // Removal of usePaystackPayment hook for manual control

    const onSuccess = async (reference: any) => {
        // Order is already created, just confirm and redirect
        // The webhook will handle the status update reliably
        clearCart();
        router.push('/checkout/success');
        toast.success('Payment Received');
    };

    const onClose = () => {
        toast('Payment cancelled');
    }

    const handleCompleteOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Prepare common order data
            const orderData = {
                customerName: formData.name,
                customerEmail: formData.email.toLowerCase(),
                customerPhone: formData.phone,
                deliveryAddress: formData.address,
                deliveryLocation: selectedZone.name,
                deliveryFee: selectedZone.basePrice,
                subtotal: cartTotal,
                total: total,
                discount: discount,
                promoCode: appliedPromo?.promotion?.code || undefined,
                paymentMethod: paymentMethod === 'paystack' ? 'PAYSTACK' : 'WHATSAPP',
                userId: user?.id || undefined,
                items: state.items.map(item => ({
                    variantId: item.product_variant_id,
                    quantity: item.quantity,
                    price: item.variant?.promoPrice || item.variant?.price || 0
                }))
            };

            const result = await createOrder(orderData);

            if (!result.success || !result.data) {
                toast.error('Failed to initialize order');
                setIsProcessing(false);
                return;
            }

            if (paymentMethod === 'paystack') {
                const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

                if (!paystackKey) {
                    toast.error('Payment system configuration missing');
                    setIsProcessing(false);
                    return;
                }

                const paystackConfig = {
                    reference: result.data.orderNumber,
                    email: formData.email,
                    amount: total * 100,
                    key: paystackKey,
                };

                // @ts-ignore
                const handler = window.PaystackPop.setup({
                    ...paystackConfig,
                    callback: function (response: any) {
                        onSuccess(response);
                    },
                    onClose: function () {
                        onClose();
                        setIsProcessing(false);
                    }
                });
                handler.openIframe();
                return;
            }

            // WhatsApp Flow
            const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349033333333';
            const itemsList = state.items.map(i => `${i.product?.name} (${i.variant?.size?.label}) x${i.quantity}`).join(', ');
            const text = `⚜️ ELITE CONSIGNMENT REQUEST (${result.data.orderNumber})
            
Protocol: ${formData.name}
Contact: ${formData.phone}
Destination: ${formData.address}
Zone: ${selectedZone?.name}
Selection: ${itemsList}
Total Value: ₦${total.toLocaleString()}

Please confirm the dispatch timeline for this curation.`;

            const encodedText = encodeURIComponent(text);
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');

            // Redirect to success page for WhatsApp too as the order is now in DB
            clearCart();
            router.push('/checkout/success');
            toast.success('Order Established');

        } catch (error) {
            console.error('Order processing error:', error);
            toast.error('Failed to process order');
        } finally {
            if (paymentMethod !== 'paystack') {
                setIsProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans pb-24">
            <div className="lg:col-span-8 space-y-12">
                {/* Delivery Information */}
                <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl shadow-blue-950/5 border border-slate-100 space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-950 rounded-2xl flex items-center justify-center text-white">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-blue-950 uppercase tracking-tight">Delivery Protocol</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Legal Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl text-sm font-bold text-blue-950 outline-none transition-all"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Phone Number</label>
                            <input
                                required
                                type="text"
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl text-sm font-bold text-blue-950 outline-none transition-all font-sans"
                                placeholder="090 333 333 33"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
                        <input
                            required={paymentMethod === 'paystack'}
                            type="email"
                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl text-sm font-bold text-blue-950 outline-none transition-all"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Precise Destination Address</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl text-sm font-bold text-blue-950 outline-none transition-all resize-none"
                            placeholder="House number, street name, landmarks..."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Select Logistics Zone</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {zones.map(zone => (
                                <button
                                    key={zone.id}
                                    type="button"
                                    onClick={() => setSelectedZone(zone)}
                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all group ${selectedZone?.id === zone.id ? 'border-sky-600 bg-sky-50/50' : 'border-slate-50 bg-slate-50 hover:border-sky-200'}`}
                                >
                                    <p className="font-black text-blue-950 text-xs uppercase tracking-widest mb-2">{zone.name}</p>
                                    <p className="text-sky-600 font-black text-lg">₦{zone.basePrice.toLocaleString()}</p>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setSelectedZone({ id: 'custom', name: 'Other Locations', basePrice: 0 })}
                                className={`p-6 rounded-[2rem] border-2 border-dashed text-left transition-all ${selectedZone?.id === 'custom' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-200 bg-white hover:border-sky-200'}`}
                            >
                                <p className="font-black text-slate-400 text-xs uppercase tracking-widest mb-2">Request Quote</p>
                                <p className="text-slate-300 font-bold">Other Jurisdictions</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl shadow-blue-950/5 border border-slate-100 space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-950 rounded-2xl flex items-center justify-center text-white">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-blue-950 uppercase tracking-tight">Financial Interface</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('whatsapp')}
                            className={`p-8 rounded-[2rem] border-2 text-left transition-all relative group ${paymentMethod === 'whatsapp' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-50 bg-slate-50 hover:border-sky-200'}`}
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-blue-950 text-sm uppercase tracking-widest mb-2">WhatsApp Concierge</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed font-inter">Direct dialogue with our fulfillment officers.</p>
                            {paymentMethod === 'whatsapp' && (
                                <div className="absolute top-8 right-8 text-sky-600">
                                    <CheckCircle2 className="w-6 h-6 fill-sky-600 text-white" />
                                </div>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('paystack')}
                            className={`p-8 rounded-[2rem] border-2 text-left transition-all relative group ${paymentMethod === 'paystack' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-50 bg-slate-50 hover:border-sky-200'}`}
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-600 mb-6 shadow-sm">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-blue-950 text-sm uppercase tracking-widest mb-2">Digital Settlement</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed font-inter">Instant secured payment gateway.</p>
                            {paymentMethod === 'paystack' && (
                                <div className="absolute top-8 right-8 text-sky-600">
                                    <CheckCircle2 className="w-6 h-6 fill-sky-600 text-white" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit mb-24 lg:mb-0">
                {/* Order Summary */}
                <div className="bg-blue-950 text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-2xl shadow-blue-950/20 space-y-10 sm:space-y-12">
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                        <ShoppingBag className="w-6 h-6 text-sky-400" />
                        Dossier
                    </h2>

                    <div className="space-y-6 max-h-[40vh] overflow-auto pr-4 custom-scrollbar">
                        {state.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                <div className="flex-1">
                                    <p className="font-black text-xs uppercase tracking-widest leading-tight mb-2">{item.product?.name}</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-sky-400 bg-sky-400/10 px-2 py-1 rounded-md uppercase tracking-widest">
                                            {item.variant?.size?.label}
                                        </span>
                                        <span className="text-[9px] font-black text-white/40 uppercase">x{item.quantity}</span>
                                    </div>
                                </div>
                                <p className="font-black text-sm">₦{((item.variant?.promoPrice || item.variant?.price || 0) * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-5 pt-8 border-t border-white/10">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            <span>Subtotal</span>
                            <span className="text-white">₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                            <span>Logistics</span>
                            <span className="text-white">₦{selectedZone?.basePrice.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">
                                <span>Incentive Applied</span>
                                <span>-₦{discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-5">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-sky-400">Final Value</span>
                            <span className="text-3xl font-black">₦{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Promo Protocol</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="ENTER CODE"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black tracking-widest text-white outline-none focus:border-sky-400/50 transition-all uppercase"
                            />
                            <button
                                type="button"
                                onClick={handleApplyCoupon}
                                disabled={isValidatingCoupon || !couponCode}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all"
                            >
                                {isValidatingCoupon ? '...' : 'APPLY'}
                            </button>
                        </div>
                        {appliedPromo && (
                            <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest text-center">
                                {appliedPromo.promotion.title} Activated
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={state.items.length === 0 || isProcessing}
                        className="w-full bg-sky-600 hover:bg-white hover:text-sky-600 disabled:opacity-30 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-4 shadow-2xl shadow-sky-600/20 transition-all transform active:scale-95 group font-sans text-xs uppercase tracking-widest"
                    >
                        {isProcessing ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : (
                            <>
                                {paymentMethod === 'whatsapp' ? <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                {paymentMethod === 'whatsapp' ? 'Establish Consignment' : 'Secure Payment'}
                            </>
                        )}
                    </button>

                    <div className="pt-6 text-center">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Authored by Smart Best Brands &copy; 2026</p>
                    </div>
                </div>
            </div>
        </form>
    );
}
