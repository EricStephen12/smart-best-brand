'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Wind, Moon, Activity, ArrowRight, CheckCircle2 } from 'lucide-react'

interface FeaturePill {
  id: string
  label: string
  icon: React.ElementType
  title: string
  eyebrow: string
  description: string
  recommendedType: string
  targetFilter: string
  features: string[]
  statsHighlight: string
}

const FEATURE_PILLS: FeaturePill[] = [
  {
    id: 'orthopedic',
    label: 'Orthopedic Spine Support',
    icon: Activity,
    eyebrow: 'Medical-Grade Firmness',
    title: 'Engineered for Back Pain Relief & Posture Alignment',
    description:
      'Specially cured ultra-high-density foam core provides firm, even resistance across the spine. Prevents the lumbar sinkage common in inferior foam, maintaining natural curvature all night.',
    recommendedType: 'Mouka Regal & Vitafoam Orthopedic Series',
    targetFilter: '/products?search=orthopedic',
    features: ['High-density rebonded core', 'Zero lumbar sinkage', 'Doctor-recommended for spinal wellness'],
    statsHighlight: '100% Sag-Proof Core',
  },
  {
    id: 'cooling',
    label: 'Breathable Tropical Knit',
    icon: Wind,
    eyebrow: 'Heat-Dissipating Fabric',
    title: 'Woven for Optimal Airflow in Nigerian Climates',
    description:
      'Crafted with micro-vented jacquard and airflow channels that dissipate heat and wick moisture away from your body. Rest cool and refreshed even during warm tropical evenings.',
    recommendedType: 'Vitafoam Grandeur & Royal Cool-Knit Collection',
    targetFilter: '/products',
    features: ['Micro-vented airflow channels', 'Hypoallergenic damask cover', 'Prevents heat trap'],
    statsHighlight: '3x Better Airflow',
  },
  {
    id: 'motion',
    label: 'Zero Motion Disturbance',
    icon: Moon,
    eyebrow: 'Partner Rest Isolation',
    title: 'Sleep Deeply Even When Your Partner Moves',
    description:
      'Advanced cellular energy-absorption technology absorbs lateral vibrations instantly. Your partner can toss, turn, or get out of bed without disturbing your deep sleep cycle.',
    recommendedType: 'Mouka Flora & Royal Luxury Quilted Series',
    targetFilter: '/products',
    features: ['Independent pocket / zoned absorption', 'Silent energy dissipation', 'Undisturbed deep sleep'],
    statsHighlight: '98% Vibration Absorption',
  },
  {
    id: 'durability',
    label: '10-Year Sag-Proof Longevity',
    icon: ShieldCheck,
    eyebrow: 'Factory Guaranteed',
    title: 'High-Density Virgin Foam That Retains Its Crown',
    description:
      'Unlike roadside low-density foams that collapse after months, our factory-certified mattresses are built with virgin chemical compounds guaranteed to maintain resilience year after year.',
    recommendedType: 'Factory-Direct Mouka, Vitafoam & Royal Foam',
    targetFilter: '/products',
    features: ['Original manufacturer warranty card', 'Virgin density compound', 'Factory sealed packaging'],
    statsHighlight: '10-Year Factory Warranty',
  },
]

export default function SleepMatcherCapsule() {
  const [activeId, setActiveId] = useState<string>('orthopedic')
  const activeFeature = FEATURE_PILLS.find((f) => f.id === activeId) || FEATURE_PILLS[0]
  const IconComponent = activeFeature.icon

  return (
    <section className="relative py-16 sm:py-20 md:py-24 border-t border-blue-950/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header & Capsule Pill Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 sm:mb-16">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 block">
              True Rest Engineering
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-blue-950 tracking-tight leading-[1.12]">
              We consider your body posture to match the mattress that restores you.
            </h2>
          </div>

          {/* Interactive Feature Pills */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3 block">
              Select key rest priority:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {FEATURE_PILLS.map((pill) => {
                const Icon = pill.icon
                const isActive = activeId === pill.id
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setActiveId(pill.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all style-button ${
                      isActive
                        ? 'bg-blue-950 text-white shadow-md shadow-blue-950/20 scale-[1.02]'
                        : 'bg-white/80 hover:bg-white text-stone-600 hover:text-blue-950 border border-stone-200/80 hover:border-blue-950/30'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-stone-400'}`} />
                    <span>{pill.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Detail Card for Active Selection */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-8 sm:p-10 md:p-12 bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-xl shadow-blue-950/5 rounded-3xl style-card"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Left Column: Details & Specs */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-sky-600 mb-2">
                    <IconComponent className="w-4 h-4 text-sky-600" />
                    <span>{activeFeature.eyebrow}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-blue-950 tracking-tight leading-snug">
                    {activeFeature.title}
                  </h3>
                </div>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* Feature Bullet Points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {activeFeature.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-medium text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={activeFeature.targetFilter}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-950 hover:bg-sky-700 text-white text-xs font-black uppercase tracking-[0.18em] transition-all style-button"
                  >
                    <span>Browse {activeFeature.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-xs text-stone-400 font-medium">
                    Recommended: <strong className="text-blue-950 font-semibold">{activeFeature.recommendedType}</strong>
                  </span>
                </div>
              </div>

              {/* Right Column: Key Metric Callout Box */}
              <div className="lg:col-span-5 bg-stone-50/90 border border-stone-200/80 p-8 rounded-2xl style-card text-center sm:text-left flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 block">
                    Verified Factory Metric
                  </span>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-blue-950">
                    {activeFeature.statsHighlight}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    All mattresses distributed through Smart Best Brands are inspected and certified original with official manufacturer stamp and factory seal.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-200/70 flex items-center justify-between text-[11px] font-bold text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Authorized Distributor
                  </span>
                  <span className="text-sky-700 uppercase tracking-wider">Abuja · Benin City · Nationwide</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
