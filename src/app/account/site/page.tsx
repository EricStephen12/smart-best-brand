'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSiteSettings, updateSiteSettings, resetSiteSettings } from '@/actions/site-settings'
import {
  HEADING_FONTS,
  BODY_FONTS,
  DEFAULT_SITE_SETTINGS,
  type SiteSettingsData,
} from '@/lib/site-settings'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import toast from 'react-hot-toast'
import {
  Loader2,
  Save,
  CheckCircle2,
  Palette,
  Home,
  ShoppingBag,
  Phone,
  CreditCard,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Info,
  Type,
  Megaphone,
  Layers,
} from 'lucide-react'

// Tab definitions
type TabId = 'brand' | 'home' | 'shop' | 'contact' | 'bank'

interface TabDef {
  id: TabId
  label: string
  icon: React.ElementType
  description: string
}

const TABS: TabDef[] = [
  { id: 'brand', label: 'Brand & Theme', icon: Palette, description: 'Store identity, brand colors, and typography' },
  { id: 'home', label: 'Homepage Writeups', icon: Home, description: 'Hero banner, story, stats, and promo banner copy' },
  { id: 'shop', label: 'Shop & Collections', icon: ShoppingBag, description: 'Catalog headers, featured products, and categories' },
  { id: 'contact', label: 'Contact & Socials', icon: Phone, description: 'Phone, WhatsApp, address, and social links' },
  { id: 'bank', label: 'Bank & Footer', icon: CreditCard, description: 'Bank transfer account details and footer copy' },
]

const COLOR_PRESETS = [
  { name: 'Navy & Sky (Default)', primary: '#172554', accent: '#0284c7', bg: '#f7f6f3' },
  { name: 'Midnight & Gold', primary: '#0f172a', accent: '#d97706', bg: '#fafaf9' },
  { name: 'Emerald Luxe', primary: '#064e3b', accent: '#10b981', bg: '#f4fbf7' },
  { name: 'Monochrome Noir', primary: '#18181b', accent: '#475569', bg: '#ffffff' },
  { name: 'Warm Terracotta', primary: '#431407', accent: '#c2410c', bg: '#fdfbf7' },
]

