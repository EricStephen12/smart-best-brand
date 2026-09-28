'use client'

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { getSiteSettings, updateSiteSettings, resetSiteSettings } from '@/actions/site-settings'
import {
  HEADING_FONTS,
  BODY_FONTS,
  type SiteSettingsData,
  COLOR_PRESETS,
  BUTTON_SHAPE_OPTIONS,
  CARD_STYLE_OPTIONS,
  BADGE_STYLE_OPTIONS,
} from '@/lib/site-settings'
import { FAQS } from '@/lib/constants'
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
  Type,
  Megaphone,
  Layers,
  ShieldCheck,
  HelpCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  Sliders,
  Eye,
  SlidersHorizontal,
  X,
} from 'lucide-react'

// Preview page routes available in the customizer
const PREVIEW_PAGES = [
  { label: 'Home Page', path: '/' },
  { label: 'Catalog (/products)', path: '/products' },
  { label: 'Our Story (/about)', path: '/about' },
  { label: 'Delivery (/delivery)', path: '/delivery' },
  { label: 'FAQs (/faqs)', path: '/faqs' },
  { label: 'Contact Us (/contact)', path: '/contact' },
]

// Sections list for Shopify-style section editor
const SECTIONS_LIST = [
  { id: 'announcement', label: 'Announcement Bar', icon: Megaphone, desc: 'Top promotional ribbon', targetId: 'announcement' },
  { id: 'hero', label: 'Hero Banner & Slides', icon: Home, desc: 'Headline, CTA buttons & backdrop word', targetId: 'hero' },
  { id: 'story', label: 'Our Story & Brand Promise', icon: Sparkles, desc: 'Mission writeup, stats & photos', targetId: 'story' },
  { id: 'shop', label: 'Catalog & Best Sellers', icon: ShoppingBag, desc: 'Shop headers, featured pieces & categories', targetId: 'featured' },
  { id: 'promo', label: 'Mid-Page Promo Banner', icon: Layers, desc: 'Full-width spotlight callout banner', targetId: 'promo' },
  { id: 'policies', label: 'Guarantees & Policies', icon: ShieldCheck, desc: 'Delivery, returns & warranty points', targetId: null },
  { id: 'footer', label: 'Footer & Copyright', icon: CreditCard, desc: 'Footer brand statement and details', targetId: null },
]

// Theme settings list for global visual styling
const THEME_SETTINGS_LIST = [
  { id: 'identity', label: 'Store Identity & Logo', icon: Home, desc: 'Store name, tagline, and official logo' },
  { id: 'colors', label: 'Brand Colors & Palettes', icon: Palette, desc: 'Curated color themes & hex pickers' },
  { id: 'buttons', label: 'Buttons & Shape Style', icon: Layers, desc: 'Sharp (0px), Soft (8px), or Pill (9999px)' },
  { id: 'cards', label: 'Card Corners & Containers', icon: Layers, desc: 'Square (0px), Rounded (12px), Curved (24px)' },
  { id: 'badges', label: 'Tags & Badges Style', icon: ShieldCheck, desc: 'Sale badges and category chips' },
  { id: 'typography', label: 'Typography Pairings', icon: Type, desc: 'Serif/Display titles & clean body fonts' },
  { id: 'watermarks', label: 'Section Watermarks', icon: Sparkles, desc: 'Large background editorial words' },
  { id: 'faqs', label: 'Dynamic FAQs Manager', icon: HelpCircle, desc: 'Add, edit, reorder & delete FAQ items' },
  { id: 'customSize', label: 'Custom Size Order Modal', icon: Sliders, desc: 'Popup copy for custom mattress requests' },
  { id: 'contact', label: 'Contact & Social Channels', icon: Phone, desc: 'Phone, WhatsApp, address & socials' },
  { id: 'bank', label: 'Bank Transfer Payment', icon: CreditCard, desc: 'Checkout bank account details' },
]

