'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type BackdropSize = 'md' | 'xl'

/** Giant watermark word behind a section — editorial feel, not interactive. */
export default function EditorialBackdrop({
  text,
  light = false,
  size = 'md',
}: {
  text: string
  light?: boolean
  size?: BackdropSize
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    size === 'xl' ? ['-28%', '28%'] : ['-18%', '18%']
  )

  const sizeClass =
    size === 'xl'
      ? 'text-[56vw] sm:text-[46vw] md:text-[40vw] lg:text-[34vw]'
      : light
        ? 'text-[34vw] sm:text-[28vw] md:text-[24vw] lg:text-[20vw]'
        : 'text-[28vw] sm:text-[22vw] md:text-[18vw] lg:text-[15vw]'

  // Bigger marks stay a touch quieter so they don’t shout.
  const color =
    light
      ? 'text-white/[0.09]'
      : size === 'xl'
        ? 'text-blue-950/[0.045]'
        : 'text-blue-950/[0.035]'

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      <motion.div className="absolute inset-0" style={{ y }}>
        <p
          className={`absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 font-playfair font-black uppercase tracking-[-0.06em] whitespace-nowrap leading-none ${sizeClass} ${color}`}
        >
          {text}
        </p>
      </motion.div>
    </div>
  )
}
