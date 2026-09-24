'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { CreditCard, MessageCircle, Check, Building2, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { confirmPaystackPayment, createOrder } from '@/actions/orders'
import { validatePromotionCode } from '@/actions/promotions'
import { recoverCartByToken, syncCartToDb } from '@/actions/cart'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useSiteSettings } from '@/components/site-settings-context'

interface DeliveryZone {
  id: string
  name: string
  basePrice: number
}

interface CheckoutFormProps {
  zones: DeliveryZone[]
}

const fieldClass =
  'w-full px-4 py-3 bg-white border border-stone-200 text-sm text-blue-950 placeholder:text-stone-400 outline-none focus:border-blue-950/60 focus-visible:ring-2 focus-visible:ring-blue-950/15 transition-colors'
const labelClass =
  'text-[11px] font-black uppercase tracking-[0.18em] text-blue-950/60 mb-1.5 block'

export default function CheckoutForm({ zones }: CheckoutFormProps) {
  const { state, clearCart, loadCart } = useCart()
  const { user } = useAuth()
  const settings = useSiteSettings()
  const bankName = settings.bankName || 'Moniepoint MFB / Zenith Bank'
  const bankAccountName = settings.bankAccountName || 'Smart Best Brands Nigeria'
  const bankAccountNumber = settings.bankAccountNumber || '08064619479'
  const router = useRouter()
  const searchParams = useSearchParams()
  const recoverToken = searchParams?.get('recover')

  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(
    zones[0] || { id: 'custom', name: 'Other Locations', basePrice: 0 }
  )
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'paystack' | 'bank_transfer'>('paystack')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' })
  const [couponCode, setCouponCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{
    discount: number
    promotion: { code?: string | null; title: string }
  } | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const idempotencyKeyRef = React.useRef<string>('')

  React.useEffect(() => {
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }
  }, [])

  // Auto-restore abandoned cart
  React.useEffect(() => {
    if (recoverToken) {
      void (async () => {
        const res = await recoverCartByToken(recoverToken)
        if (res.success && res.data) {
          if (res.data.items?.length) loadCart(res.data.items)
          if (res.data.email || res.data.phone) {
            setFormData((prev) => ({
              ...prev,
              email: prev.email || res.data?.email || '',
              phone: prev.phone || res.data?.phone || '',
            }))
          }
          toast.success('Your cart has been restored.')
        }
      })()
    }
  }, [recoverToken])

  // Pre-fill from authenticated user
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.deliveryAddress || '',
      }))
      if (user.deliveryLocation) {
        const match = zones.find(
          (z) => z.name.toLowerCase() === user.deliveryLocation?.toLowerCase()
        )
        if (match) setSelectedZone(match)
      }
    }
  }, [user, zones])

  const handleContactBlur = () => {
    if (formData.email || formData.phone) {
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('sbb-guest-token') : null
      void syncCartToDb({
        items: state.items.map((i) => ({ variantId: i.product_variant_id, quantity: i.quantity })),
        email: formData.email,
        phone: formData.phone,
        guestToken,
      })
    }
  }

  // ── Totals ────────────────────────────────────────────────────
  const cartTotal = state.items.reduce((acc, item) => {
    return acc + (item.variant?.promoPrice || item.variant?.price || 0) * item.quantity
  }, 0)
  const totalCartQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0)
  const isCustomDelivery = selectedZone?.name?.toLowerCase() === 'other locations'
  const bulkyHandlingFee = isCustomDelivery ? 0 : Math.max(0, totalCartQuantity - 1) * 2500
  const deliveryFee = (selectedZone?.basePrice || 0) + bulkyHandlingFee
  const discount = appliedPromo?.discount || 0
  const total = cartTotal + deliveryFee - discount

  // ── Promo ─────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setIsValidatingCoupon(true)
    try {
      const items = state.items.map((i) => ({
        productId: i.product?.id || '',
        categoryIds: i.product?.categories?.map((c: { categoryId: string }) => c.categoryId) || [],
      }))
      const result = await validatePromotionCode(couponCode, cartTotal, items, formData.email)
      if (result.success && result.data) {
        setAppliedPromo(result.data)
        toast.success(`Discount applied — ₦${result.data.discount.toLocaleString()} off`)
      } else {
        toast.error(result.error || 'Invalid code')
        setAppliedPromo(null)
      }
    } catch {
      toast.error('Could not validate that code')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  // ── Paystack callbacks ─────────────────────────────────────────
  const onSuccess = async (reference: string) => {
    try {
      const confirmed = await confirmPaystackPayment(reference)
      if (!confirmed.success) {
        toast.error(
          confirmed.error ||
            'Payment could not be verified. If money was deducted, contact support with your order number.'
        )
        setIsProcessing(false)
        return
      }
      clearCart()
      router.push(`/checkout/success?order=${encodeURIComponent(reference)}&method=PAYSTACK`)
      toast.success('Payment received')
    } catch {
      toast.error('Payment verification failed. Please contact support if you were charged.')
      setIsProcessing(false)
    }
  }

  const onClose = () => {
    toast('Payment cancelled — your order is saved. You can retry payment if needed.')
    setIsProcessing(false)
  }

  // ── Submit ────────────────────────────────────────────────────
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
        deliveryFee,
        subtotal: cartTotal,
        total,
        discount,
        promoCode: appliedPromo?.promotion?.code || undefined,
        paymentMethod:
          paymentMethod === 'paystack' ? 'PAYSTACK'
            : paymentMethod === 'bank_transfer' ? 'BANK_TRANSFER'
            : 'WHATSAPP',
        userId: user?.id || undefined,
        idempotencyKey: idempotencyKeyRef.current || `chk_${Date.now()}`,
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

      if (paymentMethod === 'bank_transfer') {
        clearCart()
        router.push(`/checkout/success?order=${encodeURIComponent(result.data.orderNumber)}&method=BANK_TRANSFER`)
        toast.success('Order placed successfully')
        return
      }

      if (paymentMethod === 'paystack') {
        if (result.data.total < 50) {
          toast.error('Paystack requires a minimum of ₦50. Please use Bank Transfer for smaller amounts.')
          setIsProcessing(false)
          return
        }
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
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: formData.email,
          amount: Math.round(result.data.total * 100),
          currency: 'NGN',
          reference: result.data.orderNumber,
          callback: (response: { reference: string }) => { void onSuccess(response.reference) },
          onClose: () => { onClose() },
        })
        handler.openIframe()
        return
      }

      // WhatsApp path
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')
      const itemsList = state.items
        .map((i) => `${i.product?.name} (${i.variant?.size?.label}) ×${i.quantity}`)
        .join(', ')
      const text = `Order ${result.data.orderNumber}\n\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\nZone: ${selectedZone?.name}\nItems: ${itemsList}\nTotal: ₦${total.toLocaleString()}\n\nPlease confirm delivery timeline.`
      if (whatsappNumber) {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank')
      } else {
        toast.error('WhatsApp is not configured. Your order was still saved.')
      }
      clearCart()
      router.push(`/checkout/success?order=${encodeURIComponent(result.data.orderNumber)}&method=WHATSAPP`)
      toast.success('Order placed')
    } catch (error) {
      console.error('Order processing error:', error)
      toast.error('Could not process your order')
    } finally {
      if (paymentMethod !== 'paystack') setIsProcessing(false)
    }
  }

  // ── Empty cart ─────────────────────────────────────────────────
  if (state.items.length === 0) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 bg-stone-100 flex items-center justify-center mx-auto mb-6 text-stone-300">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <p className="font-display text-2xl font-semibold text-blue-950 mb-3">Your bag is empty</p>
        <p className="text-sm text-stone-500 mb-8">Add products before checking out.</p>
        <Link
          href="/products"
          className="inline-flex bg-blue-950 text-white px-8 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-sky-700 transition-colors"
        >
          Browse products
        </Link>
      </div>
    )
  }

  // ── Shared summary content (used in both mobile accordion + desktop sidebar) ──
  const SummaryItems = () => (
    <ul className="space-y-4">
      {state.items.map((item, idx) => {
        const price = (item.variant?.promoPrice || item.variant?.price || 0) * item.quantity
        const img = item.product?.images?.[0]
        return (
          <li key={idx} className="flex items-start gap-3">
            {/* Thumbnail with quantity badge */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-stone-100 border border-stone-200 overflow-hidden">
                {img ? (
                  <Image src={img} alt={item.product?.name || ''} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                )}
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-950 text-white text-[10px] font-black flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-950 leading-snug line-clamp-2">
                {item.product?.name}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5 uppercase tracking-wide">
                {item.variant?.size?.label}
              </p>
            </div>
            <p className="text-sm font-semibold text-blue-950 shrink-0 tabular-nums">
              ₦{price.toLocaleString()}
            </p>
          </li>
        )
      })}
    </ul>
  )

  const SummaryTotals = () => (
    <div className="space-y-2.5 pt-4 border-t border-stone-200">
      <div className="flex justify-between text-sm text-stone-500">
        <span>Subtotal</span>
        <span className="text-blue-950 font-medium tabular-nums">₦{cartTotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm text-stone-500">
        <span>Delivery</span>
        <span className="text-blue-950 font-medium tabular-nums">
          {selectedZone?.id === 'custom' ? 'Confirmed after order' : `₦${deliveryFee.toLocaleString()}`}
        </span>
      </div>
      {bulkyHandlingFee > 0 && selectedZone?.id !== 'custom' && (
        <p className="text-[11px] text-stone-400 -mt-1 ml-auto w-fit">
          Includes bulky freight for {totalCartQuantity - 1} extra {totalCartQuantity - 1 === 1 ? 'item' : 'items'}
        </p>
      )}
      {discount > 0 && (
        <div className="flex justify-between text-sm text-sky-700">
          <span>Discount</span>
          <span className="font-medium tabular-nums">−₦{discount.toLocaleString()}</span>
        </div>
      )}
      <div className="flex justify-between items-baseline pt-3 border-t border-stone-200">
        <span className="text-sm font-black uppercase tracking-[0.15em] text-blue-950">Total</span>
        <span className="font-display text-2xl font-semibold text-blue-950 tabular-nums">
          ₦{total.toLocaleString()}
        </span>
      </div>
      <p className="text-[11px] text-stone-400">Including all taxes and fees</p>
    </div>
  )

  return (
    <form onSubmit={handleCompleteOrder}>
      {/* ── Mobile order summary accordion ── */}
      <div className="lg:hidden mb-8 border border-stone-200 bg-stone-50">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-black text-sky-700">
            <ShoppingBag className="w-4 h-4" />
            {summaryOpen ? 'Hide order summary' : 'Show order summary'}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold text-blue-950 tabular-nums">
              ₦{total.toLocaleString()}
            </span>
            {summaryOpen
              ? <ChevronUp className="w-4 h-4 text-stone-400" />
              : <ChevronDown className="w-4 h-4 text-stone-400" />
            }
          </div>
        </button>
        {summaryOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-stone-200">
            <div className="pt-4"><SummaryItems /></div>
            <SummaryTotals />
          </div>
        )}
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">

        {/* ── LEFT: form ── */}
        <div className="space-y-10">

          {/* Step 1: Contact */}
          <section>
            <StepLabel number={1} label="Contact information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label className={labelClass}>Full name</label>
                <input required type="text" className={fieldClass} placeholder="Your name"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input required type="tel" className={fieldClass} placeholder="0800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onBlur={handleContactBlur} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Email address</label>
              <input required type="email" className={fieldClass} placeholder="you@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={handleContactBlur} />
            </div>
          </section>

          <div className="border-t border-stone-100" />

          {/* Step 2: Delivery */}
          <section>
            <StepLabel number={2} label="Delivery" />
            <div className="mt-5">
              <label className={labelClass}>Street address</label>
              <textarea required rows={2} className={`${fieldClass} resize-none mt-0`}
                placeholder="House number, street name, nearest landmark…"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <div className="mt-4">
              <label className={labelClass}>Delivery area</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {zones.map((zone) => {
                  const active = selectedZone?.id === zone.id
                  return (
                    <ZoneCard
                      key={zone.id}
                      active={active}
                      label={zone.name}
                      price={`₦${zone.basePrice.toLocaleString()}`}
                      onClick={() => setSelectedZone(zone)}
                    />
                  )
                })}
                <ZoneCard
                  active={selectedZone?.id === 'custom'}
                  label="Other locations"
                  price="We'll confirm"
                  dashed
                  onClick={() => setSelectedZone({ id: 'custom', name: 'Other Locations', basePrice: 0 })}
                />
              </div>
            </div>
          </section>

          <div className="border-t border-stone-100" />

          {/* Step 3: Payment */}
          <section>
            <StepLabel number={3} label="Payment method" />
            <div className="mt-5 space-y-2.5">
              <PaymentCard
                active={paymentMethod === 'paystack'}
                icon={<CreditCard className="w-5 h-5 text-sky-600" />}
                title="Card / Online payment"
                description="Pay securely with any debit card via Paystack. Instant confirmation."
                onClick={() => setPaymentMethod('paystack')}
                badge="Recommended"
              />
              <PaymentCard
                active={paymentMethod === 'bank_transfer'}
                icon={<Building2 className="w-5 h-5 text-blue-950" />}
                title="Bank transfer"
                description="Transfer directly to our account. Your items are reserved while we verify."
                onClick={() => setPaymentMethod('bank_transfer')}
              />
              <PaymentCard
                active={paymentMethod === 'whatsapp'}
                icon={<MessageCircle className="w-5 h-5 text-[#25D366]" />}
                title="Order via WhatsApp"
                description="Place your order and coordinate payment directly with our team on WhatsApp."
                onClick={() => setPaymentMethod('whatsapp')}
              />
            </div>

            {/* Bank transfer details — shown inline when selected */}
            {paymentMethod === 'bank_transfer' && (
              <div className="mt-4 p-5 bg-stone-50 border border-stone-200 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                  Transfer these details after placing your order
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={labelClass}>Bank</p>
                    <p className="font-semibold text-blue-950">{bankName}</p>
                  </div>
                  <div>
                    <p className={labelClass}>Account name</p>
                    <p className="font-semibold text-blue-950">{bankAccountName}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className={labelClass}>Account number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-lg font-bold text-blue-950 bg-white px-3 py-2 border border-stone-200 tracking-widest select-all">
                        {bankAccountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText(bankAccountNumber); toast.success('Copied!') }}
                        className="px-3 py-2 border border-blue-950 text-blue-950 text-[10px] font-black uppercase tracking-widest hover:bg-blue-950 hover:text-white transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed border-t border-stone-200 pt-3">
                  Use your order number as the transfer narration. We'll confirm and dispatch once the transfer reflects.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ── RIGHT: order summary sidebar (desktop only) ── */}
        <aside className="hidden lg:block">
          <div className="border border-stone-200 bg-stone-50 p-6 space-y-6 sticky top-6">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-blue-950">
              Order summary
            </h2>

            <SummaryItems />
            <SummaryTotals />

            {/* Promo code */}
            <div className="space-y-2">
              <label className={labelClass}>Promo code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className={`${fieldClass} flex-1 uppercase tracking-widest text-xs`}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponCode}
                  className="px-4 py-3 border border-blue-950 text-blue-950 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-blue-950 hover:text-white disabled:opacity-30 transition-colors"
                >
                  {isValidatingCoupon ? '…' : 'Apply'}
                </button>
              </div>
              {appliedPromo && (
                <p className="text-xs text-sky-700 font-medium">
                  ✓ {appliedPromo.promotion.title} applied
                </p>
              )}
            </div>

            {/* CTA */}
            <SubmitButton isProcessing={isProcessing} paymentMethod={paymentMethod} disabled={state.items.length === 0} />

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              By placing your order you agree to our{' '}
              <Link href="/faqs" className="underline underline-offset-2 hover:text-blue-950 transition-colors">
                delivery &amp; returns policy
              </Link>
            </p>
          </div>
        </aside>
      </div>

      {/* ── Mobile: promo + CTA below the form ── */}
      <div className="lg:hidden mt-10 space-y-4 border-t border-stone-100 pt-8">
        <div className="space-y-2">
          <label className={labelClass}>Promo code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              className={`${fieldClass} flex-1 uppercase tracking-widest text-xs`}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isValidatingCoupon || !couponCode}
              className="px-4 py-3 border border-blue-950 text-blue-950 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-blue-950 hover:text-white disabled:opacity-30 transition-colors"
            >
              {isValidatingCoupon ? '…' : 'Apply'}
            </button>
          </div>
          {appliedPromo && (
            <p className="text-xs text-sky-700 font-medium">✓ {appliedPromo.promotion.title} applied</p>
          )}
        </div>
        <SubmitButton isProcessing={isProcessing} paymentMethod={paymentMethod} disabled={state.items.length === 0} />
        <p className="text-[11px] text-stone-400 text-center">
          By placing your order you agree to our{' '}
          <Link href="/faqs" className="underline underline-offset-2 hover:text-blue-950 transition-colors">
            delivery &amp; returns policy
          </Link>
        </p>
      </div>
    </form>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 bg-blue-950 text-white text-[11px] font-black flex items-center justify-center shrink-0">
        {number}
      </span>
      <h2 className="text-base font-black uppercase tracking-[0.12em] text-blue-950">{label}</h2>
    </div>
  )
}

