import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-24 px-4 bg-white/50">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-950/10 animate-ping" />
        <div className="relative w-10 h-10 rounded-full border-2 border-t-blue-950 border-r-transparent border-b-blue-950/20 border-l-transparent animate-spin" />
      </div>
    </div>
  )
}
