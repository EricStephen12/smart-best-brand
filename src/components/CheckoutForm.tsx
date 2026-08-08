'use client'

import React, { useState } from 'react'
import { CreditCard, MessageCircle, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { confirmPaystackPayment, createOrder } from '@/actions/orders'
import { validatePromotionCode } from '@/actions/promotions'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface DeliveryZone {
  id: string
  name: string
  basePrice: number
}

interface CheckoutFormProps {
  zones: DeliveryZone[]
}

const fieldClass =
  'w-full px-4 py-3.5 bg-white border border-blue-950/15 text-sm font-medium text-blue-950 placeholder:text-stone-400 outline-none focus:border-blue-950/40 transition-colors'
const labelClass =
  'text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2 block'

export default function CheckoutForm({ zones }: CheckoutFormProps) {
  const { state, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(
    zones[0] || { id: 'custom', name: 'Other Locations', basePrice: 0 }
  )
  const [paymentMethod, setPaymentMethod] = useState('whatsapp')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  const [couponCode, setCouponCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{
    discount: number
    promotion: { code?: string | null; title: string }
  } | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }))
    }
  }, [user])

  const cartTotal = state.items.reduce((acc, item) => {
    const price = item.variant?.promoPrice || item.variant?.price || 0
    return acc + price * item.quantity
  }, 0)

  const discount = appliedPromo?.discount || 0
  const total = cartTotal + (selectedZone?.basePrice || 0) - discount

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setIsValidatingCoupon(true)
    try {
      const items = state.items.map((i) => ({
        productId: i.product?.id || '',
        categoryIds:
          i.product?.categories?.map((c: { categoryId: string }) => c.categoryId) || [],
      }))

      const result = await validatePromotionCode(couponCode, cartTotal, items)
      if (result.success && result.data) {
        setAppliedPromo(result.data)
        toast.success(`Discount applied: ₦${result.data.discount.toLocaleString()}`)
      } else {
        toast.error(result.error || 'Invalid code')
        setAppliedPromo(null)
      }
    } catch {
      toast.error('Could not check that code')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const onSuccess = async (reference: string) => {
    try {
      const confirmed = await confirmPaystackPayment(reference)
      if (!confirmed.success) {
        toast.error(
          confirmed.error ||
            'Payment could not be verified yet. If money was deducted, contact support with your order number.'
        )
        setIsProcessing(false)
        return
      }
      clearCart()
      router.push(`/checkout/success?order=${encodeURIComponent(reference)}&method=PAYSTACK`)
      toast.success('Payment received')
    } catch {
      toast.error('Payment verification failed. Please contact support if charged.')
      setIsProcessing(false)
    }
  }

  const onClose = () => {
    toast('Payment cancelled — your order is saved as pending. You can retry payment if needed.')
    setIsProcessing(false)
  }

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
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
        items: state.items.map((item) => ({
          variantId: item.product_variant_id,
          quantity: item.quantity,
          price: item.variant?.promoPrice || item.variant?.price || 0,
        })),
      }

      const result = await createOrder(orderData)

      if (!result.success || !result.data) {
        toast.error(result.error || 'Could not create your order')
        setIsProcessing(false)
        return
      }

      if (paymentMethod === 'paystack') {
        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

        if (!paystackKey) {
          toast.error('Payment is not configured right now')
          setIsProcessing(false)
          return
        }

        if (!window.PaystackPop) {
          toast.error('Payment gateway failed to load. Please refresh and try again.')
          setIsProcessing(false)
          return
        }

        const amountKobo = Math.round(result.data.total * 100)
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: formData.email,
          amount: amountKobo,
          currency: 'NGN',
          reference: result.data.orderNumber,
          callback: function (response) {
            void onSuccess(response.reference)
          },
          onClose: function () {
            onClose()
          },
        })
        handler.openIframe()
        return
      }

      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')
      const itemsList = state.items
        .map((i) => `${i.product?.name} (${i.variant?.size?.label}) x${i.quantity}`)
        .join(', ')
      const text = `Order request ${result.data.orderNumber}

Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
Zone: ${selectedZone?.name}
Items: ${itemsList}
Total: ₦${total.toLocaleString()}

Please confirm delivery timeline.`

      if (whatsappNumber) {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
      } else {
        toast.error('WhatsApp number is not configured. Your order was still saved.')
      }

      clearCart()
      router.push(
        `/checkout/success?order=${encodeURIComponent(result.data.orderNumber)}&method=WHATSAPP`
      )
      toast.success('Order placed')
    } catch (error) {
      console.error('Order processing error:', error)
      toast.error('Could not process your order')
    } finally {
      if (paymentMethod !== 'paystack') {
        setIsProcessing(false)
      }
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <p className="font-playfair text-2xl sm:text-3xl font-semibold text-blue-950 mb-3">
          Your cart is empty
        </p>
        <p className="text-sm text-stone-500 mb-8">
          Add something from the shop, then come back to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex border border-blue-950 text-blue-950 px-10 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      <div className="lg:col-span-7 space-y-12">
        {/* Delivery */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1 h-5 rounded-full bg-sky-600 shrink-0" />
              <p className="text-[11px] font-black tracking-[0.35em] uppercase text-sky-600">
                Delivery
              </p>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-blue-950 tracking-tight">
              Where should we send it?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full name</label>
              <input
                required
                type="text"
                className={fieldClass}
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                required
                type="tel"
                className={fieldClass}
                placeholder="0800 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              required
              type="email"
              className={fieldClass}
              placeholder="you@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Delivery address</label>
            <textarea
              required
              rows={3}
              className={`${fieldClass} resize-none`}
              placeholder="House number, street, landmark…"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Delivery area</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zones.map((zone) => {
                const active = selectedZone?.id === zone.id
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className={`p-4 border text-left transition-colors ${
                      active
                        ? 'border-blue-950 bg-blue-950 text-white'
                        : 'border-blue-950/15 bg-white text-blue-950 hover:border-blue-950/40'
                    }`}
                  >
                    <p className="text-[11px] font-black tracking-[0.14em] uppercase mb-1">
                      {zone.name}
                    </p>
                    <p className={`text-sm font-medium ${active ? 'text-white/80' : 'text-sky-700'}`}>
                      ₦{zone.basePrice.toLocaleString()}
                    </p>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() =>
                  setSelectedZone({ id: 'custom', name: 'Other Locations', basePrice: 0 })
                }
                className={`p-4 border border-dashed text-left transition-colors ${
                  selectedZone?.id === 'custom'
                    ? 'border-blue-950 bg-blue-950 text-white'
                    : 'border-blue-950/20 bg-white text-blue-950 hover:border-blue-950/40'
                }`}
              >
                <p className="text-[11px] font-black tracking-[0.14em] uppercase mb-1">
                  Outside listed areas
                </p>
                <p
                  className={`text-sm font-medium ${
                    selectedZone?.id === 'custom' ? 'text-white/80' : 'text-stone-400'
                  }`}
                >
                  We’ll confirm delivery fee
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="space-y-6 border-t border-blue-950/5 pt-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1 h-5 rounded-full bg-sky-600 shrink-0" />
              <p className="text-[11px] font-black tracking-[0.35em] uppercase text-sky-600">
                Payment
              </p>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-blue-950 tracking-tight">
              How would you like to pay?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('whatsapp')}
              className={`relative p-5 border text-left transition-colors ${
                paymentMethod === 'whatsapp'
                  ? 'border-blue-950 bg-white'
                  : 'border-blue-950/15 hover:border-blue-950/35'
              }`}
            >
              {paymentMethod === 'whatsapp' ? (
                <Check className="absolute top-4 right-4 w-4 h-4 text-sky-600" />
              ) : null}
              <MessageCircle className="w-5 h-5 text-green-600 mb-3" />
              <p className="text-[11px] font-black tracking-[0.14em] uppercase text-blue-950 mb-1">
                WhatsApp
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                Place the order and finish details with us on chat.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('paystack')}
              className={`relative p-5 border text-left transition-colors ${
                paymentMethod === 'paystack'
                  ? 'border-blue-950 bg-white'
                  : 'border-blue-950/15 hover:border-blue-950/35'
              }`}
            >
              {paymentMethod === 'paystack' ? (
                <Check className="absolute top-4 right-4 w-4 h-4 text-sky-600" />
              ) : null}
              <CreditCard className="w-5 h-5 text-sky-700 mb-3" />
              <p className="text-[11px] font-black tracking-[0.14em] uppercase text-blue-950 mb-1">
                Card / transfer
              </p>
              <p className="text-sm text-stone-500 leading-relaxed">
                Pay securely online with Paystack.
              </p>
            </button>
          </div>
        </section>
      </div>

      {/* Summary */}
      <aside className="lg:col-span-5 lg:sticky lg:top-28 h-fit">
        <div className="border border-blue-950/10 bg-[var(--brand-bg)] p-6 sm:p-8 space-y-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 mb-2">
              Order summary
            </p>
            <h3 className="font-playfair text-2xl font-semibold text-blue-950 tracking-tight">
              Your bag
            </h3>
          </div>

          <div className="space-y-4 max-h-[36vh] overflow-auto">
            {state.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start gap-4 pb-4 border-b border-blue-950/8 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-blue-950 leading-snug">
                    {item.product?.name}
                  </p>
                  <p className="text-[10px] font-black tracking-[0.16em] uppercase text-stone-400 mt-1">
                    {item.variant?.size?.label} · ×{item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-blue-950 shrink-0">
                  ₦
                  {(
                    (item.variant?.promoPrice || item.variant?.price || 0) * item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2 border-t border-blue-950/8">
            <div className="flex justify-between text-sm text-stone-500">
              <span>Subtotal</span>
              <span className="text-blue-950 font-medium">₦{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-500">
              <span>Delivery</span>
              <span className="text-blue-950 font-medium">
                {selectedZone?.id === 'custom'
                  ? 'To confirm'
                  : `₦${selectedZone?.basePrice.toLocaleString()}`}
              </span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between text-sm text-sky-700">
                <span>Discount</span>
                <span className="font-medium">-₦{discount.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="flex justify-between items-baseline pt-3 border-t border-blue-950/8">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400">
                Total
              </span>
              <span className="font-playfair text-3xl font-semibold text-blue-950">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className={labelClass}>Promo code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="CODE"
                className={`${fieldClass} flex-1 uppercase tracking-widest`}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isValidatingCoupon || !couponCode}
                className="px-5 py-3.5 border border-blue-950 text-blue-950 text-[10px] font-black tracking-[0.18em] uppercase hover:bg-blue-950 hover:text-white disabled:opacity-30 transition-colors"
              >
                {isValidatingCoupon ? '…' : 'Apply'}
              </button>
            </div>
            {appliedPromo ? (
              <p className="text-xs text-sky-700 font-medium">{appliedPromo.promotion.title} applied</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={state.items.length === 0 || isProcessing}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-950 text-white text-[11px] font-black tracking-[0.18em] uppercase py-4 hover:bg-sky-700 disabled:opacity-40 transition-colors"
          >
            {isProcessing ? (
              'Processing…'
            ) : paymentMethod === 'whatsapp' ? (
              <>
                <MessageCircle className="w-4 h-4" />
                Place order on WhatsApp
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay now
              </>
            )}
          </button>
        </div>
      </aside>
    </form>
  )
}