function ZoneCard({
  active, label, price, dashed = false, onClick,
}: {
  active: boolean; label: string; price: string; dashed?: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3.5 border text-left transition-colors ${
        dashed ? 'border-dashed' : ''
      } ${
        active
          ? 'border-blue-950 bg-blue-950 text-white'
          : 'border-stone-200 bg-white text-blue-950 hover:border-blue-950/40'
      }`}
    >
      <p className="text-[11px] font-black tracking-[0.1em] uppercase leading-snug">{label}</p>
      <p className={`text-xs font-medium mt-1 ${active ? 'text-white/75' : 'text-sky-700'}`}>
        {price}
      </p>
    </button>
  )
}

function PaymentCard({
  active, icon, title, description, onClick, badge,
}: {
  active: boolean; icon: React.ReactNode; title: string; description: string
  onClick: () => void; badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-start gap-4 p-4 border text-left transition-all ${
        active
          ? 'border-blue-950 bg-white ring-1 ring-blue-950'
          : 'border-stone-200 bg-white hover:border-stone-300'
      }`}
    >
      {/* Radio circle */}
      <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
        active ? 'border-blue-950' : 'border-stone-300'
      }`}>
        {active && <span className="w-2 h-2 rounded-full bg-blue-950" />}
      </span>

      <span className="shrink-0 mt-0.5">{icon}</span>

      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-black text-blue-950">{title}</span>
          {badge && (
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5">
              {badge}
            </span>
          )}
        </span>
        <span className="block text-xs text-stone-500 leading-relaxed mt-0.5">{description}</span>
      </span>

      {active && <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />}
    </button>
  )
}

function SubmitButton({
  isProcessing, paymentMethod, disabled,
}: {
  isProcessing: boolean; paymentMethod: 'whatsapp' | 'paystack' | 'bank_transfer'; disabled: boolean
}) {
  const label = isProcessing
    ? 'Processing…'
    : paymentMethod === 'whatsapp'
    ? 'Place order on WhatsApp'
    : paymentMethod === 'bank_transfer'
    ? 'Reserve order — pay by transfer'
    : 'Pay now with Paystack'

  const icon = !isProcessing && (
    paymentMethod === 'whatsapp' ? <MessageCircle className="w-4 h-4" />
    : paymentMethod === 'bank_transfer' ? <Building2 className="w-4 h-4" />
    : <CreditCard className="w-4 h-4" />
  )

  return (
    <button
      type="submit"
      disabled={disabled || isProcessing}
      className="w-full inline-flex items-center justify-center gap-2.5 bg-blue-950 text-white py-4 text-[11px] font-black tracking-[0.18em] uppercase hover:bg-sky-700 disabled:opacity-40 transition-colors"
    >
      {icon}
      {label}
    </button>
  )
}
