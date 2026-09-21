import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-24 px-4 bg-white/50">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated luxury pulse ring */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-blue-950/15 animate-ping" />
          <div className="relative w-12 h-12 rounded-full border-2 border-t-blue-950 border-r-transparent border-b-blue-950/30 border-l-transparent animate-spin" />
        </div>
        <p className="text-[10px] font-black tracking-[0.28em] uppercase text-stone-400">
          Smart Best Brands
        </p>
      </div>
    </div>
  )
}
