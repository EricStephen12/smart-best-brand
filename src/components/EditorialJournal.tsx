'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { EDITORIAL_JOURNAL } from '@/lib/constants'
import { useSiteSettings } from '@/components/site-settings-context'

export default function EditorialJournal() {
  const settings = useSiteSettings()
  let customJournal: any = null
  try {
    if (settings.editorialJournalJson) {
      customJournal = JSON.parse(settings.editorialJournalJson)
    }
  } catch {}

  const eyebrow = customJournal?.eyebrow || EDITORIAL_JOURNAL.eyebrow
  const title = customJournal?.title || EDITORIAL_JOURNAL.title
  const viewAllLabel = customJournal?.viewAllLabel || EDITORIAL_JOURNAL.viewAllLabel
  const viewAllHref = customJournal?.viewAllHref || EDITORIAL_JOURNAL.viewAllHref
  const articles = (customJournal?.articles && Array.isArray(customJournal.articles) && customJournal.articles.length > 0)
    ? customJournal.articles
    : EDITORIAL_JOURNAL.articles

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28 border-t border-neutral-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 uppercase font-sans">
              {title}
            </h2>
          </div>

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-500 transition-colors pb-1 border-b border-neutral-900 hover:border-neutral-500 self-start sm:self-end"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Article Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {articles.map((article: any, idx: number) => {
            const imageSrc = article.imageUrl || article.image || '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg'
            const category = article.category || article.tag || 'Guide'
            const readTime = article.readTime || '3 min read'
            const excerpt = article.excerpt || article.description || ''

            return (
              <motion.article
                key={article.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col cursor-pointer"
              >
                <Link href={article.href || '#'} className="block overflow-hidden rounded-2xl bg-neutral-100 aspect-[16/11] relative">
                  <Image
                    src={imageSrc}
                    alt={article.title || 'Article'}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>

                {/* Meta details */}
                <div className="pt-5 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  <span className="text-neutral-900 font-semibold">{category}</span>
                  <span>{readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug tracking-tight mt-3 group-hover:text-neutral-600 transition-colors">
                  <Link href={article.href || '#'}>
                    {article.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed line-clamp-2 mt-2 font-normal">
                    {excerpt}
                  </p>
                )}

                {/* Read Link */}
                <div className="mt-4 pt-1">
                  <Link
                    href={article.href || '#'}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 group-hover:text-neutral-500 transition-colors"
                  >
                    <span>Read article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.article>
            )
          })}
        </div>

      </div>
    </section>
  )
}
