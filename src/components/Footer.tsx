'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, MessageCircle, MapPin, Mail, Phone } from 'lucide-react'
import { getTelHref, getWhatsAppUrl } from '@/lib/contact-channels'
import { useSiteSettings } from '@/components/site-settings-context'
import { brandNameParts } from '@/lib/site-settings'

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

  return (
    <footer className="bg-blue-950 text-white pt-16 sm:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div>
            <Link
              href="/"
              className="text-lg font-black tracking-[0.18em] uppercase"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {brand.lead}
              <span className="text-sky-500">{brand.accent}</span>
            </Link>
            <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-xs">
              {settings.footerText ||
                'Mattresses, pillows, and furniture for Nigerian homes.'}
            </p>
          </div>

          <FooterSection
            title="Shop"
            links={[
              { label: 'All products', href: '/products' },
              { label: 'Mattresses', href: '/products?category=Mattresses' },
              { label: 'Pillows', href: '/products?category=Pillows' },
              { label: 'Furniture', href: '/products?category=Furniture' },
            ]}
          />

          <FooterSection
            title="Company"
            links={[
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'FAQs', href: '/faqs' },
            ]}
          />

          <div>
            <h4 className="text-[10px] font-black tracking-[0.35em] uppercase text-sky-400 mb-5">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-sky-500 shrink-0" />
                <p>{settings.storeAddress || 'Abuja · Benin City'}</p>
              </div>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 hover:text-white transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                {settings.contactEmail}
              </a>
              {telHref ? (
                <a href={telHref} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                  Call us
                </a>
              ) : null}
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3 mt-5">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors rounded-lg"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors rounded-lg"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors rounded-lg"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-white/35">
          <p>
            © {currentYear} {settings.siteName}
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="hover:text-white/70">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70">
              Terms
            </Link>
            <Link href="/refund" className="hover:text-white/70">
              Refunds
            </Link>
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
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="text-[10px] font-black tracking-[0.35em] uppercase text-sky-400 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
