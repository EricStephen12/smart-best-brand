'use client'

import Link from 'next/link'
import { useSiteSettings } from '@/components/site-settings-context'

export type ScrollLabel = {
  id: string
  name: string
  href: string
}

/** Infinite auto-scrolling category / brand labels with warm light-brown background. */
export default function ScrollLabels({ labels }: { labels: ScrollLabel[] }) {
  const settings = useSiteSettings()
  let activeLabels = labels

  try {
    if (settings.tickerLabelsJson) {
      const parsed = JSON.parse(settings.tickerLabelsJson)
      if (Array.isArray(parsed?.customItems) && parsed.customItems.length > 0) {
        activeLabels = parsed.customItems.map((item: any, idx: number) => ({
          id: item.id || `custom-${idx}`,
          name: item.text || item.name || '',
          href: item.href || '/products',
        }))
      }
    }
  } catch {}

  if (!activeLabels.length) return null

  // Duplicate enough times for a seamless loop on wide screens
  const loop = [...activeLabels, ...activeLabels, ...activeLabels]

  return (
    <section className="relative bg-[#F2ECE2] border-y border-[#E5DCCE] py-7 sm:py-8 overflow-hidden">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#F2ECE2] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#F2ECE2] to-transparent" />

        <div className="flex w-max animate-scroll-labels hover:[animation-play-state:paused]">
          {loop.map((label, i) => (
            <Link
              key={`${label.id}-${i}`}
              href={label.href}
              className="flex items-center gap-5 sm:gap-7 px-5 sm:px-7 shrink-0 group"
            >
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-neutral-900 group-hover:text-neutral-600 transition-colors whitespace-nowrap">
                {label.name}
              </span>
              <span className="text-[#9B7C5F]/70 text-sm font-semibold" aria-hidden>
                ·
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
