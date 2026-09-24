'use client'

import React, { useState } from 'react'
import { Plus, Minus, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'Do you sell original mattresses?',
    answer: 'Yes. We are authorized distributors for all the brands listed on our site, including Vitafoam, Mouka Foam, and Royal Foam. Every mattress comes in its original factory packaging with a valid manufacturer warranty.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'For locations within Abuja and Benin, delivery typically takes 24–48 hours. For other locations, it may take 3–5 business days depending on the size of the order.',
  },
  {
    question: 'How do I pay for my order?',
    answer: 'You can pay securely online via Paystack (debit card), by direct bank transfer, or place your order via WhatsApp. Pay on delivery is not available for large furniture items.',
  },
  {
    question: 'Can I return a mattress?',
    answer: 'Due to hygiene reasons, mattresses cannot be returned once the factory seal has been opened. If there is a manufacturing defect, we will facilitate a free replacement through the manufacturer warranty process.',
  },
  {
    question: 'Do you offer bulk or corporate discounts?',
    answer: 'Yes — hotels, hospitals, and large corporate orders qualify for special pricing. Reach out via our contact page for a custom quote.',
  },
  {
    question: 'Can I order a custom size mattress?',
    answer: 'Yes. If you have a custom bed frame or special room dimensions, we can place a custom order directly with Vitafoam, Mouka, or Royal Foam. Message us on WhatsApp with your exact measurements.',
  },
]

export default function FAQsClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sky-600 font-black tracking-[0.3em] text-xs uppercase mb-4 block"
          >
            Help &amp; FAQs
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-display text-4xl sm:text-6xl font-semibold text-blue-950 tracking-tight leading-[1.05]"
          >
            Frequently asked
          </motion.h1>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className={`border transition-colors duration-300 overflow-hidden ${
                openIndex === idx
                  ? 'border-blue-950/20 bg-white'
                  : 'border-stone-100 bg-stone-50/50 hover:border-blue-950/15'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
                aria-expanded={openIndex === idx}
              >
                <span className={`text-base sm:text-lg font-semibold transition-colors duration-200 pr-6 leading-snug ${
                  openIndex === idx ? 'text-blue-950' : 'text-stone-600'
                }`}>
                  {faq.question}
                </span>
                <span className={`shrink-0 p-2 border transition-all duration-200 ${
                  openIndex === idx
                    ? 'bg-blue-950 text-white border-blue-950'
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
                      <div className="h-px w-10 bg-sky-600 mb-4" />
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

        {/* Bottom CTA — no blur circle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-10 sm:p-14 bg-blue-950 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-3">
                Still have questions?
              </h2>
              <p className="text-sky-200/80 text-sm leading-relaxed">
                Our team is on WhatsApp and phone during business hours (8AM – 8PM WAT).
              </p>
            </div>
            <div className="flex md:justify-end">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 bg-white text-blue-950 px-8 py-4 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-sky-50 transition-colors"
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
