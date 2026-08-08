'use client'

import Link from 'next/link'

export type ScrollLabel = {
  id: string
  name: string
  href: string
}

/** Infinite auto-scrolling category / brand labels. */
export default function ScrollLabels({ labels }: { labels: ScrollLabel[] }) {
  if (!labels.length) return null

  // Duplicate enough times for a seamless loop on wide screens
  const loop = [...labels, ...labels, ...labels]

  return (
    <section className="relative bg-white border-y border-blue-950/5 py-8 sm:py-10 overflow-hidden">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-scroll-labels hover:[animation-play-state:paused]">
          {loop.map((label, i) => (
            <Link
              key={`${label.id}-${i}`}
              href={label.href}
              className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 shrink-0 group"
            >
              <span className="text-[11px] sm:text-xs font-black tracking-[0.35em] uppercase text-blue-950 group-hover:text-sky-700 transition-colors whitespace-nowrap">
                {label.name}
              </span>
              <span className="text-sky-600/50 text-sm" aria-hidden>
                ·
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
