'use client'

import React, { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/actions/site-settings'
import { HEADING_FONTS, BODY_FONTS, type SiteSettingsData } from '@/lib/site-settings'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import toast from 'react-hot-toast'
import {
  Loader2, Save, Eye, CheckCircle2, ChevronRight, ChevronDown,
  Store, Megaphone, Image as ImageIcon, FileText, AlignLeft,
  Phone, CreditCard, Palette, ShoppingBag, LayoutTemplate,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

// ─── Section definitions ───────────────────────────────────────────────────────

const SECTIONS: SectionDef[] = [
  // Page sections — like Shopify's "Sections" group
  { id: 'announcement',  label: 'Announcement bar',    hint: 'Top-of-page banner',           icon: Megaphone,       group: 'pages' },
  { id: 'hero',          label: 'Hero section',         hint: 'Homepage hero headline & CTA', icon: ImageIcon,       group: 'pages' },
  { id: 'story_1',       label: 'Story — block 1',      hint: '"Who We Are" panel',           icon: AlignLeft,       group: 'pages' },
  { id: 'story_2',       label: 'Story — block 2',      hint: '"Our Promise" panel',          icon: AlignLeft,       group: 'pages' },
  { id: 'story_stats',   label: 'Story — stats & link', hint: 'Numbers & "read more" link',   icon: AlignLeft,       group: 'pages' },
  { id: 'featured',      label: 'Featured products',    hint: 'Best-sellers section heading', icon: ShoppingBag,     group: 'pages' },
  { id: 'collections',   label: 'Collections',          hint: 'Category grid heading',        icon: LayoutTemplate,  group: 'pages' },
  { id: 'promo',         label: 'Promo banner',         hint: 'Mid-page full-bleed banner',   icon: ImageIcon,       group: 'pages' },
  { id: 'products_page', label: 'Products page',        hint: '/products page title',         icon: ShoppingBag,     group: 'pages' },
  // Theme settings — like Shopify's "Theme settings" group
  { id: 'general',       label: 'Store details',        hint: 'Name, tagline, logo',          icon: Store,           group: 'settings' },
  { id: 'colors',        label: 'Colors',               hint: 'Brand palette',                icon: Palette,         group: 'settings' },
  { id: 'fonts',         label: 'Typography',           hint: 'Heading & body fonts',         icon: FileText,        group: 'settings' },
  { id: 'contact',       label: 'Contact info',         hint: 'Address, phone, email',        icon: Phone,           group: 'settings' },
  { id: 'socials',       label: 'Social media',         hint: 'Instagram, Facebook etc.',     icon: Phone,           group: 'settings' },
  { id: 'payments',      label: 'Payment details',      hint: 'Bank transfer account',        icon: CreditCard,      group: 'settings' },
  { id: 'footer',        label: 'Footer',               hint: 'Footer description text',      icon: AlignLeft,       group: 'settings' },
]

// ─── Shared input class ────────────────────────────────────────────────────────

const inp =
  'w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-blue-950/60 focus:ring-2 focus:ring-blue-950/10 transition-all text-blue-950 bg-white'

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700 block">{label}</label>
      {hint && <p className="text-[11px] text-slate-400 -mt-1">{hint}</p>}
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

// ─── Main component ────────────────────────────────────────────────────────────

export default function SiteSettingsPage() {
  const [form, setForm] = useState<SiteSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState<SectionId | null>('announcement')

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
    toast.success('Saved.')
  }

  const toggle = (id: SectionId) => setOpen((prev) => prev === id ? null : id)

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center h-[60vh] gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-blue-950" />
        <p className="text-sm text-stone-500">Loading…</p>
      </div>
    )
  }

  const pagesSections  = SECTIONS.filter((s) => s.group === 'pages')
  const settingsSections = SECTIONS.filter((s) => s.group === 'settings')

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-10 bg-[#f7f6f3] border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-bold text-blue-950">Site customiser</h1>
          <p className="text-[11px] text-stone-400">Click a section to edit its content</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-stone-200 bg-white rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            Preview
          </a>
          <button type="button" onClick={() => save()} disabled={saving}
            className="inline-flex items-center gap-1.5 bg-blue-950 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-full max-w-[300px] shrink-0 border-r border-stone-200 bg-white overflow-y-auto hidden md:block">
          <form onSubmit={save}>

            {/* Sections group */}
            <div className="px-3 pt-4 pb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-2 mb-1">
                Page sections
              </p>
            </div>
            {pagesSections.map((s) => (
              <SidebarItem key={s.id} section={s} isOpen={open === s.id}
                onToggle={() => toggle(s.id)}>
                <SectionFields id={s.id} form={form} set={set} />
              </SidebarItem>
            ))}

            {/* Theme settings group */}
            <div className="px-3 pt-5 pb-1 border-t border-stone-100 mt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-2 mb-1">
                Theme settings
              </p>
            </div>
            {settingsSections.map((s) => (
              <SidebarItem key={s.id} section={s} isOpen={open === s.id}
                onToggle={() => toggle(s.id)}>
                <SectionFields id={s.id} form={form} set={set} />
              </SidebarItem>
            ))}

            <div className="px-4 py-4 border-t border-stone-100 mt-2">
              <button type="submit" disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-950 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </aside>

        {/* ── Mobile: full-width accordion ── */}
        <div className="md:hidden w-full overflow-y-auto">
          <form onSubmit={save} className="p-4 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-1 mb-3">
              Page sections
            </p>
            {pagesSections.map((s) => (
              <MobileItem key={s.id} section={s} isOpen={open === s.id}
                onToggle={() => toggle(s.id)}>
                <SectionFields id={s.id} form={form} set={set} />
              </MobileItem>
            ))}
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-1 mt-5 mb-3">
              Theme settings
            </p>
            {settingsSections.map((s) => (
              <MobileItem key={s.id} section={s} isOpen={open === s.id}
                onToggle={() => toggle(s.id)}>
                <SectionFields id={s.id} form={form} set={set} />
              </MobileItem>
            ))}
            <button type="submit" disabled={saving}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-blue-950 text-white px-4 py-3 rounded-xl text-xs font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save all changes
            </button>
          </form>
        </div>

        {/* ── Right: context panel (desktop) ── */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-stone-50 p-8">
          {open ? (
            <ContextPanel id={open} form={form} />
          ) : (
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LayoutTemplate className="w-7 h-7 text-stone-300" />
              </div>
              <p className="text-sm font-semibold text-blue-950 mb-2">Select a section to edit</p>
              <p className="text-xs text-stone-400 leading-relaxed">
                Click any section in the left panel to edit its content. Changes publish instantly when you save.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar item (desktop) ────────────────────────────────────────────────────

function SidebarItem({ section, isOpen, onToggle, children }: {
  section: SectionDef
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const Icon = section.icon
  return (
    <div className={`border-l-2 transition-colors ${isOpen ? 'border-sky-600' : 'border-transparent'}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-stone-50 ${
          isOpen ? 'bg-sky-50/60' : ''
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${isOpen ? 'text-sky-600' : 'text-stone-400'}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${isOpen ? 'text-sky-700' : 'text-blue-950'}`}>
            {section.label}
          </p>
          <p className="text-[11px] text-stone-400 truncate">{section.hint}</p>
        </div>
        <ChevronRight className={`w-3.5 h-3.5 text-stone-300 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-4 bg-sky-50/30 border-t border-sky-100/50">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Mobile item ───────────────────────────────────────────────────────────────

function MobileItem({ section, isOpen, onToggle, children }: {
  section: SectionDef
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const Icon = section.icon
  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <Icon className={`w-4 h-4 shrink-0 ${isOpen ? 'text-sky-600' : 'text-stone-400'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-blue-950">{section.label}</p>
          <p className="text-[11px] text-stone-400 truncate">{section.hint}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-stone-100">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Context panel (right side, desktop only) ─────────────────────────────────

function ContextPanel({ id, form }: { id: SectionId; form: SiteSettingsData }) {
  const descriptions: Partial<Record<SectionId, { title: string; description: string; where: string }>> = {
    announcement: { title: 'Announcement bar', description: 'A thin message banner shown at the very top of every page.', where: 'Visible on all pages, above the header' },
    hero:         { title: 'Hero section',    description: 'The full-screen image with headline at the top of the homepage. Used when no active Banners exist.', where: 'Homepage — top of page' },
    story_1:      { title: 'Story block 1',   description: 'Your "who we are" narrative with a featured image.', where: 'Homepage — below the hero' },
    story_2:      { title: 'Story block 2',   description: 'Your "our promise" or quality guarantee statement.', where: 'Homepage — beside story block 1' },
    story_stats:  { title: 'Story stats',     description: 'The two highlighted numbers (e.g. 07 Partner Brands).', where: 'Homepage — below the story text' },
    featured:     { title: 'Featured products', description: 'The heading above the best-sellers product grid.', where: 'Homepage — best-sellers section' },
    collections:  { title: 'Collections',    description: 'The heading above the category tiles grid.', where: 'Homepage — category section' },
    promo:        { title: 'Promo banner',    description: 'A full-bleed image with headline and CTA button.', where: 'Homepage — between collections and featured products' },
    products_page:{ title: 'Products page',  description: 'The title and tagline at the top of the /products page.', where: 'Products catalogue page — top header' },
    general:      { title: 'Store details',  description: 'Your store name, tagline, and logo.', where: 'Header, browser tab, and SEO' },
    colors:       { title: 'Brand colours',  description: 'Primary, accent, and background colours used throughout the store.', where: 'Applied site-wide to buttons, headers, and sections' },
    fonts:        { title: 'Typography',     description: 'Heading font (product names, titles) and body font (paragraphs and menus).', where: 'Applied site-wide' },
    contact:      { title: 'Contact info',   description: 'Store address, email, WhatsApp, and phone number.', where: 'Footer, contact page, and checkout' },
    socials:      { title: 'Social media',   description: 'Links to your social media profiles.', where: 'Footer and contact page' },
    payments:     { title: 'Payment details', description: 'Bank transfer account details shown to customers at checkout.', where: 'Checkout success page and checkout form' },
    footer:       { title: 'Footer',         description: 'Short description text beneath your logo in the footer.', where: 'Site footer — all pages' },
  }

  const info = descriptions[id]
  if (!info) return null

  return (
    <div className="max-w-sm w-full space-y-6">
      {/* What this controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">You are editing</p>
        <h2 className="text-lg font-bold text-blue-950">{info.title}</h2>
        <p className="text-sm text-stone-500 leading-relaxed">{info.description}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Shown on:</span>
          <span className="text-xs font-semibold text-blue-950 bg-stone-100 px-2.5 py-1 rounded-lg">{info.where}</span>
        </div>
      </div>

      {/* Live preview snippet for colors */}
      {id === 'colors' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Colour preview</p>
          <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: form.backgroundColor }}>
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 text-white rounded-full"
              style={{ backgroundColor: form.accentColor }}>
              In Stock · Abuja
            </span>
            <p className="font-bold text-lg" style={{ color: form.primaryColor, fontFamily: form.headingFont }}>
              Mouka Monalisa Mattress
            </p>
            <div className="flex items-center gap-2">
              <span className="font-black" style={{ color: form.primaryColor }}>₦185,000</span>
              <button type="button" className="px-3 py-1.5 text-white text-xs font-bold rounded"
                style={{ backgroundColor: form.primaryColor }}>
                Add to bag
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-stone-400 text-center">
        Edit the fields in the left panel, then click <strong>Save</strong>.
      </p>
    </div>
  )
}

// ─── Section fields ────────────────────────────────────────────────────────────

function SectionFields({
  id, form, set,
}: {
  id: SectionId
  form: SiteSettingsData
  set: <K extends keyof SiteSettingsData>(k: K, v: SiteSettingsData[K]) => void
}) {
  const inp2 = `${inp} text-xs py-2`

  switch (id) {

    // ── Announcement bar ────────────────────────────────────────────────────
    case 'announcement':
      return (
        <>
          <div className="flex items-center justify-between py-1">
            <span className="text-xs font-semibold text-blue-950">Show bar</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.announcementEnabled}
                onChange={(e) => set('announcementEnabled', e.target.checked)}
                className="sr-only peer" />
              <div className="w-9 h-5 bg-stone-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-950" />
            </label>
          </div>
          <F label="Message">
            <input value={form.announcementText || ''} onChange={(e) => set('announcementText', e.target.value)}
              className={inp2} placeholder="Free delivery on orders above ₦150,000" />
          </F>
          <F label="Link" hint="Where to send clicks (optional)">
            <input value={form.announcementLink || ''} onChange={(e) => set('announcementLink', e.target.value || null)}
              className={inp2} placeholder="/products" />
          </F>
        </>
      )

    // ── Hero ────────────────────────────────────────────────────────────────
    case 'hero':
      return (
        <>
          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
            Active Banners override these fields. Go to <strong>Banners</strong> to add image slides.
          </div>
          <F label="Headline">
            <input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)}
              className={inp2} placeholder="Sleep Like It Matters" />
          </F>
          <F label="Subtext">
            <input value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)}
              className={inp2} placeholder="Original mattresses from Nigeria's most trusted brands." />
          </F>
          <F label="Button label">
            <input value={form.heroCtaLabel} onChange={(e) => set('heroCtaLabel', e.target.value)}
              className={inp2} placeholder="Shop the Collection" />
          </F>
          <F label="Button link">
            <input value={form.heroCtaHref} onChange={(e) => set('heroCtaHref', e.target.value)}
              className={inp2} placeholder="/products" />
          </F>
        </>
      )

    // ── Story block 1 ────────────────────────────────────────────────────────
    case 'story_1':
      return (
        <>
          <F label="Badge">
            <input value={form.storyBadge} onChange={(e) => set('storyBadge', e.target.value)}
              className={inp2} placeholder="Our Story" />
          </F>
          <F label="Headline">
            <input value={form.storyTitle} onChange={(e) => set('storyTitle', e.target.value)}
              className={inp2} placeholder="The Real Thing, Delivered to Your Door." />
          </F>
          <F label="Paragraph">
            <textarea rows={4} value={form.storyText} onChange={(e) => set('storyText', e.target.value)}
              className={`${inp2} resize-none`} placeholder="Tell your brand story…" />
          </F>
          <F label="Image">
            <CloudinaryUpload
              value={form.storyImageUrl ? [form.storyImageUrl] : []}
              onChange={(urls) => set('storyImageUrl', urls[urls.length - 1] || null)}
              maxFiles={1} label="Upload image" />
            <input type="url" value={form.storyImageUrl || ''}
              onChange={(e) => set('storyImageUrl', e.target.value || null)}
              className={`${inp2} mt-1.5`} placeholder="Or paste image URL" />
          </F>
        </>
      )

    // ── Story block 2 ────────────────────────────────────────────────────────
    case 'story_2':
      return (
        <>
          <F label="Badge">
            <input value={form.storySecondaryBadge} onChange={(e) => set('storySecondaryBadge', e.target.value)}
              className={inp2} placeholder="Our Promise" />
          </F>
          <F label="Headline">
            <input value={form.storySecondaryTitle} onChange={(e) => set('storySecondaryTitle', e.target.value)}
              className={inp2} placeholder="Factory-Direct. Sealed. Guaranteed." />
          </F>
          <F label="Paragraph">
            <textarea rows={4} value={form.storySecondaryText} onChange={(e) => set('storySecondaryText', e.target.value)}
              className={`${inp2} resize-none`} placeholder="Describe your quality guarantee…" />
          </F>
        </>
      )

    // ── Story stats ──────────────────────────────────────────────────────────
    case 'story_stats':
      return (
        <>
          <F label="Stat 1 — number">
            <input value={form.statOneValue} onChange={(e) => set('statOneValue', e.target.value)}
              className={inp2} placeholder="07" />
          </F>
          <F label="Stat 1 — label">
            <input value={form.statOneBadge} onChange={(e) => set('statOneBadge', e.target.value)}
              className={inp2} placeholder="Partner Brands" />
          </F>
          <F label="Stat 2 — number">
            <input value={form.statTwoValue} onChange={(e) => set('statTwoValue', e.target.value)}
              className={inp2} placeholder="100%" />
          </F>
          <F label="Stat 2 — label">
            <input value={form.statTwoBadge} onChange={(e) => set('statTwoBadge', e.target.value)}
              className={inp2} placeholder="Original Stock" />
          </F>
          <F label="Link label">
            <input value={form.storyLinkLabel} onChange={(e) => set('storyLinkLabel', e.target.value)}
              className={inp2} placeholder="Our full story →" />
          </F>
        </>
      )

    // ── Featured products ────────────────────────────────────────────────────
    case 'featured':
      return (
        <>
          <F label="Heading">
            <input value={form.featuredTitle} onChange={(e) => set('featuredTitle', e.target.value)}
              className={inp2} placeholder="What people keep coming back for." />
          </F>
          <F label="Description">
            <input value={form.featuredDescription} onChange={(e) => set('featuredDescription', e.target.value)}
              className={inp2} placeholder="Our most-loved pieces — or browse everything we carry." />
          </F>
        </>
      )

    // ── Collections ──────────────────────────────────────────────────────────
    case 'collections':
      return (
        <>
          <F label="Heading">
            <input value={form.collectionsTitle} onChange={(e) => set('collectionsTitle', e.target.value)}
              className={inp2} placeholder="Shop by category" />
          </F>
          <F label="Description">
            <input value={form.collectionsDescription} onChange={(e) => set('collectionsDescription', e.target.value)}
              className={inp2} placeholder="Mattresses, pillows, furniture…" />
          </F>
        </>
      )

    // ── Promo banner ─────────────────────────────────────────────────────────
    case 'promo':
      return (
        <>
          <F label="Badge">
            <input value={form.promoBadge} onChange={(e) => set('promoBadge', e.target.value)}
              className={inp2} placeholder="Crafted for Nigerian homes" />
          </F>
          <F label="Headline">
            <input value={form.promoTitle} onChange={(e) => set('promoTitle', e.target.value)}
              className={inp2} placeholder="Spaces worth living in." />
          </F>
          <F label="Button label">
            <input value={form.promoCtaLabel} onChange={(e) => set('promoCtaLabel', e.target.value)}
              className={inp2} placeholder="Shop the collection" />
          </F>
          <F label="Button link">
            <input value={form.promoCtaHref} onChange={(e) => set('promoCtaHref', e.target.value)}
              className={inp2} placeholder="/products" />
          </F>
          <F label="Background image">
            <CloudinaryUpload
              value={form.promoImageUrl ? [form.promoImageUrl] : []}
              onChange={(urls) => set('promoImageUrl', urls[urls.length - 1] || null)}
              maxFiles={1} label="Upload image" />
            <input type="url" value={form.promoImageUrl || ''}
              onChange={(e) => set('promoImageUrl', e.target.value || null)}
              className={`${inp2} mt-1.5`} placeholder="Or paste image URL" />
          </F>
        </>
      )

    // ── Products page ────────────────────────────────────────────────────────
    case 'products_page':
      return (
        <>
          <F label="Page title">
            <input value={form.shopPageTitle} onChange={(e) => set('shopPageTitle', e.target.value)}
              className={inp2} placeholder="The Collection" />
          </F>
          <F label="Tagline">
            <input value={form.shopPageTagline} onChange={(e) => set('shopPageTagline', e.target.value)}
              className={inp2} placeholder="Original mattresses, luxury furniture and bedding." />
          </F>
        </>
      )

    // ── General ──────────────────────────────────────────────────────────────
    case 'general':
      return (
        <>
          <F label="Store name">
            <input required value={form.siteName} onChange={(e) => set('siteName', e.target.value)}
              className={inp2} placeholder="Smart Best Brands" />
          </F>
          <F label="Tagline" hint="Shown as the hero eyebrow and in SEO.">
            <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)}
              className={inp2} placeholder="Quality mattresses, pillows & furniture" />
          </F>
          <F label="Logo image" hint="Leave blank to use the store name as text.">
            <CloudinaryUpload
              value={form.logoUrl ? [form.logoUrl] : []}
              onChange={(urls) => set('logoUrl', urls[urls.length - 1] || null)}
              maxFiles={1} label="Upload logo" />
            <input type="url" value={form.logoUrl || ''}
              onChange={(e) => set('logoUrl', e.target.value || null)}
              className={`${inp2} mt-1.5`} placeholder="Or paste logo URL" />
          </F>
          {/* Logo preview */}
          <div className="p-4 bg-blue-950 rounded-xl flex items-center justify-center">
            {form.logoUrl
              ? <img src={form.logoUrl} alt="" className="h-8 object-contain max-w-full" />
              : <span className="text-white font-black text-sm tracking-widest">{form.siteName.toUpperCase()}</span>
            }
          </div>
        </>
      )

    // ── Colors ───────────────────────────────────────────────────────────────
    case 'colors':
      return (
        <>
          {/* Presets */}
          <div className="grid grid-cols-2 gap-2">
            {COLOR_PRESETS.map((p) => (
              <button key={p.name} type="button"
                onClick={() => { set('primaryColor', p.primary); set('accentColor', p.accent); set('backgroundColor', p.bg) }}
                className="p-2.5 border border-stone-200 rounded-xl bg-stone-50 hover:border-sky-400 text-left transition-all">
                <div className="flex gap-1 mb-1">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent }} />
                  <span className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: p.bg }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-600">{p.name}</span>
              </button>
            ))}
          </div>
          {/* Custom pickers */}
          {[
            { label: 'Primary', hint: 'Buttons & header', key: 'primaryColor' as const },
            { label: 'Accent',  hint: 'Links & badges',   key: 'accentColor' as const },
            { label: 'Background', hint: 'Page BG',       key: 'backgroundColor' as const },
          ].map(({ label, hint, key }) => (
            <F key={key} label={label} hint={hint}>
              <div className="flex items-center gap-2">
                <input type="color"
                  value={/^#([0-9A-Fa-f]{6})$/.test(form[key]) ? form[key] : '#172554'}
                  onChange={(e) => set(key, e.target.value)}
                  className="h-9 w-10 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0" />
                <input value={form[key]} onChange={(e) => set(key, e.target.value)}
                  className={`${inp2} flex-1`} placeholder="#172554" />
              </div>
            </F>
          ))}
        </>
      )

    // ── Fonts ────────────────────────────────────────────────────────────────
    case 'fonts':
      return (
        <>
          <F label="Heading font" hint={`Current: ${form.headingFont}`}>
            <div className="space-y-1.5">
              {HEADING_FONTS.map((f) => {
                const active = form.headingFont === f.name
                return (
                  <button key={f.name} type="button" onClick={() => set('headingFont', f.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-left transition-all text-xs ${
                      active ? 'border-blue-950 bg-blue-950 text-white' : 'border-stone-200 bg-white hover:border-stone-300 text-blue-950'
                    }`}>
                    <span className="font-semibold" style={{ fontFamily: f.name }}>{f.label}</span>
                    {active && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </F>
          <F label="Body font" hint={`Current: ${form.bodyFont}`}>
            <div className="space-y-1.5">
              {BODY_FONTS.map((f) => {
                const active = form.bodyFont === f.name
                return (
                  <button key={f.name} type="button" onClick={() => set('bodyFont', f.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-left transition-all text-xs ${
                      active ? 'border-blue-950 bg-blue-950 text-white' : 'border-stone-200 bg-white hover:border-stone-300 text-blue-950'
                    }`}>
                    <span className="font-semibold" style={{ fontFamily: f.name }}>{f.label}</span>
                    {active && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </F>
        </>
      )

    // ── Contact ──────────────────────────────────────────────────────────────
    case 'contact':
      return (
        <>
          <F label="Store address">
            <input value={form.storeAddress} onChange={(e) => set('storeAddress', e.target.value)}
              className={inp2} placeholder="Abuja · Benin City" />
          </F>
          <F label="Email">
            <input type="email" required value={form.contactEmail}
              onChange={(e) => set('contactEmail', e.target.value)}
              className={inp2} placeholder="hello@smartbestbrands.com" />
          </F>
          <F label="WhatsApp" hint="Digits only, with country code">
            <input value={form.whatsappNumber || ''} onChange={(e) => set('whatsappNumber', e.target.value || null)}
              className={inp2} placeholder="2348012345678" />
          </F>
          <F label="Support phone">
            <input value={form.supportPhone || ''} onChange={(e) => set('supportPhone', e.target.value || null)}
              className={inp2} placeholder="+234 800 000 0000" />
          </F>
        </>
      )

    // ── Socials ──────────────────────────────────────────────────────────────
    case 'socials':
      return (
        <>
          {([
            ['Instagram', 'instagramUrl', 'https://instagram.com/…'],
            ['Facebook',  'facebookUrl',  'https://facebook.com/…'],
            ['Twitter / X', 'twitterUrl', 'https://x.com/…'],
            ['TikTok',    'tiktokUrl',    'https://tiktok.com/…'],
          ] as [string, keyof SiteSettingsData, string][]).map(([label, key, ph]) => (
            <F key={key} label={label}>
              <input type="url" value={(form[key] as string) || ''}
                onChange={(e) => set(key, e.target.value || null)}
                className={inp2} placeholder={ph} />
            </F>
          ))}
        </>
      )

    // ── Payments ─────────────────────────────────────────────────────────────
    case 'payments':
      return (
        <>
          <F label="Bank name">
            <input value={form.bankName || ''} onChange={(e) => set('bankName', e.target.value || null)}
              className={inp2} placeholder="Moniepoint MFB / Zenith Bank" />
          </F>
          <F label="Account name">
            <input value={form.bankAccountName || ''} onChange={(e) => set('bankAccountName', e.target.value || null)}
              className={inp2} placeholder="Smart Best Brands Nigeria" />
          </F>
          <F label="Account number">
            <input value={form.bankAccountNumber || ''} onChange={(e) => set('bankAccountNumber', e.target.value || null)}
              className={inp2} placeholder="0123456789" inputMode="numeric" />
          </F>
        </>
      )

    // ── Footer ───────────────────────────────────────────────────────────────
    case 'footer':
      return (
        <F label="Footer description text">
          <textarea rows={3} value={form.footerText} onChange={(e) => set('footerText', e.target.value)}
            className={`${inp2} resize-none`}
            placeholder="Original mattresses, luxury furniture, and bedding — factory-direct, delivered to your door." />
        </F>
      )

    default:
      return null
  }
}
