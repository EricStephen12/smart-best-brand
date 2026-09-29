'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Palette, Loader2, ArrowRight } from 'lucide-react'

export default function BannersRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/account/site?section=hero')
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4 font-sans">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-950 shadow-sm">
        <Palette className="w-7 h-7 text-sky-700" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h1 className="text-xl font-bold text-blue-950">Hero Banners & Carousel Slides</h1>
        <p className="text-sm text-slate-500">
          Banners and slides are integrated directly into <strong>Site Appearance</strong> with live visual preview. Redirecting you now…
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Opening Site Appearance Studio…</span>
      </div>
      <Link
        href="/account/site?section=hero"
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-950 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold transition-colors"
      >
        <span>Go to Site Appearance</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