export default function SiteSettingsPage() {
  const [form, setForm] = useState<SiteSettingsData | null>(null)
  const [initialForm, setInitialForm] = useState<SiteSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('brand')

  useEffect(() => {
    void getSiteSettings().then((d) => {
      setForm(d)
      setInitialForm(d)
      setLoading(false)
    })
  }, [])

  const set = <K extends keyof SiteSettingsData>(k: K, v: SiteSettingsData[K]) =>
    setForm((p) => (p ? { ...p, [k]: v } : p))

  const isDirty = form && initialForm ? JSON.stringify(form) !== JSON.stringify(initialForm) : false

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const res = await updateSiteSettings(form)
      if (!res.success) {
        toast.error(res.error || 'Failed to save settings')
        return
      }
      if (res.data) {
        setForm(res.data)
        setInitialForm(res.data)
      }
      toast.success('Settings updated successfully!')
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset all site settings to factory defaults? Any custom text and colors will be replaced.')) {
      return
    }
    setResetting(true)
    try {
      const res = await resetSiteSettings()
      if (!res.success) {
        toast.error(res.error || 'Failed to reset settings')
        return
      }
      if (res.data) {
        setForm(res.data)
        setInitialForm(res.data)
      }
      toast.success('Site settings reset to defaults!')
    } catch {
      toast.error('Failed to reset')
    } finally {
      setResetting(false)
    }
  }

  if (loading || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-950" />
        <p className="text-sm font-medium text-stone-500">Loading site settings…</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* ── Page Header & Save Bar ── */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-950 tracking-tight">Site Settings</h1>
            {isDirty && (
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                Unsaved changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Easily customize your store's text, brand colors, contact channels, and payment details without code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-colors disabled:opacity-50"
            title="Reset to original defaults"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-950 hover:bg-blue-900 active:scale-[0.98] rounded-xl shadow-sm transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving…' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* ── Tab Selector ── */}
      <div className="bg-stone-100/80 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-stone-200/60">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] sm:min-w-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-blue-950 shadow-sm border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Form Body ── */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* ═════════ TAB 1: Brand & Theme ═════════ */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            {/* Identity Card */}
            <Card title="Store Identity" subtitle="Set your official store name, tagline, and logo">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Store Name" hint="Shown in the header, footer, page titles, and invoice emails">
                  <input
                    type="text"
                    required
                    value={form.siteName}
                    onChange={(e) => set('siteName', e.target.value)}
                    placeholder="Smart Best Brands"
                    className={inputClass}
                  />
                </Field>

                <Field label="Store Tagline" hint="Short brand motto used in headers and meta descriptions">
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => set('tagline', e.target.value)}
                    placeholder="Quality mattresses, pillows & furniture"
                    className={inputClass}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Store Logo" hint="Upload a transparent PNG/SVG or paste an image URL. If left empty, the store name text is used.">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex-1 w-full space-y-2">
                        <CloudinaryUpload
                          value={form.logoUrl ? [form.logoUrl] : []}
                          onChange={(urls) => set('logoUrl', urls[urls.length - 1] || null)}
                          maxFiles={1}
                          label="Upload store logo"
                        />
                        <input
                          type="url"
                          value={form.logoUrl || ''}
                          onChange={(e) => set('logoUrl', e.target.value || null)}
                          placeholder="Or paste direct image URL (e.g. https://...)"
                          className={inputClass}
                        />
                      </div>

                      {/* Live Logo Preview Box */}
                      <div className="h-20 w-44 shrink-0 bg-blue-950 rounded-xl p-3 flex flex-col items-center justify-center border border-blue-900/50 shadow-inner">
                        <span className="text-[9px] font-mono text-blue-300 uppercase tracking-wider mb-1">Header Preview</span>
                        {form.logoUrl ? (
                          <img src={form.logoUrl} alt="Logo preview" className="max-h-9 max-w-full object-contain" />
                        ) : (
                          <span className="text-white font-extrabold text-xs tracking-wider truncate max-w-full px-2">
                            {form.siteName ? form.siteName.toUpperCase() : 'YOUR STORE'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
            </Card>

            {/* Colors Card */}
            <Card title="Brand Colors" subtitle="Choose colors for buttons, highlights, and backgrounds">
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-2">Color Presets</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {COLOR_PRESETS.map((preset) => {
                      const isCurrent =
                        form.primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
                        form.accentColor.toLowerCase() === preset.accent.toLowerCase()
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            set('primaryColor', preset.primary)
                            set('accentColor', preset.accent)
                            set('backgroundColor', preset.bg)
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isCurrent
                              ? 'border-blue-950 bg-blue-50/40 ring-2 ring-blue-950/10'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: preset.primary }} />
                            <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: preset.accent }} />
                            <span className="w-4 h-4 rounded-full shadow-sm border border-stone-200" style={{ backgroundColor: preset.bg }} />
                          </div>
                          <span className="text-[11px] font-medium text-stone-700 block truncate">{preset.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Field label="Primary Color" hint="Header, main buttons, bold headings">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={isValidHex(form.primaryColor) ? form.primaryColor : '#172554'}
                        onChange={(e) => set('primaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0 bg-white"
                      />
                      <input
                        type="text"
                        value={form.primaryColor}
                        onChange={(e) => set('primaryColor', e.target.value)}
                        placeholder="#172554"
                        className={inputClass}
                      />
                    </div>
                  </Field>

                  <Field label="Accent Color" hint="Badges, active links, highlighted text">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={isValidHex(form.accentColor) ? form.accentColor : '#0284c7'}
                        onChange={(e) => set('accentColor', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0 bg-white"
                      />
                      <input
                        type="text"
                        value={form.accentColor}
                        onChange={(e) => set('accentColor', e.target.value)}
                        placeholder="#0284c7"
                        className={inputClass}
                      />
                    </div>
                  </Field>

                  <Field label="Page Background" hint="Subtle background for pages & cards">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={isValidHex(form.backgroundColor) ? form.backgroundColor : '#f7f6f3'}
                        onChange={(e) => set('backgroundColor', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0 bg-white"
                      />
                      <input
                        type="text"
                        value={form.backgroundColor}
                        onChange={(e) => set('backgroundColor', e.target.value)}
                        placeholder="#f7f6f3"
                        className={inputClass}
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </Card>

            {/* Typography Card */}
            <Card title="Typography" subtitle="Select font pairing for headings and body text">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-2">Heading Font (Playfair / Display)</label>
                  <div className="space-y-2">
                    {HEADING_FONTS.map((font) => {
                      const isSelected = form.headingFont === font.name
                      return (
                        <button
                          key={font.name}
                          type="button"
                          onClick={() => set('headingFont', font.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-blue-950 bg-blue-950 text-white shadow-sm'
                              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-semibold block" style={{ fontFamily: font.name }}>
                              {font.label}
                            </span>
                            <span className={`text-[10px] block ${isSelected ? 'text-blue-200' : 'text-stone-400'}`}>
                              The quick brown fox jumps over the lazy dog
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-2">Body Font (Clean / Readable)</label>
                  <div className="space-y-2">
                    {BODY_FONTS.map((font) => {
                      const isSelected = form.bodyFont === font.name
                      return (
                        <button
                          key={font.name}
                          type="button"
                          onClick={() => set('bodyFont', font.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-blue-950 bg-blue-950 text-white shadow-sm'
                              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-medium block" style={{ fontFamily: font.name }}>
                              {font.label}
                            </span>
                            <span className={`text-[10px] block ${isSelected ? 'text-blue-200' : 'text-stone-400'}`}>
                              Authentic mattresses and furniture directly to your home
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═════════ TAB 2: Homepage Writeups ═════════ */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Announcement Bar */}
            <Card title="Top Announcement Bar" subtitle="Show a ribbon message at the very top of every page">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <div className="flex items-center gap-2.5">
                    <Megaphone className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-xs font-semibold text-blue-950 block">Enable Announcement Bar</span>
                      <span className="text-[11px] text-stone-400">Toggle whether this ribbon displays above the main header</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.announcementEnabled}
                      onChange={(e) => set('announcementEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-950" />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Announcement Text" hint="e.g. Free delivery on orders over ₦150,000 in Abuja & Benin City">
                    <input
                      type="text"
                      value={form.announcementText || ''}
                      onChange={(e) => set('announcementText', e.target.value)}
                      placeholder="Free delivery on orders above ₦150,000"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Target Link (Optional)" hint="e.g. /products or /delivery">
                    <input
                      type="text"
                      value={form.announcementLink || ''}
                      onChange={(e) => set('announcementLink', e.target.value || null)}
                      placeholder="/products"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Hero Section Writeup */}
            <Card title="Hero Section" subtitle="Main banner text on the homepage">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Hero Headline" hint="The bold, large text visitors see first">
                    <input
                      type="text"
                      value={form.heroTitle}
                      onChange={(e) => set('heroTitle', e.target.value)}
                      placeholder="Sleep Like It Matters"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Hero Subtitle / Description" hint="Supporting paragraph below the headline">
                    <input
                      type="text"
                      value={form.heroSubtitle}
                      onChange={(e) => set('heroSubtitle', e.target.value)}
                      placeholder="Original mattresses from Nigeria's most trusted brands."
                      className={inputClass}
                    />
                  </Field>

                  <Field label="CTA Button Label" hint="The primary call-to-action button text">
                    <input
                      type="text"
                      value={form.heroCtaLabel}
                      onChange={(e) => set('heroCtaLabel', e.target.value)}
                      placeholder="Shop the Collection"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="CTA Button Link" hint="Where the button navigates to">
                    <input
                      type="text"
                      value={form.heroCtaHref}
                      onChange={(e) => set('heroCtaHref', e.target.value)}
                      placeholder="/products"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Story / About Section */}
            <Card title="Our Story & Brand Promise" subtitle="The two editorial story cards on the homepage">
              <div className="space-y-6">
                {/* Block 1 */}
                <div className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-xl space-y-4">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
                    Story Block 1: Who We Are
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Section Badge" hint="Small uppercase tag above title">
                      <input
                        type="text"
                        value={form.storyBadge}
                        onChange={(e) => set('storyBadge', e.target.value)}
                        placeholder="Who We Are"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Headline" hint="Main heading for this block">
                      <input
                        type="text"
                        value={form.storyTitle}
                        onChange={(e) => set('storyTitle', e.target.value)}
                        placeholder="Original Mattresses, Directly to Your Home."
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <Field label="Story Paragraph" hint="Main body text explaining your mission">
                    <textarea
                      rows={4}
                      value={form.storyText}
                      onChange={(e) => set('storyText', e.target.value)}
                      placeholder="We started Smart Best Brands to make buying genuine mattresses simple in Nigeria..."
                      className={textareaClass}
                    />
                  </Field>
                  <Field label="Story Image" hint="Featured lifestyle / warehouse image">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <div className="flex-1 w-full">
                        <CloudinaryUpload
                          value={form.storyImageUrl ? [form.storyImageUrl] : []}
                          onChange={(urls) => set('storyImageUrl', urls[urls.length - 1] || null)}
                          maxFiles={1}
                          label="Upload story image"
                        />
                        <input
                          type="url"
                          value={form.storyImageUrl || ''}
                          onChange={(e) => set('storyImageUrl', e.target.value || null)}
                          placeholder="Or paste image URL"
                          className={`${inputClass} mt-1`}
                        />
                      </div>
                      {form.storyImageUrl && (
                        <img
                          src={form.storyImageUrl}
                          alt="Story preview"
                          className="w-24 h-20 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                      )}
                    </div>
                  </Field>
                </div>

                {/* Block 2 */}
                <div className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-xl space-y-4">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
                    Story Block 2: Our Promise & Guarantee
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Section Badge" hint="Small uppercase tag above title">
                      <input
                        type="text"
                        value={form.storySecondaryBadge}
                        onChange={(e) => set('storySecondaryBadge', e.target.value)}
                        placeholder="Our Promise"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Headline" hint="Main promise heading">
                      <input
                        type="text"
                        value={form.storySecondaryTitle}
                        onChange={(e) => set('storySecondaryTitle', e.target.value)}
                        placeholder="100% Authentic, Direct From the Factory."
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <Field label="Promise Paragraph" hint="Details on warranty, factory seal, and authenticity">
                    <textarea
                      rows={3}
                      value={form.storySecondaryText}
                      onChange={(e) => set('storySecondaryText', e.target.value)}
                      placeholder="We source directly from authorized factory distributors..."
                      className={textareaClass}
                    />
                  </Field>
                </div>

                {/* Stats & Link */}
                <div className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-xl space-y-4">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
                    Highlights & Numbers
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Field label="Stat 1: Number" hint="e.g. 07 or 15+">
                        <input
                          type="text"
                          value={form.statOneValue}
                          onChange={(e) => set('statOneValue', e.target.value)}
                          placeholder="07"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Stat 1: Label" hint="e.g. Partner Brands">
                        <input
                          type="text"
                          value={form.statOneBadge}
                          onChange={(e) => set('statOneBadge', e.target.value)}
                          placeholder="Partner Brands"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="space-y-2">
                      <Field label="Stat 2: Number" hint="e.g. 100%">
                        <input
                          type="text"
                          value={form.statTwoValue}
                          onChange={(e) => set('statTwoValue', e.target.value)}
                          placeholder="100%"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Stat 2: Label" hint="e.g. Original Stock">
                        <input
                          type="text"
                          value={form.statTwoBadge}
                          onChange={(e) => set('statTwoBadge', e.target.value)}
                          placeholder="Original Stock"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2 md:col-span-1">
                      <Field label="Story Link Label" hint="Call to action link at bottom of story">
                        <input
                          type="text"
                          value={form.storyLinkLabel}
                          onChange={(e) => set('storyLinkLabel', e.target.value)}
                          placeholder="Our full story →"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Promo Banner */}
            <Card title="Mid-Page Promo Banner" subtitle="Full-width callout banner between product sections">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Badge / Subtitle" hint="Small tagline above banner headline">
                    <input
                      type="text"
                      value={form.promoBadge}
                      onChange={(e) => set('promoBadge', e.target.value)}
                      placeholder="Crafted for Nigerian homes"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Headline" hint="Main callout headline">
                    <input
                      type="text"
                      value={form.promoTitle}
                      onChange={(e) => set('promoTitle', e.target.value)}
                      placeholder="Spaces worth living in."
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Button Label">
                    <input
                      type="text"
                      value={form.promoCtaLabel}
                      onChange={(e) => set('promoCtaLabel', e.target.value)}
                      placeholder="Shop the collection"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Button Link">
                    <input
                      type="text"
                      value={form.promoCtaHref}
                      onChange={(e) => set('promoCtaHref', e.target.value)}
                      placeholder="/products"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Background Image" hint="High resolution photo for the promotional banner">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="flex-1 w-full">
                      <CloudinaryUpload
                        value={form.promoImageUrl ? [form.promoImageUrl] : []}
                        onChange={(urls) => set('promoImageUrl', urls[urls.length - 1] || null)}
                        maxFiles={1}
                        label="Upload promo banner"
                      />
                      <input
                        type="url"
                        value={form.promoImageUrl || ''}
                        onChange={(e) => set('promoImageUrl', e.target.value || null)}
                        placeholder="Or paste banner image URL"
                        className={`${inputClass} mt-1`}
                      />
                    </div>
                    {form.promoImageUrl && (
                      <img
                        src={form.promoImageUrl}
                        alt="Promo preview"
                        className="w-28 h-20 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                    )}
                  </div>
                </Field>
              </div>
            </Card>
          </div>
        )}

        {/* ═════════ TAB 3: Shop & Collections ═════════ */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            {/* Products Page Header */}
            <Card title="Products Catalog Header (/products)" subtitle="Header text displayed at the top of the shop collection page">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Shop Page Title" hint="Main title (e.g. The Collection or All Mattresses & Bedding)">
                  <input
                    type="text"
                    value={form.shopPageTitle}
                    onChange={(e) => set('shopPageTitle', e.target.value)}
                    placeholder="The Collection"
                    className={inputClass}
                  />
                </Field>

                <Field label="Shop Page Tagline" hint="Descriptive subtitle explaining the quality and authenticity">
                  <input
                    type="text"
                    value={form.shopPageTagline}
                    onChange={(e) => set('shopPageTagline', e.target.value)}
                    placeholder="Original mattresses, luxury furniture, and bedding — every piece factory-sealed and warranted."
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            {/* Featured Section on Homepage */}
            <Card title="Featured Products Section" subtitle="Heading on the homepage best-sellers grid">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Section Title" hint="e.g. What people keep coming back for.">
                  <input
                    type="text"
                    value={form.featuredTitle}
                    onChange={(e) => set('featuredTitle', e.target.value)}
                    placeholder="What people keep coming back for."
                    className={inputClass}
                  />
                </Field>

                <Field label="Section Subtitle" hint="e.g. Our most-loved pieces — or browse everything we carry.">
                  <input
                    type="text"
                    value={form.featuredDescription}
                    onChange={(e) => set('featuredDescription', e.target.value)}
                    placeholder="Our most-loved pieces — or browse everything we carry."
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            {/* Collections / Categories Section */}
            <Card title="Categories Grid Section" subtitle="Heading on the homepage category browse section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Section Title" hint="e.g. Shop by category">
                  <input
                    type="text"
                    value={form.collectionsTitle}
                    onChange={(e) => set('collectionsTitle', e.target.value)}
                    placeholder="Shop by category"
                    className={inputClass}
                  />
                </Field>

                <Field label="Section Subtitle" hint="e.g. Mattresses, pillows, furniture — find exactly what your space is missing.">
                  <input
                    type="text"
                    value={form.collectionsDescription}
                    onChange={(e) => set('collectionsDescription', e.target.value)}
                    placeholder="Mattresses, pillows, furniture — find exactly what your space is missing."
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>
          </div>
        )}

        {/* ═════════ TAB 4: Contact & Socials ═════════ */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            {/* Direct Contact Info */}
            <Card title="Direct Contact Channels" subtitle="Addresses, email, phone numbers, and WhatsApp">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Store Address / Hubs" hint="Locations displayed in footer and contact page">
                  <input
                    type="text"
                    value={form.storeAddress}
                    onChange={(e) => set('storeAddress', e.target.value)}
                    placeholder="Abuja · Benin City"
                    className={inputClass}
                  />
                </Field>

                <Field label="Customer Support Email" hint="Inquiries and notifications">
                  <input
                    type="email"
                    required
                    value={form.contactEmail}
                    onChange={(e) => set('contactEmail', e.target.value)}
                    placeholder="hello@smartbestbrands.com"
                    className={inputClass}
                  />
                </Field>

                <Field label="WhatsApp Number" hint="Direct click-to-chat. Can enter 080... or 23480...">
                  <input
                    type="text"
                    value={form.whatsappNumber || ''}
                    onChange={(e) => set('whatsappNumber', e.target.value || null)}
                    placeholder="08012345678 or 2348012345678"
                    className={inputClass}
                  />
                </Field>

                <Field label="Support Phone Call" hint="Direct telephone number for voice calls">
                  <input
                    type="text"
                    value={form.supportPhone || ''}
                    onChange={(e) => set('supportPhone', e.target.value || null)}
                    placeholder="+234 800 000 0000"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            {/* Social Media Links */}
            <Card title="Social Media Profiles" subtitle="Links to your social accounts shown in header and footer">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Instagram Profile URL">
                  <input
                    type="url"
                    value={form.instagramUrl || ''}
                    onChange={(e) => set('instagramUrl', e.target.value || null)}
                    placeholder="https://instagram.com/smartbestbrands"
                    className={inputClass}
                  />
                </Field>

                <Field label="Facebook Page URL">
                  <input
                    type="url"
                    value={form.facebookUrl || ''}
                    onChange={(e) => set('facebookUrl', e.target.value || null)}
                    placeholder="https://facebook.com/smartbestbrands"
                    className={inputClass}
                  />
                </Field>

                <Field label="X (Twitter) Profile URL">
                  <input
                    type="url"
                    value={form.twitterUrl || ''}
                    onChange={(e) => set('twitterUrl', e.target.value || null)}
                    placeholder="https://x.com/smartbestbrands"
                    className={inputClass}
                  />
                </Field>

                <Field label="TikTok Profile URL">
                  <input
                    type="url"
                    value={form.tiktokUrl || ''}
                    onChange={(e) => set('tiktokUrl', e.target.value || null)}
                    placeholder="https://tiktok.com/@smartbestbrands"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>
          </div>
        )}

        {/* ═════════ TAB 5: Bank & Footer ═════════ */}
        {activeTab === 'bank' && (
          <div className="space-y-6">
            {/* Bank Transfer Details */}
            <Card title="Bank Transfer Checkout Details" subtitle="Displayed on checkout when customers choose bank transfer payment">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Bank Name" hint="e.g. Moniepoint MFB, Zenith Bank">
                  <input
                    type="text"
                    value={form.bankName || ''}
                    onChange={(e) => set('bankName', e.target.value || null)}
                    placeholder="Moniepoint Microfinance Bank"
                    className={inputClass}
                  />
                </Field>

                <Field label="Account Name" hint="Registered account holder name">
                  <input
                    type="text"
                    value={form.bankAccountName || ''}
                    onChange={(e) => set('bankAccountName', e.target.value || null)}
                    placeholder="Smart Best Brands Nigeria"
                    className={inputClass}
                  />
                </Field>

                <Field label="Account Number" hint="10-digit NUBAN number">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.bankAccountNumber || ''}
                    onChange={(e) => set('bankAccountNumber', e.target.value || null)}
                    placeholder="0123456789"
                    className={inputClass}
                  />
                </Field>
              </div>
            </Card>

            {/* Footer Copy */}
            <Card title="Footer Copy" subtitle="About blurb displayed at the bottom of every page">
              <Field label="Footer Brand Description" hint="Brief summary of your company, promise, and warranty">
                <textarea
                  rows={3}
                  value={form.footerText}
                  onChange={(e) => set('footerText', e.target.value)}
                  placeholder="Original mattresses, luxury furniture, and bedding — factory-direct, delivered to your door."
                  className={textareaClass}
                />
              </Field>
            </Card>
          </div>
        )}

        {/* ── Bottom Save Action Bar ── */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-stone-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                All changes saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting || saving}
              className="px-3.5 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-950 hover:bg-blue-900 active:scale-[0.98] rounded-xl shadow-md transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving changes…' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}

// ── Shared UI Components ──

const inputClass =
  'w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 transition-all text-blue-950 bg-white placeholder:text-stone-300'

const textareaClass =
  'w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 transition-all text-blue-950 bg-white placeholder:text-stone-300 resize-y'

function Card({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      <div className="border-b border-stone-100 pb-3">
        <h2 className="text-base font-bold text-blue-950">{title}</h2>
        {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-stone-800 block">{label}</label>
      {hint && <p className="text-[11px] text-stone-400 leading-tight">{hint}</p>}
      {children}
    </div>
  )
}

function isValidHex(c?: string | null): boolean {
  if (!c) return false
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(c.trim())
}
