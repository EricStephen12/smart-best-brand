'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, MessageCircle, MapPin, Mail, Phone } from 'lucide-react'
import { getTelHref, getWhatsAppUrl } from '@/lib/contact-channels'
import { useSiteSettings } from '@/components/site-settings-context'
import { brandNameParts } from '@/lib/site-settings'
import {
  FOOTER_SHOP_LINKS,
  FOOTER_COMPANY_LINKS,
  FOOTER_LEGAL_LINKS,
  PAYMENT_METHODS,
} from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const settings = useSiteSettings()
  const brand = brandNameParts(settings.siteName)
  const contact = {
    whatsappNumber: settings.whatsappNumber,
    supportPhone: settings.supportPhone,
  }
  const whatsappUrl = getWhatsAppUrl(undefined, contact)
  const telHref = getTelHref(contact)

  let customFooterLinks: any = null
  try {
    if (settings.footerLinksJson) {
      customFooterLinks = JSON.parse(settings.footerLinksJson)
    }
  } catch {}

  const shopLinks = (Array.isArray(customFooterLinks?.shopLinks) && customFooterLinks.shopLinks.length > 0)
    ? customFooterLinks.shopLinks
    : FOOTER_SHOP_LINKS

  const companyLinks = (Array.isArray(customFooterLinks?.companyLinks) && customFooterLinks.companyLinks.length > 0)
    ? customFooterLinks.companyLinks
    : FOOTER_COMPANY_LINKS

  return (
    <footer id="footer" className="bg-navy-dark text-white pt-16 sm:pt-20 pb-10 print:hidden scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-base font-bold tracking-widest uppercase text-white"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {brand.lead}
              <span className="text-neutral-400">{brand.accent}</span>
            </Link>
            {settings.footerText ? (
              <p className="mt-4 text-sm text-white/45 leading-relaxed max-w-xs">
                {settings.footerText}
              </p>
            ) : null}
          </div>

          <FooterSection title="Shop" links={shopLinks} />
          <FooterSection title="Company" links={companyLinks} />

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/40 mb-5">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-white/30 shrink-0" />
                <p>{settings.storeAddress || 'Abuja · Benin City'}</p>
              </div>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-white/30 shrink-0" />
                {settings.contactEmail}
              </a>
              {telHref ? (
                <a href={telHref} className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-white/30 shrink-0" />
                  {settings.supportPhone || 'Call us'}
                </a>
              ) : null}
            </div>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2 mt-5">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-[11px] text-white/25 tracking-wide">
            © {currentYear} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-[11px] text-white/30 hover:text-white/60 transition-colors tracking-wide">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterSection({
  title,
  links,
}: {
  title: string
  links: readonly { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/40 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/45 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
