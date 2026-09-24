import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Smart Best Brands',
  description: 'How Smart Best Brands collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-sky-600 mb-4">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-blue-950 tracking-tight mb-10">
          Privacy Policy
        </h1>

        <div className="prose prose-sm prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">
          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">1. Information We Collect</h2>
            <p>When you place an order or contact us, we collect your name, phone number, email address, and delivery address. This information is used solely to process and deliver your order.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">2. How We Use Your Information</h2>
            <p>We use your personal details to fulfill orders, communicate delivery updates, process payments, and respond to enquiries. We do not sell your information to third parties.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">3. Payment Processing</h2>
            <p>Online payments are processed securely via Paystack. We do not store your card details. Please refer to Paystack's privacy policy for information about how your payment data is handled.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">4. Cookies</h2>
            <p>We use cookies to maintain your shopping cart and remember your preferences across sessions. No personal data is shared with advertising networks.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">5. Contact</h2>
            <p>For any privacy-related questions, please <Link href="/contact" className="text-sky-700 hover:underline">contact us</Link>.</p>
          </section>

          <p className="text-xs text-stone-400 pt-6 border-t border-stone-100">
            Last updated: September 2026
          </p>
        </div>
      </div>
    </div>
  )
}
