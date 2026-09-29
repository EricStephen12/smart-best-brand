'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/components/site-settings-context';
import { ShieldCheck } from 'lucide-react';

export default function TermsClient() {
  const settings = useSiteSettings();

  const customWarrantyLines = (settings.warrantyPolicy || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-sky-600 mb-4">Legal</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-blue-950 tracking-tight mb-10">
          Terms of Service
        </h1>

        {customWarrantyLines.length > 0 && (
          <div className="mb-10 p-6 sm:p-8 bg-sky-50/70 border border-sky-200/80 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-blue-950 font-bold text-lg">Warranty &amp; Service Guarantee</h2>
            </div>
            <ul className="space-y-3">
              {customWarrantyLines.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 leading-relaxed">
                  <span className="text-sky-700 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="prose prose-sm prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">
          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">1. Products</h2>
            <p>All products sold on {settings.siteName || 'Smart Best Brands'} are 100% original, sourced directly from authorised distributors. Images are representative — exact appearance may vary slightly by batch.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">2. Orders &amp; Payment</h2>
            <p>Orders are confirmed once payment is verified. We reserve the right to cancel orders in the event of stock unavailability, pricing errors, or suspected fraud. Affected customers will be contacted and fully refunded.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">3. Delivery</h2>
            <p>Delivery timelines are estimates. Delays may occur due to weather, traffic, or logistics. We will notify you of any significant delays. Risk of loss transfers to you upon successful delivery.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">4. Warranties</h2>
            <p>All mattresses and furniture carry the original manufacturer warranty. Warranty claims are processed through the relevant brand's service center, facilitated by {settings.siteName || 'Smart Best Brands'}.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">5. Governing Law</h2>
            <p>These terms are governed by the laws of the Federal Republic of Nigeria. Disputes will be resolved in Nigerian courts.</p>
          </section>

          <section>
            <h2 className="text-blue-950 font-bold text-lg mb-3">6. Contact</h2>
            <p>Questions about these terms? <Link href="/contact" className="text-sky-700 hover:underline">Contact us</Link>.</p>
          </section>

          <p className="text-xs text-stone-400 pt-6 border-t border-stone-100">
            Last updated: {settings.siteName || 'Smart Best Brands'}
          </p>
        </div>
      </div>
    </div>
  );
}
