'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, MessageCircle, MapPin, Mail, ArrowUpRight, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-blue-950 text-white pt-24 pb-12 overflow-hidden selection:bg-sky-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Brand Masthead: Reference Style */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
          <Link href="/" className="group flex flex-col items-center w-full">
            <div
              className="text-3xl sm:text-5xl md:text-7xl font-black tracking-widest leading-none text-white group-hover:text-sky-400 transition-colors duration-500"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              SMARTBEST<span className="text-sky-600">BRANDS</span>
            </div>
          </Link>

          <div className="w-12 h-[2px] bg-sky-600 mt-10 sm:mt-16" />

          <p className="text-sm sm:text-lg text-slate-400 font-medium max-w-2xl mt-8 sm:mt-12 leading-relaxed px-4">
            Nigeria&apos;s premier destination for authenticated luxury interiors. The pinnacle of authentic rest, strictly certified.
          </p>
        </div>

        {/* Global Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16 sm:mb-24 border-t border-white/5 pt-20 sm:pt-24">
          <FooterSection
            title="Sectors"
            links={[
              { label: 'Mattress Systems', href: '/products?category=Mattresses' },
              { label: 'Ergonomic Support', href: '/products?category=Pillows' },
              { label: 'Bespoke Furniture', href: '/products?category=Furniture' },
              { label: 'New Acquisitions', href: '/products' }
            ]}
          />
          <FooterSection
            title="Institutional"
            links={[
              { label: 'Our Legacy', href: '/about' },
              { label: 'Artisanal Standards', href: '/about' },
              { label: 'Contact HQ', href: '/contact' },
              { label: 'Support Protocols', href: '/faqs' }
            ]}
          />
          <FooterSection
            title="Legal Framework"
            links={[
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Privacy Protocol', href: '/privacy' },
              { label: 'Refund Policy', href: '/refund' }
            ]}
          />
          <div className="space-y-8 sm:col-span-1">
            <h4 className="text-[10px] font-black tracking-[0.4em] text-sky-400 uppercase">Communications</h4>
            <div className="flex gap-4">
              <SocialLink icon={Instagram} href="#" />
              <SocialLink icon={MessageCircle} href="#" />
              <SocialLink icon={Phone} href="#" />
            </div>
            <div className="space-y-6 pt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sky-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global HQ</span>
                </div>
                <p className="text-slate-400 text-xs font-bold pl-7 leading-tight uppercase tracking-widest">
                  Abuja &bull; Benin City
                </p>
              </div>
              <div className="flex flex-col gap-2 bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-sky-600/30 transition-all">
                <div className="flex items-center gap-3 text-sky-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Correspondence</span>
                </div>
                <a href="mailto:smartbestbrands@gmail.com" className="text-white text-[10px] sm:text-xs font-black pl-7 underline decoration-sky-600 underline-offset-4 tracking-[0.05em] break-all">
                  smartbestbrands@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Footer Details */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[9px] font-black tracking-[0.4em] text-slate-600 uppercase">
            © {currentYear} Smart Best Brands.
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-[9px] font-black tracking-[0.5em] text-slate-600 uppercase">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSection({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div className="space-y-8">
      <h4 className="text-[10px] font-black tracking-[0.4em] text-sky-400 uppercase">{title}</h4>
      <ul className="space-y-4">
        {links.map((link, i) => (
          <li key={i}>
            <Link
              href={link.href}
              className="text-slate-400 hover:text-white transition-colors font-bold text-[10px] uppercase tracking-widest block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ icon: Icon, href }: { icon: React.ElementType, href: string }) {
  return (
    <motion.a
      whileHover={{ y: -5, scale: 1.1 }}
      href={href}
      className="w-12 h-12 bg-white/5 rounded-none flex items-center justify-center text-white hover:text-sky-400 hover:bg-white/10 transition-all border border-white/10"
    >
      <Icon className="w-5 h-5" />
    </motion.a>
  )
}
