'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'
import { useSiteSettings } from '@/components/site-settings-context'

export default function NewsletterSection() {
  const settings = useSiteSettings()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  let nlData: any = null
  try {
    if (settings.newsletterJson) {
      nlData = JSON.parse(settings.newsletterJson)
    }
  } catch {}

  const title = nlData?.title || 'Get exclusive deals & interior tips'
  const subtitle = nlData?.subtitle || 'Join 2,000+ Nigerians who shop smarter. No spam, ever.'
  const placeholder = nlData?.placeholder || 'Enter your email address'
  const ctaLabel = nlData?.ctaLabel || 'Subscribe'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section id="newsletter" className="bg-[#172554] text-white py-16 sm:py-20 px-6 scroll-mt-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sky-400 font-bold tracking-[0.25em] text-[11px] uppercase mb-3 block">
            Newsletter
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 font-sans">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-blue-200/80 mb-8 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/15"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-white text-blue-950 font-bold text-xs uppercase tracking-wider rounded-full hover:bg-neutral-100 transition-colors shrink-0"
              >
                {ctaLabel}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
