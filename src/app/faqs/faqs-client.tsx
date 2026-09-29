'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Minus, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FAQS } from '@/lib/constants'
import { useSiteSettings } from '@/components/site-settings-context'

export default function FAQsClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const settings = useSiteSettings()

  const faqsList = useMemo(() => {
    if (!settings.faqsJson) return FAQS
    try {
      const parsed = JSON.parse(settings.faqsJson)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {}
    return FAQS
  }, [settings.faqsJson])

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[var(--brand-accent)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block"
          >
            Help &amp; FAQs
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-display text-4xl sm:text-6xl font-semibold text-neutral-900 tracking-tight leading-[1.05]"
          >
            Frequently asked
          </motion.h1>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqsList.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className={`border transition-colors duration-300 overflow-hidden style-card ${
                openIndex === idx
                  ? 'border-neutral-900/20 bg-white'
                  : 'border-stone-100 bg-stone-50/50 hover:border-neutral-900/15'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
                aria-expanded={openIndex === idx}
              >
                <span className={`text-base sm:text-lg font-semibold transition-colors duration-200 pr-6 leading-snug ${
                  openIndex === idx ? 'text-neutral-900' : 'text-stone-600'
                }`}>
                  {faq.question}
                </span>
                <span className={`shrink-0 p-2 border transition-all duration-200 style-button ${
                  openIndex === idx
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-white text-stone-400 border-stone-200'
                }`}>
                  {openIndex === idx
                    ? <Minus className="w-4 h-4" />
                    : <Plus className="w-4 h-4" />
                  }
                </span>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="h-px w-10 bg-[var(--brand-accent)] mb-4" />
                      <p className="text-sm sm:text-base text-stone-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-10 sm:p-14 bg-navy-dark text-white rounded-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-3">
                Still have questions?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Our team is on WhatsApp and phone during business hours (8AM – 8PM WAT).
              </p>
            </div>
            <div className="flex md:justify-end">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 bg-white text-neutral-950 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-neutral-100 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Get in touch
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
