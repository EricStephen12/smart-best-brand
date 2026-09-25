'use client'

import React, { useEffect, useState, useRef } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/actions/site-settings'
import { HEADING_FONTS, BODY_FONTS, type SiteSettingsData } from '@/lib/site-settings'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import toast from 'react-hot-toast'
import {
  Loader2, Save, CheckCircle2, ChevronRight,
  Store, Megaphone, Image as ImageIcon, FileText, AlignLeft,
  Phone, CreditCard, Palette, ShoppingBag, LayoutTemplate,
  Monitor, Smartphone, RotateCcw, ExternalLink,
} from 'lucide-react'

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type SectionId =
  | 'announcement' | 'hero' | 'story_1' | 'story_2' | 'story_stats'
  | 'featured' | 'collections' | 'promo' | 'products_page'
  | 'general' | 'colors' | 'fonts' | 'contact' | 'socials' | 'payments' | 'footer'

interface SectionDef {
  id: SectionId
  label: string
  hint: string
  icon: React.ElementType
  group: 'pages' | 'settings'
  /** Which URL to show in the preview iframe */
  previewPath: string
}

// ─── Section → preview page mapping ──────────────────────────────────────────

const SECTIONS: SectionDef[] = [
  { id: 'announcement',  label: 'Announcement bar',    hint: 'Top-of-page banner',           icon: Megaphone,      group: 'pages',    previewPath: '/#announcement' },
  { id: 'hero',          label: 'Hero section',         hint: 'Homepage hero headline & CTA', icon: ImageIcon,      group: 'pages',    previewPath: '/#hero' },
  { id: 'story_1',       label: 'Story — block 1',      hint: '"Who We Are" panel',           icon: AlignLeft,      group: 'pages',    previewPath: '/#story-1' },
  { id: 'story_2',       label: 'Story — block 2',      hint: '"Our Promise" panel',          icon: AlignLeft,      group: 'pages',    previewPath: '/#story-2' },
  { id: 'story_stats',   label: 'Story — stats & link', hint: 'Numbers & "read more" link',   icon: AlignLeft,      group: 'pages',    previewPath: '/#story-stats' },
  { id: 'featured',      label: 'Featured products',    hint: 'Best-sellers section heading', icon: ShoppingBag,    group: 'pages',    previewPath: '/#featured' },
  { id: 'collections',   label: 'Collections',          hint: 'Category grid heading',        icon: LayoutTemplate, group: 'pages',    previewPath: '/#collections' },
  { id: 'promo',         label: 'Promo banner',         hint: 'Mid-page full-bleed banner',   icon: ImageIcon,      group: 'pages',    previewPath: '/#promo' },
  { id: 'products_page', label: 'Products page',        hint: '/products page title',         icon: ShoppingBag,    group: 'pages',    previewPath: '/products#products-header' },
  { id: 'general',       label: 'Store details',        hint: 'Name, tagline, logo',          icon: Store,          group: 'settings', previewPath: '/#header' },
  { id: 'colors',        label: 'Colors',               hint: 'Brand palette',                icon: Palette,        group: 'settings', previewPath: '/' },
  { id: 'fonts',         label: 'Typography',           hint: 'Heading & body fonts',         icon: FileText,       group: 'settings', previewPath: '/' },
  { id: 'contact',       label: 'Contact info',         hint: 'Address, phone, email',        icon: Phone,          group: 'settings', previewPath: '/contact#contact-info' },
  { id: 'socials',       label: 'Social media',         hint: 'Instagram, Facebook etc.',     icon: Phone,          group: 'settings', previewPath: '/contact#contact-info' },
  { id: 'payments',      label: 'Payment details',      hint: 'Bank transfer account',        icon: CreditCard,     group: 'settings', previewPath: '/checkout#payments' },
  { id: 'footer',        label: 'Footer',               hint: 'Footer description text',      icon: AlignLeft,      group: 'settings', previewPath: '/#footer' },
]

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const inp = 'w-full px-3 py-2 border border-stone-200 rounded-lg text-xs outline-none focus:border-blue-950/60 focus:ring-2 focus:ring-blue-950/10 transition-all text-blue-950 bg-white'

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold text-slate-600 block">{label}</label>
      {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
      {children}
    </div>
  )
}

