import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund & Returns Policy | Smart Best Brands',
  description: 'Our return, refund, and exchange policy for mattresses, furniture, and bedding.',
}

export default function RefundPage() {
  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-sky-600 mb-4">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-blue-950 tracking-tight mb-10">
          Refund &amp; Returns Policy
        </h1>

        <div className="prose prose-sm prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">
          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">7-Day Return Window</h2>
            <p>You may return or exchange most items within 7 days of delivery, provided they are in their original, unused condition with all original packaging intact.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">Mattress-Specific Policy</h2>
            <p>For hygiene reasons, mattresses <strong>cannot be returned</strong> once the factory polythene seal has been removed. If you discover a manufacturing defect upon unboxing — before removing the seal — we will arrange an immediate free replacement.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">Factory Defects</h2>
            <p>Any product confirmed to have a factory defect will be replaced at no cost. Please document the defect with photos upon delivery and contact us within 48 hours of receipt.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">Refund Processing</h2>
            <p>Approved refunds are processed within 5–10 business days via the original payment method. Bank transfer refunds may take an additional 2–3 business days to reflect.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">Non-Returnable Items</h2>
            <p>Custom-sized mattresses and items that have been used, modified, or damaged after delivery are not eligible for return.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">How to Initiate a Return</h2>
            <p><Link href="/contact" className="text-sky-700 hover:underline">Contact us</Link> with your order number and reason for return. Our team will guide you through the process.</p>
          </section>

          <p className="text-xs text-stone-400 pt-6 border-t border-stone-100">
            Last updated: September 2026
          </p>
        </div>
      </div>
    </div>
  )
}
