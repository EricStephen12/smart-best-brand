'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'

interface JournalArticle {
  id: string
  title: string
  category: string
  date: string
  readTime: string
  excerpt: string
  image: string
  href: string
}

const ARTICLES: JournalArticle[] = [
  {
    id: '1',
    title: 'Orthopedic vs. Semi-Orthopedic: Which Mattress is Right for Back Pain?',
    category: 'Spine Health & Ergonomics',
    date: 'Certified Sleep Guide',
    readTime: '4 min read',
    excerpt:
      'Understanding the critical difference between medical-grade firm rebonded core foam and cushioned semi-orthopedic support for spinal curvature.',
    image: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
    href: '/faqs',
  },
  {
    id: '2',
    title: 'The 10-Year Mattress Lifespan: Why Genuine High-Density Foam Outlasts Generic Foam',
    category: 'Material Science',
    date: 'Factory Standards',
    readTime: '5 min read',
    excerpt:
      'Why low-grade chemical mixtures collapse within six months, and how authorized Mouka and Vitafoam chemical densities withstand tropical conditions.',
    image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    href: '/about',
  },
  {
    id: '3',
    title: 'Nigerian Bed Dimensions: King (6x6) vs Queen (5x6) Master Bedroom Layouts',
    category: 'Bedroom Planning',
    date: 'Size & Fit Guide',
    readTime: '3 min read',
    excerpt:
      'A practical room clearance breakdown to ensure your mattress, headboard, and walking lanes fit comfortably in your bedroom space.',
    image: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
    href: '/delivery',
  },
]

export default function EditorialJournal() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 border-t border-blue-950/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-sky-600">
              <BookOpen className="w-3.5 h-3.5" />
              <span>The Rest Journal</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-blue-950 tracking-tight leading-none">
              Expert Guidance for Better Sleep
            </h2>
          </div>

          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-950 hover:text-sky-700 transition-colors"
          >
            <span>View All FAQs & Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-300 style-card"
            >
              {/* Image Frame */}
              <Link
                href={article.href}
                className="relative aspect-[16/10] overflow-hidden bg-stone-100 block"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>

              {/* Content Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    <span className="text-sky-700">{article.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-blue-950 leading-snug group-hover:text-sky-800 transition-colors">
                    <Link href={article.href}>{article.title}</Link>
                  </h3>

                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <Link
                    href={article.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-950 group-hover:text-sky-700 transition-colors"
                  >
                    <span>Read guide</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