const COLOR_PRESETS = [
  { name: 'Navy & Sky',      primary: '#172554', accent: '#0284c7', bg: '#f7f6f3' },
  { name: 'Midnight & Gold', primary: '#0f172a', accent: '#d97706', bg: '#fafaf9' },
  { name: 'Emerald',         primary: '#064e3b', accent: '#10b981', bg: '#f4fbf7' },
  { name: 'Noir',            primary: '#18181b', accent: '#475569', bg: '#ffffff' },
]

// â”€â”€â”€ Main page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function SiteSettingsPage() {
  const [form, setForm]   = useState<SiteSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [open, setOpen]   = useState<SectionId | null>('hero')
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [iframeKey, setIframeKey] = useState(0) // bump to reload iframe
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    void getSiteSettings().then((d) => { setForm(d); setLoading(false) })
  }, [])

  const set = <K extends keyof SiteSettingsData>(k: K, v: SiteSettingsData[K]) =>
    setForm((p) => p ? { ...p, [k]: v } : p)

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!form) return
    setSaving(true)
    const r = await updateSiteSettings(form)
    setSaving(false)
    if (!r.success) { toast.error(r.error || 'Save failed'); return }
    if (r.data) setForm(r.data)
    // Reload iframe so saved changes are visible
    setIframeKey((k) => k + 1)
    toast.success('Saved — preview updated.')
  }

  const toggle = (id: SectionId) => {
    setOpen((prev) => prev === id ? null : id)
  }

  const activeSection = SECTIONS.find((s) => s.id === open)
  const previewPath   = activeSection?.previewPath ?? '/'
  const previewBase   = previewPath.split('#')[0] || '/'
  const pagesSections    = SECTIONS.filter((s) => s.group === 'pages')
  const settingsSections = SECTIONS.filter((s) => s.group === 'settings')

  // Smoothly scroll the iframe to the active section anchor whenever section changes
  useEffect(() => {
    if (!iframeRef.current) return
    const [, hash] = previewPath.split('#')

    const scrollToAnchor = () => {
      try {
        const doc = iframeRef.current?.contentDocument
        const win = iframeRef.current?.contentWindow
        if (!doc || !win) return

        if (hash) {
          const el = doc.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
          }
        } else {
          win.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch {
        // Fallback for cross-origin or sandbox limits
      }
    }

    scrollToAnchor()
    const timer = setTimeout(scrollToAnchor, 350)
    return () => clearTimeout(timer)
  }, [open, previewPath])

  const handleIframeLoad = () => {
    const [, hash] = previewPath.split('#')
    if (!hash || !iframeRef.current) return
    try {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        const el = doc.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    } catch {}
  }

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center h-[60vh] gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-blue-950" />
        <p className="text-sm text-stone-500">Loading settings…</p>
      </div>
    )
  }

  return (
    // Override the admin max-width so we get full screen width
    <div className="-mx-4 sm:-mx-6 md:-mx-8 flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>

      {/* ── Top bar ── */}
      <div className="shrink-0 bg-white border-b border-stone-200 px-4 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-blue-950">Site customiser</h1>
          <span className="text-[10px] text-stone-400 hidden sm:block">
            Click a section → edit in the panel → Save to apply
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Viewport toggle */}
          <div className="hidden md:flex items-center border border-stone-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`p-2 transition-colors ${viewport === 'desktop' ? 'bg-blue-950 text-white' : 'text-stone-400 hover:text-blue-950'}`}
              title="Desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`p-2 transition-colors ${viewport === 'mobile' ? 'bg-blue-950 text-white' : 'text-stone-400 hover:text-blue-950'}`}
              title="Mobile view"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reload preview */}
          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-2 border border-stone-200 rounded-lg text-stone-400 hover:text-blue-950 hover:border-stone-300 transition-colors"
            title="Reload preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Open in new tab */}
          <a
            href={previewPath}
            target="_blank"
            rel="noreferrer"
            className="p-2 border border-stone-200 rounded-lg text-stone-400 hover:text-blue-950 hover:border-stone-300 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => save()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-blue-950 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Savingâ€¦' : 'Save'}
          </button>
        </div>
      </div>

      {/* â”€â”€ Body â”€â”€ */}
      <div className="flex flex-1 overflow-hidden">

        {/* â”€â”€ Left sidebar â”€â”€ */}
        <aside className="w-72 shrink-0 border-r border-stone-200 bg-white overflow-y-auto flex flex-col">
          <form onSubmit={save} className="flex-1 overflow-y-auto">

            {/* Page sections */}
            <div className="px-3 pt-4 pb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-2 mb-1">
                Page sections
              </p>
            </div>
            {pagesSections.map((s) => (
              <SidebarItem
                key={s.id}
                section={s}
                isOpen={open === s.id}
                onToggle={() => toggle(s.id)}
              >
                <SectionFields id={s.id} form={form} set={set} />
              </SidebarItem>
            ))}

            {/* Theme settings */}
            <div className="px-3 pt-5 pb-1 border-t border-stone-100 mt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-2 mb-1">
                Theme settings
              </p>
            </div>
            {settingsSections.map((s) => (
              <SidebarItem
                key={s.id}
                section={s}
                isOpen={open === s.id}
                onToggle={() => toggle(s.id)}
              >
                <SectionFields id={s.id} form={form} set={set} />
              </SidebarItem>
            ))}

            <div className="px-3 py-4 border-t border-stone-100 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-950 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </aside>

        {/* ── Right: live iframe preview ── */}
        <div className="flex-1 bg-stone-100 flex flex-col items-center justify-start overflow-hidden">
          {/* Preview URL bar */}
          <div className="w-full px-4 py-2 bg-white border-b border-stone-200 flex items-center gap-2 shrink-0">
            <div className="flex-1 px-3 py-1.5 bg-stone-100 rounded-lg text-[11px] text-stone-500 font-mono truncate">
              localhost:3000{previewPath}
            </div>
            {viewport === 'mobile' && (
              <span className="text-[10px] font-semibold text-stone-400">375px</span>
            )}
          </div>

          {/* The iframe */}
          <div className={`flex-1 w-full overflow-hidden transition-all duration-300 ${
            viewport === 'mobile'
              ? 'flex items-start justify-center pt-4 pb-4'
              : ''
          }`}>
            <iframe
              key={`${iframeKey}-${previewBase}`}
              ref={iframeRef}
              src={previewPath}
              onLoad={handleIframeLoad}
              className={`bg-white transition-all duration-300 ${
                viewport === 'desktop'
                  ? 'w-full h-full border-0'
                  : 'w-[375px] h-full border border-stone-300 rounded-2xl shadow-2xl'
              }`}
              title="Store preview"
              // Allow same-origin iframe
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

