import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import StorySection from '@/components/StorySection'
import { Truck, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react'
import { getAllBrands } from '@/actions/brands'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us | Smart Best Brands',
  description: 'Learn how Smart Best Brands became Nigeria\'s most trusted source for original mattresses, luxury furniture, and bedding — factory-direct, warranted, delivered with care.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Smart Best Brands — The Standard for Rest in Nigeria',
    description: 'We source directly from authorized distributors so every mattress arrives factory-sealed with its genuine manufacturer warranty.',
    type: 'website',
  },
}

export default async function AboutPage() {
  const brandsResult = await getAllBrands()
  const brands = brandsResult.success ? brandsResult.data : []

  return (
    <div className="pt-20 font-sans">

      {/* Hero */}
      <div className="bg-blue-950 py-20 sm:py-32 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-6xl md:text-[8rem] font-black text-white mb-8 tracking-tighter leading-[0.85] uppercase">
            The Standard<br /><span className="text-sky-600">for Rest.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Nigeria's home for original mattresses, pillows, and luxury furniture.
            We sell only what we can stand behind — factory-sealed, warranted, and delivered with care.
          </p>
        </div>
      </div>

      <StorySection brandCount={brands?.length || 0} />

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <ValueCard
              icon={ShieldCheck}
              title="100% Authentic"
              description="We source every product directly from authorised brand distributors. If it's not original, it doesn't make it onto our shelves."
            />
            <ValueCard
              icon={Truck}
              title="Reliable Delivery"
              description="We handle delivery ourselves across Abuja and Benin City so your order arrives exactly as it left the factory."
            />
            <ValueCard
              icon={Award}
              title="Real Warranties"
              description="Every mattress and piece of furniture comes with the manufacturer's original warranty — not a store promise, the actual card."
            />
            <ValueCard
              icon={Heart}
              title="People First"
              description="We take the time to understand what you actually need. The right mattress isn't the most expensive one — it's the right fit for you."
            />
          </div>
        </div>
      </section>

      {/* Partner brands */}
      {brands && brands.length > 0 && (
        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-blue-950 font-black tracking-[0.4em] text-[10px] uppercase mb-16 text-stone-400">Our Partner Brands</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
              {brands.map((brand: any) => (
                <span
                  key={brand.id}
                  className="text-2xl md:text-3xl font-black text-blue-950/30 hover:text-blue-950/60 transition-colors duration-500 cursor-default uppercase tracking-tighter"
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="py-20 bg-blue-950 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4 tracking-tight">
            Ready to rest better?
          </h2>
          <p className="text-sky-200/80 text-base mb-8 leading-relaxed">
            Browse our full catalogue — mattresses, pillows, and furniture, all factory-direct.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-white text-blue-950 px-8 py-4 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-sky-50 transition-colors"
          >
            Shop the collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}

function ValueCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-20 h-20 bg-stone-50 text-blue-950 flex items-center justify-center mb-8 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 border border-stone-100 group-hover:border-sky-600">
        <Icon className="w-9 h-9" />
      </div>
      <h4 className="text-lg font-black text-blue-950 mb-3 uppercase tracking-tight">{title}</h4>
      <p className="text-stone-500 text-sm font-medium leading-relaxed">{description}</p>
    </div>
  )
}
