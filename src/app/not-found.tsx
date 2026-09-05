import Link from 'next/link'
import { Compass, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-blue-950/10 mb-6">
          <Compass className="w-3.5 h-3.5 text-sky-700" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">
            Error 404 · Page Not Found
          </span>
        </div>

        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-semibold text-blue-950 tracking-tight mb-5">
          The piece you seek is unavailable.
        </h1>

        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-10">
          The link you followed may have expired, or the page may have been repositioned. Explore our curated collections or return to the main gallery.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-950 text-white px-8 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-sky-700 transition-colors"
          >
            Explore catalog
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-blue-950 text-blue-950 px-8 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
          >
            Return home
          </Link>
        </div>

        <div className="pt-8 border-t border-blue-950/8 flex flex-wrap justify-center items-center gap-6 text-xs text-stone-500">
          <Link href="/account/orders" className="hover:text-blue-950 transition-colors underline underline-offset-4">
            Track your order
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-blue-950 transition-colors underline underline-offset-4">
            Contact concierge
          </Link>
          <span>·</span>
          <Link href="/account" className="hover:text-blue-950 transition-colors underline underline-offset-4">
            Client account
          </Link>
        </div>
      </div>
    </div>
  )
}