export default function SiteSettingsPage() {
  const [form, setForm] = useState<SiteSettingsData | null>(null)
  const [initialForm, setInitialForm] = useState<SiteSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)

  // Shopify-style customizer state
  const [category, setCategory] = useState<'sections' | 'theme'>('sections')
  const [expandedSection, setExpandedSection] = useState<string | null>('hero')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewUrl, setPreviewUrl] = useState('/')
  const [previewKey, setPreviewKey] = useState(0)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    void getSiteSettings().then((d) => {
      setForm(d)
      setInitialForm(d)
      setLoading(false)
    })
  }, [])

  // Live real-time sync with preview iframe
  const syncIframe = useCallback((data: SiteSettingsData) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return
    try {
      iframeRef.current.contentWindow.postMessage(
        { type: 'UPDATE_SITE_SETTINGS_PREVIEW', settings: data },
        '*'
      )
    } catch {}
  }, [])

  const highlightSection = useCallback((targetId: string | null) => {
    if (!targetId || !iframeRef.current || !iframeRef.current.contentWindow) return
    try {
      iframeRef.current.contentWindow.postMessage(
        { type: 'HIGHLIGHT_SECTION', targetId },
        '*'
      )
    } catch {}
  }, [])

  // Sync to iframe whenever form state changes
  useEffect(() => {
    if (form) {
      syncIframe(form)
    }
  }, [form, syncIframe])

  // Listen for iframe ready message
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === 'SITE_SETTINGS_IFRAME_MOUNTED' && form) {
        syncIframe(form)
      }
    }
    window.addEventListener('message', handleMsg)
    return () => window.removeEventListener('message', handleMsg)
  }, [form, syncIframe])

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
        syncIframe(res.data)
      }
      toast.success('Site settings published successfully!')
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset all site settings to factory defaults? Any custom styling and writeups will be restored to original values.')) {
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
        syncIframe(res.data)
      }
      toast.success('Site settings restored to factory defaults!')
    } catch {
      toast.error('Failed to reset')
    } finally {
      setResetting(false)
    }
  }

  // FAQs helpers
  const getFaqsList = (): Array<{ question: string; answer: string }> => {
    if (!form?.faqsJson) return FAQS.map((f) => ({ question: f.question, answer: f.answer }))
    try {
      const arr = JSON.parse(form.faqsJson)
      if (Array.isArray(arr) && arr.length > 0) return arr
    } catch {}
    return FAQS.map((f) => ({ question: f.question, answer: f.answer }))
  }

  const handleAddFaq = () => {
    const current = getFaqsList()
    const updated = [
      ...current,
      {
        question: 'New Frequently Asked Question',
        answer: 'Provide clear, reassuring information for your customers here.',
      },
    ]
    set('faqsJson', JSON.stringify(updated))
  }

  const handleUpdateFaq = (index: number, key: 'question' | 'answer', value: string) => {
    const current = [...getFaqsList()]
    if (!current[index]) return
    current[index] = { ...current[index], [key]: value }
    set('faqsJson', JSON.stringify(current))
  }

  const handleDeleteFaq = (index: number) => {
    const current = getFaqsList().filter((_, i) => i !== index)
    set('faqsJson', JSON.stringify(current))
  }

  const handleMoveFaq = (index: number, direction: -1 | 1) => {
    const current = [...getFaqsList()]
    const target = index + direction
    if (target < 0 || target >= current.length) return
    const temp = current[index]
    current[index] = current[target]
    current[target] = temp
    set('faqsJson', JSON.stringify(current))
  }

  // Filter items based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS_LIST
    const q = searchQuery.toLowerCase()
    return SECTIONS_LIST.filter(
      (s) => s.label.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const filteredThemeSettings = useMemo(() => {
    if (!searchQuery.trim()) return THEME_SETTINGS_LIST
    const q = searchQuery.toLowerCase()
    return THEME_SETTINGS_LIST.filter(
      (s) => s.label.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    )
  }, [searchQuery])

  if (loading || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-950" />
        <p className="text-sm font-medium text-stone-500">Loading theme customizer…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#f4f3f0] overflow-hidden select-none font-sans">
      {/* ══════════════════════════════════════════════════════════════
          1. SHOPIFY-STYLE TOP CUSTOMIZER BAR
      ══════════════════════════════════════════════════════════════ */}
      <header className="h-14 sm:h-16 bg-white border-b border-stone-200/90 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
        {/* Left: Brand Identity & Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="p-2 text-stone-400 hover:text-blue-950 hover:bg-stone-100 rounded-xl transition-colors"
            title="Back to Admin Dashboard"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-playfair text-sm sm:text-base font-extrabold text-blue-950 tracking-tight">
                {form.siteName || 'Smart Best Brands'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/70 hidden sm:inline-block">
                Theme Studio
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
              {isDirty ? (
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Unsaved changes
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  All changes live
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Page Selector & Device Viewport (Shopify Standard) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Page Picker */}
          <div className="relative">
            <select
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              className="appearance-none bg-stone-100 hover:bg-stone-200/80 text-blue-950 text-xs font-semibold px-3.5 py-1.5 pr-8 rounded-xl border border-stone-200/70 cursor-pointer outline-none focus:ring-2 focus:ring-blue-950/10 transition-all"
            >
              {PREVIEW_PAGES.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="w-px h-5 bg-stone-200 mx-1" />

          {/* Device Toggles */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/60">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              title="Desktop View (100%)"
              className={`p-1.5 rounded-lg transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-lg transition-all ${
                previewDevice === 'tablet'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              title="Mobile View (390px iPhone)"
              className={`p-1.5 rounded-lg transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Actions (Save, Reset, Live Store, Mobile View Switcher) */}
        <div className="flex items-center gap-2">
          {/* Mobile view toggle for small screens */}
          <div className="flex lg:hidden bg-stone-100 p-1 rounded-xl border border-stone-200/80 mr-1">
            <button
              type="button"
              onClick={() => setMobileTab('editor')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                mobileTab === 'editor' ? 'bg-white text-blue-950 shadow-sm' : 'text-stone-500'
              }`}
            >
              Controls
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                mobileTab === 'preview' ? 'bg-white text-blue-950 shadow-sm' : 'text-stone-500'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPreviewKey((k) => k + 1)}
            title="Reload live preview"
            className="hidden sm:inline-flex p-2 text-stone-500 hover:text-blue-950 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <Link
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            title="Open in new window"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || saving}
            title="Reset to factory defaults"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 active:scale-[0.98] rounded-xl shadow-sm transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Publishing…' : 'Publish'}</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. SPLIT WORKSPACE: LEFT EDITOR PANEL + RIGHT LIVE PREVIEW
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── LEFT PANEL: Shopify-Style Section & Settings Drawer ── */}
        <aside
          className={`w-full lg:w-[430px] xl:w-[460px] bg-white border-r border-stone-200/90 flex flex-col shrink-0 h-full overflow-hidden z-20 transition-all ${
            mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Top Panel Bar: Search & Category Switcher */}
          <div className="p-3 border-b border-stone-100 bg-white space-y-2.5">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter settings, copy, or styles…"
                className="w-full pl-8 pr-7 py-2 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 transition-all placeholder:text-stone-400 text-blue-950"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Toggle: "Sections" vs "Theme Settings" (Shopify Standard) */}
            <div className="grid grid-cols-2 p-1 bg-stone-100/80 rounded-xl border border-stone-200/60">
              <button
                type="button"
                onClick={() => {
                  setCategory('sections')
                  setExpandedSection('hero')
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  category === 'sections'
                    ? 'bg-white text-blue-950 shadow-sm border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Page Sections</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('theme')
                  setExpandedSection('identity')
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  category === 'theme'
                    ? 'bg-white text-blue-950 shadow-sm border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
                <span>Theme Styles</span>
              </button>
            </div>
          </div>

          {/* Accordion List Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-stone-100">
            {/* ── 2A. PAGE SECTIONS MODE ── */}
            {category === 'sections' && (
              <div className="space-y-2">
                {filteredSections.map((sec) => {
                  const Icon = sec.icon
                  const isOpen = expandedSection === sec.id

                  return (
                    <div
                      key={sec.id}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isOpen
                          ? 'border-blue-950/20 bg-stone-50/40 shadow-sm ring-1 ring-blue-950/5'
                          : 'border-stone-200/80 bg-white hover:border-stone-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const next = isOpen ? null : sec.id
                          setExpandedSection(next)
                          if (sec.targetId) {
                            highlightSection(sec.targetId)
                          }
                        }}
                        className="w-full flex items-center justify-between p-3.5 text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isOpen ? 'bg-blue-950 text-white' : 'bg-stone-100 text-stone-500 group-hover:text-blue-950'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-blue-950 block truncate">{sec.label}</span>
                            <span className="text-[11px] text-stone-400 block truncate">{sec.desc}</span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180 text-blue-950' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-1 border-t border-stone-200/60 bg-white space-y-4">
                          {/* 1. Announcement Bar Form */}
                          {sec.id === 'announcement' && (
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                                <div>
                                  <span className="text-xs font-bold text-blue-950 block">Enable Ribbon Bar</span>
                                  <span className="text-[10px] text-stone-400">Show message above main site header</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={form.announcementEnabled}
                                    onChange={(e) => set('announcementEnabled', e.target.checked)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-stone-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-950" />
                                </label>
                              </div>

                              <Field label="Ribbon Text" hint="e.g. Free delivery on orders over ₦150,000">
                                <input
                                  type="text"
                                  value={form.announcementText || ''}
                                  onChange={(e) => set('announcementText', e.target.value)}
                                  placeholder="Free delivery in Abuja & Benin City"
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
                          )}

                          {/* 2. Hero Section Form */}
                          {sec.id === 'hero' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Hero Headline" hint="Bold large statement visitors see first">
                                <input
                                  type="text"
                                  value={form.heroTitle}
                                  onChange={(e) => set('heroTitle', e.target.value)}
                                  placeholder="Sleep Like It Matters"
                                  className={inputClass}
                                />
                              </Field>

                              <Field label="Hero Subtitle" hint="Supporting paragraph below headline">
                                <textarea
                                  rows={3}
                                  value={form.heroSubtitle}
                                  onChange={(e) => set('heroSubtitle', e.target.value)}
                                  placeholder="Authentic comfort for Nigerian homes..."
                                  className={textareaClass}
                                />
                              </Field>

                              <div className="grid grid-cols-2 gap-2">
                                <Field label="Button Label">
                                  <input
                                    type="text"
                                    value={form.heroCtaLabel}
                                    onChange={(e) => set('heroCtaLabel', e.target.value)}
                                    placeholder="Shop products"
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Button Link">
                                  <input
                                    type="text"
                                    value={form.heroCtaHref}
                                    onChange={(e) => set('heroCtaHref', e.target.value)}
                                    placeholder="/products"
                                    className={inputClass}
                                  />
                                </Field>
                              </div>

                              <Field label="Hero Watermark Word" hint="Large faint background typography (default: Comfort)">
                                <input
                                  type="text"
                                  value={form.heroBackdropWord}
                                  onChange={(e) => set('heroBackdropWord', e.target.value)}
                                  placeholder="Comfort"
                                  className={inputClass}
                                />
                              </Field>
                            </div>
                          )}

                          {/* 3. Story Section Form */}
                          {sec.id === 'story' && (
                            <div className="space-y-4 pt-2">
                              <div className="space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                                <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block">
                                  Story Block 1: Who We Are
                                </span>
                                <Field label="Section Badge">
                                  <input
                                    type="text"
                                    value={form.storyBadge}
                                    onChange={(e) => set('storyBadge', e.target.value)}
                                    placeholder="Who We Are"
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Headline">
                                  <input
                                    type="text"
                                    value={form.storyTitle}
                                    onChange={(e) => set('storyTitle', e.target.value)}
                                    placeholder="Original Mattresses, Directly to Your Home."
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Story Paragraph">
                                  <textarea
                                    rows={3}
                                    value={form.storyText}
                                    onChange={(e) => set('storyText', e.target.value)}
                                    className={textareaClass}
                                  />
                                </Field>
                                <Field label="Story Image" hint="Featured lifestyle photo">
                                  <CloudinaryUpload
                                    value={form.storyImageUrl ? [form.storyImageUrl] : []}
                                    onChange={(urls) => set('storyImageUrl', urls[urls.length - 1] || null)}
                                    maxFiles={1}
                                    label="Upload story image"
                                  />
                                </Field>
                              </div>

                              <div className="space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                                <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block">
                                  Story Block 2: Our Promise
                                </span>
                                <Field label="Promise Badge">
                                  <input
                                    type="text"
                                    value={form.storySecondaryBadge}
                                    onChange={(e) => set('storySecondaryBadge', e.target.value)}
                                    placeholder="Our Promise"
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Promise Headline">
                                  <input
                                    type="text"
                                    value={form.storySecondaryTitle}
                                    onChange={(e) => set('storySecondaryTitle', e.target.value)}
                                    placeholder="100% Authentic, Direct From the Factory."
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Promise Paragraph">
                                  <textarea
                                    rows={3}
                                    value={form.storySecondaryText}
                                    onChange={(e) => set('storySecondaryText', e.target.value)}
                                    className={textareaClass}
                                  />
                                </Field>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <Field label="Stat 1 (Number / Badge)">
                                  <input
                                    type="text"
                                    value={form.statOneValue}
                                    onChange={(e) => set('statOneValue', e.target.value)}
                                    placeholder="07"
                                    className={inputClass}
                                  />
                                  <input
                                    type="text"
                                    value={form.statOneBadge}
                                    onChange={(e) => set('statOneBadge', e.target.value)}
                                    placeholder="Partner Brands"
                                    className={`${inputClass} mt-1`}
                                  />
                                </Field>
                                <Field label="Stat 2 (Number / Badge)">
                                  <input
                                    type="text"
                                    value={form.statTwoValue}
                                    onChange={(e) => set('statTwoValue', e.target.value)}
                                    placeholder="100%"
                                    className={inputClass}
                                  />
                                  <input
                                    type="text"
                                    value={form.statTwoBadge}
                                    onChange={(e) => set('statTwoBadge', e.target.value)}
                                    placeholder="Original Stock"
                                    className={`${inputClass} mt-1`}
                                  />
                                </Field>
                              </div>

                              <Field label="Story Watermark Word" hint="Default: Rest">
                                <input
                                  type="text"
                                  value={form.storyBackdropWord}
                                  onChange={(e) => set('storyBackdropWord', e.target.value)}
                                  placeholder="Rest"
                                  className={inputClass}
                                />
                              </Field>
                            </div>
                          )}

                          {/* 4. Shop Headers Form */}
                          {sec.id === 'shop' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Shop Page (/products) Title">
                                <input
                                  type="text"
                                  value={form.shopPageTitle}
                                  onChange={(e) => set('shopPageTitle', e.target.value)}
                                  placeholder="The Collection"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Shop Page Tagline">
                                <input
                                  type="text"
                                  value={form.shopPageTagline}
                                  onChange={(e) => set('shopPageTagline', e.target.value)}
                                  placeholder="Original mattresses, luxury furniture, and bedding..."
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Homepage Best Sellers Title">
                                <input
                                  type="text"
                                  value={form.featuredTitle}
                                  onChange={(e) => set('featuredTitle', e.target.value)}
                                  placeholder="What people keep coming back for."
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Homepage Best Sellers Subtitle">
                                <input
                                  type="text"
                                  value={form.featuredDescription}
                                  onChange={(e) => set('featuredDescription', e.target.value)}
                                  placeholder="Our most-loved pieces — or browse everything we carry."
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Categories Grid Title">
                                <input
                                  type="text"
                                  value={form.collectionsTitle}
                                  onChange={(e) => set('collectionsTitle', e.target.value)}
                                  placeholder="Shop by category"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Categories Grid Subtitle">
                                <input
                                  type="text"
                                  value={form.collectionsDescription}
                                  onChange={(e) => set('collectionsDescription', e.target.value)}
                                  placeholder="Mattresses, pillows, furniture — find exactly what your space is missing."
                                  className={inputClass}
                                />
                              </Field>
                            </div>
                          )}

                          {/* 5. Promo Banner Form */}
                          {sec.id === 'promo' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Banner Badge">
                                <input
                                  type="text"
                                  value={form.promoBadge}
                                  onChange={(e) => set('promoBadge', e.target.value)}
                                  placeholder="Crafted for Nigerian homes"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Banner Headline">
                                <input
                                  type="text"
                                  value={form.promoTitle}
                                  onChange={(e) => set('promoTitle', e.target.value)}
                                  placeholder="Spaces worth living in."
                                  className={inputClass}
                                />
                              </Field>
                              <div className="grid grid-cols-2 gap-2">
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
                              <Field label="Banner Photo">
                                <CloudinaryUpload
                                  value={form.promoImageUrl ? [form.promoImageUrl] : []}
                                  onChange={(urls) => set('promoImageUrl', urls[urls.length - 1] || null)}
                                  maxFiles={1}
                                  label="Upload banner image"
                                />
                              </Field>
                            </div>
                          )}

                          {/* 6. Policies Accordion Form */}
                          {sec.id === 'policies' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Delivery Policy" hint="One bullet per line">
                                <textarea
                                  rows={3}
                                  value={form.deliveryPolicy || ''}
                                  onChange={(e) => set('deliveryPolicy', e.target.value)}
                                  placeholder="Free doorstep delivery on select orders..."
                                  className={textareaClass}
                                />
                              </Field>
                              <Field label="Return Policy" hint="One bullet per line">
                                <textarea
                                  rows={3}
                                  value={form.returnPolicy || ''}
                                  onChange={(e) => set('returnPolicy', e.target.value)}
                                  placeholder="7-day inspection window on factory-sealed items..."
                                  className={textareaClass}
                                />
                              </Field>
                              <Field label="Factory Warranty Policy" hint="One bullet per line">
                                <textarea
                                  rows={3}
                                  value={form.warrantyPolicy || ''}
                                  onChange={(e) => set('warrantyPolicy', e.target.value)}
                                  placeholder="100% genuine factory warranty..."
                                  className={textareaClass}
                                />
                              </Field>
                            </div>
                          )}

                          {/* 7. Footer Copy Form */}
                          {sec.id === 'footer' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Footer Bio / Brand Copy" hint="Displayed on every page above copyright">
                                <textarea
                                  rows={3}
                                  value={form.footerText}
                                  onChange={(e) => set('footerText', e.target.value)}
                                  placeholder="Original mattresses, luxury furniture, and bedding — delivered to your door."
                                  className={textareaClass}
                                />
                              </Field>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── 2B. THEME STYLES MODE ── */}
            {category === 'theme' && (
              <div className="space-y-2">
                {filteredThemeSettings.map((thm) => {
                  const Icon = thm.icon
                  const isOpen = expandedSection === thm.id

                  return (
                    <div
                      key={thm.id}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isOpen
                          ? 'border-blue-950/20 bg-stone-50/40 shadow-sm ring-1 ring-blue-950/5'
                          : 'border-stone-200/80 bg-white hover:border-stone-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isOpen ? null : thm.id)}
                        className="w-full flex items-center justify-between p-3.5 text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isOpen ? 'bg-blue-950 text-white' : 'bg-stone-100 text-stone-500 group-hover:text-blue-950'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-blue-950 block truncate">{thm.label}</span>
                            <span className="text-[11px] text-stone-400 block truncate">{thm.desc}</span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180 text-blue-950' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-1 border-t border-stone-200/60 bg-white space-y-4">
                          {/* 1. Identity & Logo */}
                          {thm.id === 'identity' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Store Name" hint="Shown in header, metadata, emails">
                                <input
                                  type="text"
                                  value={form.siteName}
                                  onChange={(e) => set('siteName', e.target.value)}
                                  placeholder="Smart Best Brands"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Store Tagline">
                                <input
                                  type="text"
                                  value={form.tagline}
                                  onChange={(e) => set('tagline', e.target.value)}
                                  placeholder="Quality mattresses, pillows & furniture"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Store Logo" hint="Upload transparent PNG/SVG or paste URL">
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
                                  placeholder="Or paste direct image URL (https://...)"
                                  className={`${inputClass} mt-1`}
                                />
                              </Field>
                            </div>
                          )}

                          {/* 2. Colors & Palettes */}
                          {thm.id === 'colors' && (
                            <div className="space-y-4 pt-2">
                              <div>
                                <label className="text-xs font-bold text-stone-700 block mb-2">Curated Color Palettes</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {COLOR_PRESETS.map((preset) => (
                                    <button
                                      key={preset.name}
                                      type="button"
                                      onClick={() => {
                                        set('primaryColor', preset.primary)
                                        set('accentColor', preset.accent)
                                        set('backgroundColor', preset.bg)
                                      }}
                                      className="p-2.5 rounded-xl border border-stone-200 hover:border-blue-950 text-left transition-all bg-white hover:shadow-sm"
                                    >
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: preset.primary }} />
                                        <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: preset.accent }} />
                                        <span className="w-3.5 h-3.5 rounded-full shadow-sm border border-stone-200" style={{ backgroundColor: preset.bg }} />
                                      </div>
                                      <span className="text-[11px] font-semibold text-stone-700 block truncate">{preset.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3 pt-2 border-t border-stone-100">
                                <Field label="Primary Color (Buttons & Headers)">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={isValidHex(form.primaryColor) ? form.primaryColor : '#172554'}
                                      onChange={(e) => set('primaryColor', e.target.value)}
                                      className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0 bg-white"
                                    />
                                    <input
                                      type="text"
                                      value={form.primaryColor}
                                      onChange={(e) => set('primaryColor', e.target.value)}
                                      className={inputClass}
                                    />
                                  </div>
                                </Field>

                                <Field label="Accent Color (Highlights & Badges)">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={isValidHex(form.accentColor) ? form.accentColor : '#0284c7'}
                                      onChange={(e) => set('accentColor', e.target.value)}
                                      className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0 bg-white"
                                    />
                                    <input
                                      type="text"
                                      value={form.accentColor}
                                      onChange={(e) => set('accentColor', e.target.value)}
                                      className={inputClass}
                                    />
                                  </div>
                                </Field>

                                <Field label="Page Background Color">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={isValidHex(form.backgroundColor) ? form.backgroundColor : '#f7f6f3'}
                                      onChange={(e) => set('backgroundColor', e.target.value)}
                                      className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer p-0.5 shrink-0 bg-white"
                                    />
                                    <input
                                      type="text"
                                      value={form.backgroundColor}
                                      onChange={(e) => set('backgroundColor', e.target.value)}
                                      className={inputClass}
                                    />
                                  </div>
                                </Field>
                              </div>
                            </div>
                          )}

                          {/* 3. Button Shapes & Styles */}
                          {thm.id === 'buttons' && (
                            <div className="space-y-4 pt-2">
                              <label className="text-xs font-bold text-stone-700 block">Button Corner Radius</label>
                              <div className="grid grid-cols-3 gap-2">
                                {BUTTON_SHAPE_OPTIONS.map((opt) => {
                                  const isSel = form.buttonShape === opt.value
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => set('buttonShape', opt.value)}
                                      className={`p-3 rounded-xl border text-center transition-all ${
                                        isSel
                                          ? 'border-blue-950 bg-blue-50/50 ring-2 ring-blue-950/10'
                                          : 'border-stone-200 bg-white hover:border-stone-300'
                                      }`}
                                    >
                                      <div
                                        style={{ borderRadius: opt.radius }}
                                        className="h-6 w-full bg-blue-950 text-white text-[9px] font-bold uppercase tracking-wider flex items-center justify-center mx-auto mb-2"
                                      >
                                        BTN
                                      </div>
                                      <span className="text-[11px] font-bold text-blue-950 block">{opt.label}</span>
                                    </button>
                                  )
                                })}
                              </div>

                              {/* Interactive Live Button Swatch */}
                              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">Live Button Swatch</span>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    style={{
                                      backgroundColor: form.primaryColor,
                                      borderRadius: form.buttonShape === 'pill' ? '9999px' : form.buttonShape === 'rounded' ? '8px' : '0px',
                                    }}
                                    className="px-4 py-2 text-[10px] font-black text-white uppercase tracking-wider shadow-sm"
                                  >
                                    Primary
                                  </button>
                                  <button
                                    type="button"
                                    style={{
                                      borderColor: form.accentColor,
                                      color: form.accentColor,
                                      borderRadius: form.buttonShape === 'pill' ? '9999px' : form.buttonShape === 'rounded' ? '8px' : '0px',
                                    }}
                                    className="px-4 py-2 text-[10px] font-black border uppercase tracking-wider bg-transparent"
                                  >
                                    Secondary
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. Card Corners & Containers */}
                          {thm.id === 'cards' && (
                            <div className="space-y-4 pt-2">
                              <label className="text-xs font-bold text-stone-700 block">Product Cards & Tiles Radius</label>
                              <div className="grid grid-cols-3 gap-2">
                                {CARD_STYLE_OPTIONS.map((opt) => {
                                  const isSel = form.cardStyle === opt.value
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => set('cardStyle', opt.value)}
                                      className={`p-3 rounded-xl border text-center transition-all ${
                                        isSel
                                          ? 'border-blue-950 bg-blue-50/50 ring-2 ring-blue-950/10'
                                          : 'border-stone-200 bg-white hover:border-stone-300'
                                      }`}
                                    >
                                      <div
                                        style={{ borderRadius: opt.radius }}
                                        className="w-8 h-8 bg-stone-200 border border-stone-300 mx-auto mb-2 shadow-inner"
                                      />
                                      <span className="text-[11px] font-bold text-blue-950 block">{opt.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* 5. Badges & Tags */}
                          {thm.id === 'badges' && (
                            <div className="space-y-4 pt-2">
                              <label className="text-xs font-bold text-stone-700 block">Tag & Badge Style</label>
                              <div className="grid grid-cols-2 gap-2">
                                {BADGE_STYLE_OPTIONS.map((opt) => {
                                  const isSel = form.badgeStyle === opt.value
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => set('badgeStyle', opt.value)}
                                      className={`p-3 rounded-xl border text-center transition-all ${
                                        isSel
                                          ? 'border-blue-950 bg-blue-50/50 ring-2 ring-blue-950/10'
                                          : 'border-stone-200 bg-white hover:border-stone-300'
                                      }`}
                                    >
                                      <span
                                        style={{ borderRadius: opt.value === 'pill' ? '9999px' : '0px' }}
                                        className="inline-block px-2.5 py-1 bg-sky-600 text-white text-[9px] font-bold uppercase tracking-wider mb-2"
                                      >
                                        SALE 20%
                                      </span>
                                      <span className="text-[11px] font-bold text-blue-950 block">{opt.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* 6. Typography Pairings */}
                          {thm.id === 'typography' && (
                            <div className="space-y-4 pt-2">
                              <div>
                                <label className="text-xs font-bold text-stone-700 block mb-2">Heading Display Font</label>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                  {HEADING_FONTS.map((font) => (
                                    <button
                                      key={font.name}
                                      type="button"
                                      onClick={() => set('headingFont', font.name)}
                                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                                        form.headingFont === font.name
                                          ? 'border-blue-950 bg-blue-950 text-white shadow-sm'
                                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                                      }`}
                                    >
                                      <span style={{ fontFamily: font.name }} className="font-bold text-sm">
                                        {font.label}
                                      </span>
                                      {form.headingFont === font.name && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-2 border-t border-stone-100">
                                <label className="text-xs font-bold text-stone-700 block mb-2">Body Reading Font</label>
                                <div className="space-y-1.5">
                                  {BODY_FONTS.map((font) => (
                                    <button
                                      key={font.name}
                                      type="button"
                                      onClick={() => set('bodyFont', font.name)}
                                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                                        form.bodyFont === font.name
                                          ? 'border-blue-950 bg-blue-950 text-white shadow-sm'
                                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                                      }`}
                                    >
                                      <span style={{ fontFamily: font.name }} className="font-medium text-sm">
                                        {font.label}
                                      </span>
                                      {form.bodyFont === font.name && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 7. FAQs Manager */}
                          {thm.id === 'faqs' && (
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                                <span className="text-xs font-semibold text-stone-600">
                                  {getFaqsList().length} Questions Configured
                                </span>
                                <button
                                  type="button"
                                  onClick={handleAddFaq}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-lg transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add FAQ</span>
                                </button>
                              </div>

                              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                {getFaqsList().map((faq, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-stone-50/80 border border-stone-200 rounded-xl space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                                        Q{idx + 1}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleMoveFaq(idx, -1)}
                                          disabled={idx === 0}
                                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveFaq(idx, 1)}
                                          disabled={idx === getFaqsList().length - 1}
                                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteFaq(idx)}
                                          className="p-1 text-rose-500 hover:text-rose-700"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <input
                                      type="text"
                                      value={faq.question}
                                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                                      placeholder="Question..."
                                      className={inputClass}
                                    />
                                    <textarea
                                      rows={2}
                                      value={faq.answer}
                                      onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                                      placeholder="Answer..."
                                      className={textareaClass}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 8. Custom Size Modal */}
                          {thm.id === 'customSize' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Modal Headline">
                                <input
                                  type="text"
                                  value={form.customRequestTitle}
                                  onChange={(e) => set('customRequestTitle', e.target.value)}
                                  placeholder="Need a Custom Size?"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Modal Subtitle / Instructions">
                                <textarea
                                  rows={3}
                                  value={form.customRequestSubtitle}
                                  onChange={(e) => set('customRequestSubtitle', e.target.value)}
                                  className={textareaClass}
                                />
                              </Field>
                            </div>
                          )}

                          {/* 9. Contact & Socials */}
                          {thm.id === 'contact' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Store Address">
                                <input
                                  type="text"
                                  value={form.storeAddress}
                                  onChange={(e) => set('storeAddress', e.target.value)}
                                  placeholder="Abuja · Benin City"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Support Email">
                                <input
                                  type="email"
                                  value={form.contactEmail}
                                  onChange={(e) => set('contactEmail', e.target.value)}
                                  placeholder="hello@smartbestbrands.com"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="WhatsApp Number">
                                <input
                                  type="text"
                                  value={form.whatsappNumber || ''}
                                  onChange={(e) => set('whatsappNumber', e.target.value || null)}
                                  placeholder="08012345678"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Support Phone Call">
                                <input
                                  type="text"
                                  value={form.supportPhone || ''}
                                  onChange={(e) => set('supportPhone', e.target.value || null)}
                                  placeholder="+234 800 000 0000"
                                  className={inputClass}
                                />
                              </Field>
                              <div className="pt-2 border-t border-stone-100 space-y-2">
                                <span className="text-[11px] font-bold text-stone-700 block">Social Links</span>
                                <input
                                  type="url"
                                  value={form.instagramUrl || ''}
                                  onChange={(e) => set('instagramUrl', e.target.value || null)}
                                  placeholder="Instagram URL"
                                  className={inputClass}
                                />
                                <input
                                  type="url"
                                  value={form.facebookUrl || ''}
                                  onChange={(e) => set('facebookUrl', e.target.value || null)}
                                  placeholder="Facebook URL"
                                  className={inputClass}
                                />
                                <input
                                  type="url"
                                  value={form.twitterUrl || ''}
                                  onChange={(e) => set('twitterUrl', e.target.value || null)}
                                  placeholder="X (Twitter) URL"
                                  className={inputClass}
                                />
                                <input
                                  type="url"
                                  value={form.tiktokUrl || ''}
                                  onChange={(e) => set('tiktokUrl', e.target.value || null)}
                                  placeholder="TikTok URL"
                                  className={inputClass}
                                />
                              </div>
                            </div>
                          )}

                          {/* 10. Bank Transfer Payment */}
                          {thm.id === 'bank' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Bank Name">
                                <input
                                  type="text"
                                  value={form.bankName || ''}
                                  onChange={(e) => set('bankName', e.target.value || null)}
                                  placeholder="Moniepoint Microfinance Bank"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Account Name">
                                <input
                                  type="text"
                                  value={form.bankAccountName || ''}
                                  onChange={(e) => set('bankAccountName', e.target.value || null)}
                                  placeholder="Smart Best Brands Nigeria"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Account Number">
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
                          )}

                          {/* 11. Section Watermarks */}
                          {thm.id === 'watermarks' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Hero Section Watermark" hint="Default: Comfort">
                                <input
                                  type="text"
                                  value={form.heroBackdropWord}
                                  onChange={(e) => set('heroBackdropWord', e.target.value)}
                                  placeholder="Comfort"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Story Section Watermark" hint="Default: Rest">
                                <input
                                  type="text"
                                  value={form.storyBackdropWord}
                                  onChange={(e) => set('storyBackdropWord', e.target.value)}
                                  placeholder="Rest"
                                  className={inputClass}
                                />
                              </Field>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── RIGHT PANEL: Shopify Live Storefront Preview Canvas ── */}
        <main
          className={`flex-1 flex flex-col bg-stone-200/60 overflow-hidden relative ${
            mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Top Canvas Bar (URL & Preview Info) */}
          <div className="h-10 bg-stone-100/90 border-b border-stone-200 px-4 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] text-stone-600 truncate max-w-[280px] sm:max-w-md">
                Live Preview: {previewUrl}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                {previewDevice === 'mobile' ? '390 × 844 px' : previewDevice === 'tablet' ? '768 × 1024 px' : '100% Fluid'}
              </span>
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="text-[11px] font-semibold text-sky-700 hover:text-blue-950 transition-colors"
              >
                Reload
              </button>
            </div>
          </div>

          {/* Device Frame Viewport Container */}
          <div className="flex-1 overflow-auto p-2 sm:p-6 flex items-start justify-center">
            {previewDevice === 'desktop' && (
              <div className="w-full h-full bg-white rounded-xl shadow-lg border border-stone-300 overflow-hidden flex flex-col">
                <iframe
                  key={`${previewUrl}-${previewKey}`}
                  ref={iframeRef}
                  src={previewUrl}
                  title="Live Storefront Desktop Preview"
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            )}

            {previewDevice === 'tablet' && (
              <div className="w-[768px] h-[980px] max-h-full bg-white rounded-2xl shadow-2xl border-[10px] border-stone-800 overflow-hidden flex flex-col shrink-0">
                {/* Tablet Frame Header */}
                <div className="h-5 bg-stone-800 flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700" />
                </div>
                <iframe
                  key={`${previewUrl}-${previewKey}`}
                  ref={iframeRef}
                  src={previewUrl}
                  title="Live Storefront Tablet Preview"
                  className="w-full flex-1 border-0 bg-white"
                />
              </div>
            )}

            {previewDevice === 'mobile' && (
              <div className="w-[390px] h-[810px] max-h-full bg-white rounded-[40px] shadow-2xl border-[12px] border-stone-900 overflow-hidden flex flex-col shrink-0 relative">
                {/* iPhone Dynamic Island / Speaker Notch */}
                <div className="h-6 bg-stone-900 flex items-center justify-center shrink-0 z-10 relative">
                  <div className="w-24 h-4 bg-black rounded-full" />
                </div>
                <iframe
                  key={`${previewUrl}-${previewKey}`}
                  ref={iframeRef}
                  src={previewUrl}
                  title="Live Storefront Mobile Preview"
                  className="w-full flex-1 border-0 bg-white"
                />
                {/* Home Indicator Bar */}
                <div className="h-4 bg-stone-900 flex items-center justify-center shrink-0">
                  <div className="w-32 h-1 bg-stone-600 rounded-full" />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// ── Shared UI Utilities ──

const inputClass =
  'w-full px-3 py-2 border border-stone-200 rounded-xl text-xs outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 transition-all text-blue-950 bg-white placeholder:text-stone-300'

const textareaClass =
  'w-full px-3 py-2 border border-stone-200 rounded-xl text-xs outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 transition-all text-blue-950 bg-white placeholder:text-stone-300 resize-y'

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
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-stone-700 block">{label}</label>
      {hint && <p className="text-[10px] text-stone-400 leading-tight">{hint}</p>}
      {children}
    </div>
  )
}

function isValidHex(c?: string | null): boolean {
  if (!c) return false
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(c.trim())
}
