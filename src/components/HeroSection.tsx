'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 80])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen bg-white selection:bg-sky-100 flex flex-col justify-center py-20 lg:py-0 overflow-hidden">

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-24 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Side: Dramatic High-Contrast Typography */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-10 sm:space-y-12">

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.6em] text-sky-600 uppercase">
                01 / CURATED COLLECTION
              </span>
            </motion.div>

            <div className="space-y-0 relative z-20">
              <h1 className="flex flex-col">
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-5xl sm:text-7xl md:text-[7rem] lg:text-[9.5rem] font-black leading-[0.85] tracking-[-0.03em] text-blue-950 font-playfair uppercase drop-shadow-sm"
                  >
                    PURE
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-5xl sm:text-7xl md:text-[7rem] lg:text-[9.5rem] font-black leading-[0.85] tracking-[-0.03em] text-sky-600 font-playfair uppercase drop-shadow-sm"
                  >
                    COMFORT.
                  </motion.span>
                </span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-start gap-8"
            >
              <Link href="/products">
                <button className="bg-blue-950 text-white px-10 py-5 rounded-none font-black text-[10px] tracking-[0.3em] uppercase hover:bg-sky-600 transition-all duration-300 transform active:scale-95 shadow-xl shadow-blue-950/20">
                  SHOP THE ESSENCE
                </button>
              </Link>

              <p className="text-sm font-bold text-slate-400 max-w-[240px] leading-tight">
                Nigeria&apos;s pinnacle of authentic rest. Strictly factory sealed luxury.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Asymmetric Overlap Layout - EXPANDED */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative group">

            {/* Main Large Image */}
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[16/11] lg:aspect-[4/5] overflow-hidden bg-slate-100 shadow-2xl"
            >
              <Image
                src="/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg"
                alt="Elite Home Luxury"
                fill
                priority
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-blue-950/5" />
            </motion.div>

            {/* Overlapping Detail Box - Reference Style */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute -bottom-8 -left-8 sm:-bottom-12 sm:-left-12 w-40 h-48 sm:w-64 sm:h-72 overflow-hidden border-8 border-white shadow-2xl z-20"
            >
              <Image
                src="/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg"
                alt="Elite Detail"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Decorative Label - Reference Style */}
            <div className="absolute top-10 -right-4 flex flex-col items-center gap-4 hidden xl:flex">
              <div className="w-[1px] h-24 bg-blue-950/10" />
              <span className="text-[10px] font-black tracking-[0.8em] text-slate-300 uppercase vertical-text transform rotate-180">
                ELITE STANDARDS 2024
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Progress Scroll Legend */}
      <motion.div
        style={{ opacity }}
        className="absolute left-8 bottom-12 hidden lg:flex items-center gap-8"
      >
        <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-blue-950 text-xs font-black">
          01
        </div>
        <div className="h-[1px] w-24 bg-slate-100 relative overflow-hidden">
          <motion.div
            animate={{ x: [-96, 96] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="w-full h-full bg-blue-950 absolute left-0"
          />
        </div>
      </motion.div>
    </section>
  )
}
