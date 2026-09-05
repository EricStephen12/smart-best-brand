'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error)
  }, [error])

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 mb-6">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-700">
            System Notice
          </span>
        </div>

        <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-semibold text-blue-950 tracking-tight mb-4">
          An unexpected pause occurred.
        </h1>

        <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-10">
          Our systems encountered a momentary hitch while rendering this page. You can attempt to refresh the view or return to the main gallery.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-950 text-white px-8 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-sky-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-blue-950 text-blue-950 px-8 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Return home
          </Link>
        </div>

        {error?.digest ? (
          <p className="text-[11px] font-mono text-stone-400">
            Error ID: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  )
}