// â”€â”€â”€ Sidebar accordion item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SidebarItem({ section, isOpen, onToggle, children }: {
  section: SectionDef
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const Icon = section.icon
  return (
    <div className={`border-l-2 transition-colors ${isOpen ? 'border-sky-500' : 'border-transparent'}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
          isOpen ? 'bg-sky-50' : 'hover:bg-stone-50'
        }`}
      >
        <Icon className={`w-3.5 h-3.5 shrink-0 ${isOpen ? 'text-sky-600' : 'text-stone-400'}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold leading-tight ${isOpen ? 'text-sky-700' : 'text-blue-950'}`}>
            {section.label}
          </p>
          <p className="text-[10px] text-stone-400 truncate leading-tight mt-0.5">{section.hint}</p>
        </div>
        <ChevronRight className={`w-3 h-3 text-stone-300 transition-transform shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-3 bg-sky-50/50 border-t border-sky-100/60">
          {children}
        </div>
      )}
    </div>
  )
}

// â”€â”€â”€ Section fields â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SectionFields({
  id, form, set,
}: {
  id: SectionId
  form: SiteSettingsData
  set: <K extends keyof SiteSettingsData>(k: K, v: SiteSettingsData[K]) => void
}) {
  switch (id) {

    case 'announcement':
      return (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-950">Show bar</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.announcementEnabled}
                onChange={(e) => set('announcementEnabled', e.target.checked)}
                className="sr-only peer" />
              <div className="w-8 h-4 bg-stone-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-950" />
            </label>
          </div>
          <F label="Message">
            <input value={form.announcementText || ''} onChange={(e) => set('announcementText', e.target.value)}
              className={inp} placeholder="Free delivery on orders above â‚¦150,000" />
          </F>
          <F label="Link (optional)">
            <input value={form.announcementLink || ''} onChange={(e) => set('announcementLink', e.target.value || null)}
              className={inp} placeholder="/products" />
          </F>
        </>
      )

    case 'hero':
      return (
        <>
          <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
            Active Banners override these. Go to <strong>Banners</strong> to add image slides.
          </p>
          <F label="Headline">
            <input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)}
              className={inp} placeholder="Sleep Like It Matters" />
          </F>
          <F label="Subtext">
            <input value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)}
              className={inp} placeholder="Original mattresses from Nigeria's most trusted brands." />
          </F>
          <F label="Button label">
            <input value={form.heroCtaLabel} onChange={(e) => set('heroCtaLabel', e.target.value)}
              className={inp} placeholder="Shop the Collection" />
          </F>
          <F label="Button link">
            <input value={form.heroCtaHref} onChange={(e) => set('heroCtaHref', e.target.value)}
              className={inp} placeholder="/products" />
          </F>
        </>
      )

    case 'story_1':
      return (
        <>
          <F label="Badge">
            <input value={form.storyBadge} onChange={(e) => set('storyBadge', e.target.value)}
              className={inp} placeholder="Our Story" />
          </F>
          <F label="Headline">
            <input value={form.storyTitle} onChange={(e) => set('storyTitle', e.target.value)}
              className={inp} placeholder="The Real Thing, Delivered to Your Door." />
          </F>
          <F label="Paragraph">
            <textarea rows={4} value={form.storyText} onChange={(e) => set('storyText', e.target.value)}
              className={`${inp} resize-none`} placeholder="Tell your brand storyâ€¦" />
          </F>
          <F label="Image">
            <CloudinaryUpload
              value={form.storyImageUrl ? [form.storyImageUrl] : []}
              onChange={(urls) => set('storyImageUrl', urls[urls.length - 1] || null)}
              maxFiles={1} label="Upload image" />
            <input type="url" value={form.storyImageUrl || ''}
              onChange={(e) => set('storyImageUrl', e.target.value || null)}
              className={`${inp} mt-1`} placeholder="Or paste image URL" />
          </F>
        </>
      )

    case 'story_2':
      return (
        <>
          <F label="Badge">
            <input value={form.storySecondaryBadge} onChange={(e) => set('storySecondaryBadge', e.target.value)}
              className={inp} placeholder="Our Promise" />
          </F>
          <F label="Headline">
            <input value={form.storySecondaryTitle} onChange={(e) => set('storySecondaryTitle', e.target.value)}
              className={inp} placeholder="Factory-Direct. Sealed. Guaranteed." />
          </F>
          <F label="Paragraph">
            <textarea rows={4} value={form.storySecondaryText} onChange={(e) => set('storySecondaryText', e.target.value)}
              className={`${inp} resize-none`} placeholder="Your quality guaranteeâ€¦" />
          </F>
        </>
      )

    case 'story_stats':
      return (
        <>
          <F label="Stat 1 â€” number">
            <input value={form.statOneValue} onChange={(e) => set('statOneValue', e.target.value)}
              className={inp} placeholder="07" />
          </F>
          <F label="Stat 1 â€” label">
            <input value={form.statOneBadge} onChange={(e) => set('statOneBadge', e.target.value)}
              className={inp} placeholder="Partner Brands" />
          </F>
          <F label="Stat 2 â€” number">
            <input value={form.statTwoValue} onChange={(e) => set('statTwoValue', e.target.value)}
              className={inp} placeholder="100%" />
          </F>
          <F label="Stat 2 â€” label">
            <input value={form.statTwoBadge} onChange={(e) => set('statTwoBadge', e.target.value)}
              className={inp} placeholder="Original Stock" />
          </F>
          <F label="Link label">
            <input value={form.storyLinkLabel} onChange={(e) => set('storyLinkLabel', e.target.value)}
              className={inp} placeholder="Our full story â†’" />
          </F>
        </>
      )

    case 'featured':
      return (
        <>
          <F label="Heading">
            <input value={form.featuredTitle} onChange={(e) => set('featuredTitle', e.target.value)}
              className={inp} placeholder="What people keep coming back for." />
          </F>
          <F label="Description">
            <input value={form.featuredDescription} onChange={(e) => set('featuredDescription', e.target.value)}
              className={inp} placeholder="Our most-loved pieces â€” or browse everything we carry." />
          </F>
        </>
      )

    case 'collections':
      return (
        <>
          <F label="Heading">
            <input value={form.collectionsTitle} onChange={(e) => set('collectionsTitle', e.target.value)}
              className={inp} placeholder="Shop by category" />
          </F>
          <F label="Description">
            <input value={form.collectionsDescription} onChange={(e) => set('collectionsDescription', e.target.value)}
              className={inp} placeholder="Mattresses, pillows, furnitureâ€¦" />
          </F>
        </>
      )

    case 'promo':
      return (
        <>
          <F label="Badge">
            <input value={form.promoBadge} onChange={(e) => set('promoBadge', e.target.value)}
              className={inp} placeholder="Crafted for Nigerian homes" />
          </F>
          <F label="Headline">
            <input value={form.promoTitle} onChange={(e) => set('promoTitle', e.target.value)}
              className={inp} placeholder="Spaces worth living in." />
          </F>
          <F label="Button label">
            <input value={form.promoCtaLabel} onChange={(e) => set('promoCtaLabel', e.target.value)}
              className={inp} placeholder="Shop the collection" />
          </F>
          <F label="Button link">
            <input value={form.promoCtaHref} onChange={(e) => set('promoCtaHref', e.target.value)}
              className={inp} placeholder="/products" />
          </F>
          <F label="Background image">
            <CloudinaryUpload
              value={form.promoImageUrl ? [form.promoImageUrl] : []}
              onChange={(urls) => set('promoImageUrl', urls[urls.length - 1] || null)}
              maxFiles={1} label="Upload image" />
            <input type="url" value={form.promoImageUrl || ''}
              onChange={(e) => set('promoImageUrl', e.target.value || null)}
              className={`${inp} mt-1`} placeholder="Or paste image URL" />
          </F>
        </>
      )

    case 'products_page':
      return (
        <>
          <F label="Page title">
            <input value={form.shopPageTitle} onChange={(e) => set('shopPageTitle', e.target.value)}
              className={inp} placeholder="The Collection" />
          </F>
          <F label="Tagline">
            <input value={form.shopPageTagline} onChange={(e) => set('shopPageTagline', e.target.value)}
              className={inp} placeholder="Original mattresses, luxury furniture and bedding." />
          </F>
        </>
      )

    case 'general':
      return (
        <>
          <F label="Store name">
            <input required value={form.siteName} onChange={(e) => set('siteName', e.target.value)}
              className={inp} placeholder="Smart Best Brands" />
          </F>
          <F label="Tagline" hint="Used as hero eyebrow and in SEO.">
            <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)}
              className={inp} placeholder="Quality mattresses, pillows & furniture" />
          </F>
          <F label="Logo" hint="Leave blank to use store name as text.">
            <CloudinaryUpload
              value={form.logoUrl ? [form.logoUrl] : []}
              onChange={(urls) => set('logoUrl', urls[urls.length - 1] || null)}
              maxFiles={1} label="Upload logo" />
            <input type="url" value={form.logoUrl || ''}
              onChange={(e) => set('logoUrl', e.target.value || null)}
              className={`${inp} mt-1`} placeholder="Or paste logo URL" />
          </F>
          <div className="p-3 bg-blue-950 rounded-xl flex items-center justify-center">
            {form.logoUrl
              ? <img src={form.logoUrl} alt="" className="h-7 object-contain max-w-full" />
              : <span className="text-white font-black text-xs tracking-widest">{form.siteName.toUpperCase()}</span>
            }
          </div>
        </>
      )

    case 'colors':
      return (
        <>
          <div className="grid grid-cols-2 gap-1.5">
            {COLOR_PRESETS.map((p) => (
              <button key={p.name} type="button"
                onClick={() => { set('primaryColor', p.primary); set('accentColor', p.accent); set('backgroundColor', p.bg) }}
                className="p-2 border border-stone-200 rounded-lg bg-stone-50 hover:border-sky-400 text-left transition-all">
                <div className="flex gap-1 mb-1">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.accent }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-stone-200" style={{ backgroundColor: p.bg }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{p.name}</span>
              </button>
            ))}
          </div>
          {([
            ['Primary', 'Buttons & header', 'primaryColor'],
            ['Accent',  'Links & badges',   'accentColor'],
            ['Background', 'Page BG',       'backgroundColor'],
          ] as [string, string, keyof SiteSettingsData][]).map(([label, hint, key]) => (
            <F key={key} label={label} hint={hint}>
              <div className="flex items-center gap-2">
                <input type="color"
                  value={/^#([0-9A-Fa-f]{6})$/.test(form[key] as string) ? form[key] as string : '#172554'}
                  onChange={(e) => set(key, e.target.value)}
                  className="h-8 w-9 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0" />
                <input value={form[key] as string} onChange={(e) => set(key, e.target.value)}
                  className={`${inp} flex-1`} placeholder="#172554" />
              </div>
            </F>
          ))}
        </>
      )

    case 'fonts':
      return (
        <>
          <F label="Heading font" hint={`Now: ${form.headingFont}`}>
            <div className="space-y-1">
              {HEADING_FONTS.map((f) => {
                const active = form.headingFont === f.name
                return (
                  <button key={f.name} type="button" onClick={() => set('headingFont', f.name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 border rounded-lg text-left transition-all ${
                      active ? 'border-blue-950 bg-blue-950 text-white' : 'border-stone-200 bg-white hover:border-stone-300 text-blue-950'
                    }`}>
                    <span className="text-xs font-medium" style={{ fontFamily: f.name }}>{f.label}</span>
                    {active && <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </F>
          <F label="Body font" hint={`Now: ${form.bodyFont}`}>
            <div className="space-y-1">
              {BODY_FONTS.map((f) => {
                const active = form.bodyFont === f.name
                return (
                  <button key={f.name} type="button" onClick={() => set('bodyFont', f.name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 border rounded-lg text-left transition-all ${
                      active ? 'border-blue-950 bg-blue-950 text-white' : 'border-stone-200 bg-white hover:border-stone-300 text-blue-950'
                    }`}>
                    <span className="text-xs font-medium" style={{ fontFamily: f.name }}>{f.label}</span>
                    {active && <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </F>
        </>
      )

    case 'contact':
      return (
        <>
          <F label="Store address">
            <input value={form.storeAddress} onChange={(e) => set('storeAddress', e.target.value)}
              className={inp} placeholder="Abuja Â· Benin City" />
          </F>
          <F label="Email">
            <input type="email" required value={form.contactEmail}
              onChange={(e) => set('contactEmail', e.target.value)}
              className={inp} placeholder="hello@smartbestbrands.com" />
          </F>
          <F label="WhatsApp" hint="Digits only with country code">
            <input value={form.whatsappNumber || ''} onChange={(e) => set('whatsappNumber', e.target.value || null)}
              className={inp} placeholder="2348012345678" />
          </F>
          <F label="Support phone">
            <input value={form.supportPhone || ''} onChange={(e) => set('supportPhone', e.target.value || null)}
              className={inp} placeholder="+234 800 000 0000" />
          </F>
        </>
      )

    case 'socials':
      return (
        <>
          {([
            ['Instagram', 'instagramUrl', 'https://instagram.com/â€¦'],
            ['Facebook',  'facebookUrl',  'https://facebook.com/â€¦'],
            ['Twitter / X', 'twitterUrl', 'https://x.com/â€¦'],
            ['TikTok',    'tiktokUrl',    'https://tiktok.com/â€¦'],
          ] as [string, keyof SiteSettingsData, string][]).map(([label, key, ph]) => (
            <F key={key} label={label}>
              <input type="url" value={(form[key] as string) || ''}
                onChange={(e) => set(key, e.target.value || null)}
                className={inp} placeholder={ph} />
            </F>
          ))}
        </>
      )

    case 'payments':
      return (
        <>
          <F label="Bank name">
            <input value={form.bankName || ''} onChange={(e) => set('bankName', e.target.value || null)}
              className={inp} placeholder="Moniepoint MFB / Zenith Bank" />
          </F>
          <F label="Account name">
            <input value={form.bankAccountName || ''} onChange={(e) => set('bankAccountName', e.target.value || null)}
              className={inp} placeholder="Smart Best Brands Nigeria" />
          </F>
          <F label="Account number">
            <input value={form.bankAccountNumber || ''} onChange={(e) => set('bankAccountNumber', e.target.value || null)}
              className={inp} placeholder="0123456789" inputMode="numeric" />
          </F>
        </>
      )

    case 'footer':
      return (
        <F label="Footer description">
          <textarea rows={3} value={form.footerText} onChange={(e) => set('footerText', e.target.value)}
            className={`${inp} resize-none`}
            placeholder="Original mattresses, luxury furniture, and bedding â€” factory-direct, delivered to your door." />
        </F>
      )

    default:
      return null
  }
}
