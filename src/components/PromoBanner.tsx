import Image from 'next/image'
import Link from 'next/link'

export default function PromoBanner() {
  return (
    <section className="relative min-h-[42vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg"
        alt="Comfort for Nigerian homes"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--brand-primary) 88%, transparent), color-mix(in srgb, var(--brand-primary) 45%, transparent))',
        }}
      />
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="w-1 h-5 rounded-full bg-sky-400" />
          <p className="text-[10px] font-black tracking-[0.4em] uppercase text-sky-300">
            For Nigerian homes
          </p>
        </div>
        <h2 className="font-playfair text-3xl sm:text-5xl font-semibold text-white tracking-tight mb-8">
          Comfort that feels like home
        </h2>
        <Link
          href="/products"
          className="inline-flex border border-white/90 text-white px-8 py-3.5 text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-white hover:text-[var(--brand-primary)] transition-colors"
        >
          Discover now
        </Link>
      </div>
    </section>
  )
}
