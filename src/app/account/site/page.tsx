'use client'

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { getSiteSettings, updateSiteSettings, resetSiteSettings } from '@/actions/site-settings'
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
} from '@/actions/banners'
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
  EyeOff,
  Image as ImageIcon,
  SlidersHorizontal,
  X,
} from 'lucide-react'

// Preview page routes available in the customizer
const PREVIEW_PAGES = [
  { label: 'Home Page', path: '/' },
  { label: 'Catalog (/products)', path: '/products' },
  { label: 'Our Story (/our-story)', path: '/our-story' },
  { label: 'Delivery (/delivery)', path: '/delivery' },
  { label: 'FAQs (/faqs)', path: '/faqs' },
  { label: 'Contact Us (/contact)', path: '/contact' },
  { label: 'Privacy Policy (/privacy)', path: '/privacy' },
  { label: 'Refund Policy (/refund)', path: '/refund' },
  { label: 'Terms & Conditions (/terms)', path: '/terms' },
]

// Maps each section to the preview page it lives on
const SECTION_PAGE_MAP: Record<string, string> = {
  announcement: '/',
  hero: '/',
  story: '/',
  styleComfort: '/',
  ticker: '/',
  collections: '/',
  promo: '/',
  featured: '/',
  editorial: '/',
  newsletter: '/',
  policies: '/delivery',
  footer: '/',
}

// Maps each section to a friendly label the owner will recognise
const SECTION_CONTEXT: Record<string, { page: string; where: string }> = {
  announcement: { page: 'Every Page', where: 'The coloured banner at the very top of your site' },
  hero: { page: 'Homepage (Top)', where: 'The first big section with your main headline, photo, and button' },
  story: { page: 'Homepage (Section 2)', where: 'The \'Who We Are\' story writeup and guarantee section' },
  styleComfort: { page: 'Homepage (Section 3)', where: 'The \'Style Meets Comfort\' headline and photo section' },
  ticker: { page: 'Homepage (Section 4)', where: 'The sliding text banner moving across the page' },
  collections: { page: 'Homepage (Section 5)', where: 'The \'Shop by Room / Collections\' section title & description' },
  promo: { page: 'Homepage (Section 6)', where: 'The full-width callout banner with photo, headline & button' },
  featured: { page: 'Homepage (Section 7)', where: 'The \'Featured / Best Sellers\' section title & subtitle' },
  editorial: { page: 'Homepage (Section 8)', where: 'The \'Buying Guides & Articles\' section with photos' },
  newsletter: { page: 'Homepage (Section 9)', where: 'The email sign-up box near the bottom of the homepage' },
  policies: { page: 'Delivery & Refund Pages', where: 'Your delivery, return/refund, and warranty policy writeups' },
  footer: { page: 'Every Page (Bottom)', where: 'The brand description text at the bottom of every page' },
}

// Sections list in exact home screen top-to-bottom order
const SECTIONS_LIST = [
  { id: 'announcement', number: 'Top Ribbon', label: 'Announcement Ribbon', icon: Megaphone, desc: 'Top message above the header', targetId: 'announcement' },
  { id: 'hero', number: 'Section 1', label: 'Hero Banner (Home Screen Top)', icon: ImageIcon, desc: 'Main headline, photo, description & button', targetId: 'hero' },
  { id: 'story', number: 'Section 2', label: 'Our Story (Who We Are)', icon: Sparkles, desc: 'Story writeup, promise & photos', targetId: 'story' },
  { id: 'styleComfort', number: 'Section 3', label: 'Style Meets Comfort', icon: Sparkles, desc: 'Headline, description & lifestyle photo', targetId: null },
  { id: 'ticker', number: 'Section 4', label: 'Promo Text Ticker', icon: Megaphone, desc: 'Sliding text messages moving across screen', targetId: null },
  { id: 'collections', number: 'Section 5', label: 'Shop by Room / Collections', icon: ShoppingBag, desc: 'Category grid title & description', targetId: 'collections' },
  { id: 'promo', number: 'Section 6', label: 'Mid-Page Promo Banner', icon: Layers, desc: 'Full-width banner with photo, headline & button', targetId: 'promo' },
  { id: 'featured', number: 'Section 7', label: 'Featured Best Sellers', icon: ShoppingBag, desc: 'Best selling products section title & subtitle', targetId: 'featured' },
  { id: 'editorial', number: 'Section 8', label: 'Editorial Journal & Articles', icon: Sparkles, desc: 'Blog/articles title, photos & summaries', targetId: null },
  { id: 'newsletter', number: 'Section 9', label: 'Newsletter Sign-up', icon: Megaphone, desc: 'Email sign-up box headline & button', targetId: null },
  { id: 'policies', number: 'Section 10', label: 'Guarantees & Policies', icon: ShieldCheck, desc: 'Delivery, returns & warranty writeups', targetId: null },
  { id: 'footer', number: 'Section 11', label: 'Footer & Store Details', icon: CreditCard, desc: 'Store writeup, address, phone & copyright', targetId: null },
]

// Theme settings list for global visual styling
const THEME_SETTINGS_LIST = [
  { id: 'identity', label: 'Store Identity & Logo', icon: Home, desc: 'Store name, tagline and official logo' },
  { id: 'colors', label: 'Brand Colors', icon: Palette, desc: 'Pick from curated palettes or set your own hex colors' },
  { id: 'buttons', label: 'Button Style', icon: Layers, desc: 'Sharp, Soft or Pill — choose corner radius' },
  { id: 'typography', label: 'Typography & Fonts', icon: Type, desc: 'Heading display font & body reading font' },
  { id: 'faqs', label: 'FAQs Manager', icon: HelpCircle, desc: 'Add, edit, reorder and delete FAQ items' },
  { id: 'customSize', label: 'Custom Size Modal', icon: Sliders, desc: 'Popup copy for custom mattress size requests' },
  { id: 'contact', label: 'Contact & Social Links', icon: Phone, desc: 'Phone, WhatsApp, address & social media URLs' },
  { id: 'bank', label: 'Bank Transfer Details', icon: CreditCard, desc: 'Checkout bank account name & number' },
]

type BannerItem = {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  ctaLabel: string | null
  ctaHref: string | null
  isActive: boolean
  sortOrder: number
}

export default function SiteSettingsPage() {
  const [form, setForm] = useState<SiteSettingsData | null>(null)
  const [initialForm, setInitialForm] = useState<SiteSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)

  // Carousel banners state
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [bannersLoading, setBannersLoading] = useState(true)
  const [savingBannerId, setSavingBannerId] = useState<string | null>(null)
  const [showAddBanner, setShowAddBanner] = useState(false)
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaLabel: 'Shop products',
    ctaHref: '/products',
  })
  const [addingBanner, setAddingBanner] = useState(false)

  // Shopify-style customizer state
  const [category, setCategory] = useState<'sections' | 'theme'>('sections')
  const [expandedSection, setExpandedSection] = useState<string | null>('hero')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewUrl, setPreviewUrl] = useState('/')
  const [previewKey, setPreviewKey] = useState(0)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const loadBanners = useCallback(async () => {
    setBannersLoading(true)
    try {
      const res = await getAllBanners()
      if (res.success && res.data) {
        setBanners(res.data)
      }
    } catch (e) {
      console.error('Failed to load banners:', e)
    } finally {
      setBannersLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const sec = params.get('section')
      if (sec === 'hero' || sec === 'banners') {
        setCategory('sections')
        setExpandedSection('hero')
      } else if (sec) {
        setCategory('sections')
        setExpandedSection(sec)
      }
    }

    void Promise.all([
      getSiteSettings().then((d) => {
        setForm(d)
        setInitialForm(d)
        setLoading(false)
      }),
      loadBanners(),
    ])
  }, [loadBanners])

  // Live real-time sync with preview iframe
  const syncIframe = useCallback(
    (data: SiteSettingsData, currentBanners?: BannerItem[]) => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'UPDATE_SITE_SETTINGS_PREVIEW',
            settings: data,
            banners: currentBanners || banners,
          },
          '*'
        )
      } catch {}
    },
    [banners]
  )

  const handleBannerFieldChange = (id: string, field: keyof BannerItem, val: any) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, [field]: val } : b))
    setBanners(updated)
    if (form) syncIframe(form, updated)

    // Sync first banner to hero fields
    if (id === banners[0]?.id && form) {
      if (field === 'title') set('heroTitle', val)
      if (field === 'subtitle') set('heroSubtitle', val)
      if (field === 'ctaLabel') set('heroCtaLabel', val)
      if (field === 'ctaHref') set('heroCtaHref', val)
    }
  }

  const handleSaveSlide = async (slide: BannerItem) => {
    setSavingBannerId(slide.id)
    const res = await updateBanner(slide.id, {
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      isActive: slide.isActive,
      sortOrder: slide.sortOrder,
    })
    setSavingBannerId(null)
    if (res.success) {
      toast.success('Slide saved!')
      if (form) syncIframe(form, banners)
    } else {
      toast.error(res.error || 'Failed to save slide')
    }
  }

  const handleToggleBannerActive = async (banner: BannerItem) => {
    const nextActive = !banner.isActive
    const updated = banners.map((b) => (b.id === banner.id ? { ...b, isActive: nextActive } : b))
    setBanners(updated)
    if (form) syncIframe(form, updated)

    const res = await toggleBannerActive(banner.id, nextActive)
    if (res.success) {
      toast.success(nextActive ? 'Slide is now visible in carousel' : 'Slide hidden from carousel')
    } else {
      toast.error(res.error || 'Failed to toggle slide')
      void loadBanners()
    }
  }

  const handleMoveBanner = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= banners.length) return

    const newBanners = [...banners]
    const temp = newBanners[index]
    newBanners[index] = newBanners[targetIndex]
    newBanners[targetIndex] = temp

    newBanners.forEach((b, i) => {
      b.sortOrder = i
    })
    setBanners(newBanners)
    if (form) syncIframe(form, newBanners)

    await Promise.all([
      updateBanner(newBanners[index].id, { sortOrder: index }),
      updateBanner(newBanners[targetIndex].id, { sortOrder: targetIndex }),
    ])
    toast.success('Slides reordered')
  }

  const handleDeleteBanner = async (id: string) => {
    if (banners.length <= 1) {
      toast.error('You must keep at least 1 hero slide in the carousel')
      return
    }
    if (!confirm('Are you sure you want to remove this slide from the carousel?')) return

    const updated = banners.filter((b) => b.id !== id)
    setBanners(updated)
    if (form) syncIframe(form, updated)

    const res = await deleteBanner(id)
    if (res.success) {
      toast.success('Slide deleted')
    } else {
      toast.error(res.error || 'Failed to delete slide')
      void loadBanners()
    }
  }

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBanner.title.trim()) {
      toast.error('Please enter a headline for the slide')
      return
    }
    if (!newBanner.imageUrl.trim()) {
      toast.error('Please upload or paste an image URL for the slide')
      return
    }

    setAddingBanner(true)
    const res = await createBanner({
      title: newBanner.title.trim(),
      subtitle: newBanner.subtitle.trim() || undefined,
      imageUrl: newBanner.imageUrl.trim(),
      ctaLabel: newBanner.ctaLabel.trim() || undefined,
      ctaHref: newBanner.ctaHref.trim() || undefined,
      sortOrder: banners.length,
      isActive: true,
    })
    setAddingBanner(false)

    if (res.success && res.data) {
      toast.success('New carousel slide added!')
      setNewBanner({
        title: '',
        subtitle: '',
        imageUrl: '',
        ctaLabel: 'Shop products',
        ctaHref: '/products',
      })
      setShowAddBanner(false)
      await loadBanners()
    } else {
      toast.error(res.error || 'Failed to create slide')
    }
  }

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

      // Also ensure hero banner in banners table is synced and saved
      if (banners && banners.length > 0) {
        const first = banners[0]
        await updateBanner(first.id, {
          title: form.heroTitle || first.title,
          subtitle: form.heroSubtitle ?? first.subtitle,
          imageUrl: first.imageUrl || '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
          ctaLabel: form.heroCtaLabel || first.ctaLabel,
          ctaHref: form.heroCtaHref || first.ctaHref,
          isActive: first.isActive,
          sortOrder: 0,
        })
      } else {
        await createBanner({
          title: form.heroTitle || 'Quality mattresses, pillows & furniture',
          subtitle: form.heroSubtitle || undefined,
          imageUrl: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
          ctaLabel: form.heroCtaLabel || 'Shop products',
          ctaHref: form.heroCtaHref || '/products',
          sortOrder: 0,
          isActive: true,
        })
      }

      await loadBanners()

      if (res.data) {
        setForm(res.data)
        setInitialForm(res.data)
        syncIframe(res.data)
      }
      toast.success('All changes saved and published successfully!')
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

  // ── Style Meets Comfort helpers ──
  type StyleComfortData = {
    title: string
    description: string
    imageUrl: string
    imageAlt: string
    stats: Array<{ value: string; label: string }>
    slides: Array<{ id: string; label: string; imageUrl: string; href: string }>
  }
  const getStyleComfort = (): StyleComfortData => {
    try {
      if (form?.styleComfortJson) return JSON.parse(form.styleComfortJson) as StyleComfortData
    } catch {}
    return { title: '', description: '', imageUrl: '', imageAlt: '', stats: [], slides: [] }
  }
  const setStyleComfort = (data: StyleComfortData) => set('styleComfortJson', JSON.stringify(data))

  // ── Editorial Journal helpers ──
  type EditorialArticle = { id: string; tag: string; title: string; description: string; imageUrl: string; href: string }
  const getEditorial = (): EditorialArticle[] => {
    try {
      if (form?.editorialJournalJson) {
        const parsed = JSON.parse(form.editorialJournalJson)
        return Array.isArray(parsed) ? parsed : (parsed?.articles ?? [])
      }
    } catch {}
    return []
  }
  const setEditorial = (arr: EditorialArticle[]) => set('editorialJournalJson', JSON.stringify(arr))

  // ── Ticker helpers ──
  type TickerItem = { id: string; text: string; href: string }
  const getTickerItems = (): TickerItem[] => {
    try {
      if (form?.tickerLabelsJson) {
        const parsed = JSON.parse(form.tickerLabelsJson)
        return Array.isArray(parsed) ? parsed : (parsed?.customItems ?? [])
      }
    } catch {}
    return []
  }
  const setTickerItems = (items: TickerItem[]) =>
    set('tickerLabelsJson', JSON.stringify({ mode: 'auto', customItems: items }))

  // ── Newsletter helpers ──
  type NewsletterData = { title: string; subtitle: string; placeholder: string; ctaLabel: string }
  const getNewsletter = (): NewsletterData => {
    try {
      if (form?.newsletterJson) return JSON.parse(form.newsletterJson) as NewsletterData
    } catch {}
    return { title: '', subtitle: '', placeholder: '', ctaLabel: '' }
  }
  const setNewsletter = (data: NewsletterData) => set('newsletterJson', JSON.stringify(data))

  // ── Trust Badges helpers ──
  type TrustData = { featureChecklist: Array<{ id: string; text: string }>; trustBadges: Array<{ id: string; label: string; icon: string }> }
  const getTrustData = (): TrustData => {
    try {
      if (form?.trustBadgesJson) return JSON.parse(form.trustBadgesJson) as TrustData
    } catch {}
    return { featureChecklist: [], trustBadges: [] }
  }
  const setTrustData = (data: TrustData) => set('trustBadgesJson', JSON.stringify(data))

  // ── Nav Links helpers ──
  type NavLinkItem = { id: string; label: string; href: string }
  const getNavLinks = (): NavLinkItem[] => {
    try {
      if (form?.navLinksJson) return JSON.parse(form.navLinksJson) as NavLinkItem[]
    } catch {}
    return []
  }
  const setNavLinks = (items: NavLinkItem[]) => set('navLinksJson', JSON.stringify(items))

  // ── Footer Links helpers ──
  type FooterLinkItem = { id: string; label: string; href: string }
  const getFooterLinks = (): FooterLinkItem[] => {
    try {
      if (form?.footerLinksJson) return JSON.parse(form.footerLinksJson) as FooterLinkItem[]
    } catch {}
    return []
  }
  const setFooterLinks = (items: FooterLinkItem[]) => set('footerLinksJson', JSON.stringify(items))

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
                          // Auto-navigate preview to the page where this section lives
                          if (next && SECTION_PAGE_MAP[next]) {
                            setPreviewUrl(SECTION_PAGE_MAP[next])
                          }
                          if (sec.targetId) {
                            setTimeout(() => highlightSection(sec.targetId), 1200)
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
                            {(sec as any).number && (
                              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 block leading-tight">
                                {(sec as any).number}
                              </span>
                            )}
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
                        <div className="p-4 pt-3 border-t border-stone-200/60 bg-white space-y-4">
                          {/* Context banner — always shown at top of any open section */}
                          {SECTION_CONTEXT[sec.id] && (
                            <div className="flex items-start gap-2.5 p-3 bg-sky-950/5 border border-sky-950/10 rounded-xl">
                              <span className="text-base shrink-0 mt-0.5">📍</span>
                              <div>
                                <p className="text-[11px] font-bold text-blue-950">{SECTION_CONTEXT[sec.id].page}</p>
                                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{SECTION_CONTEXT[sec.id].where}</p>
                              </div>
                            </div>
                          )}

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

                          {/* Section 1: Hero Banner (Home Screen Top) */}
                          {sec.id === 'hero' && (
                            <div className="space-y-4 pt-2">
                              {/* Main Banner Photo */}
                              <Field label="Banner Photo (Image)" hint="Full-screen photo for the top section of your homepage">
                                <CloudinaryUpload
                                  value={banners[0]?.imageUrl ? [banners[0].imageUrl] : ['/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg']}
                                  onChange={(urls) => {
                                    if (urls[0]) {
                                      if (banners.length > 0) {
                                        handleBannerFieldChange(banners[0].id, 'imageUrl', urls[0])
                                      } else {
                                        setBanners([{
                                          id: 'hero-primary',
                                          title: form.heroTitle,
                                          subtitle: form.heroSubtitle,
                                          imageUrl: urls[0],
                                          ctaLabel: form.heroCtaLabel,
                                          ctaHref: form.heroCtaHref,
                                          isActive: true,
                                          sortOrder: 0,
                                        }])
                                      }
                                    }
                                  }}
                                  maxFiles={1}
                                  label="Upload or change hero photo"
                                />
                              </Field>

                              {/* Main Headline */}
                              <Field label="Main Headline" hint="Large bold title on your hero banner">
                                <input
                                  type="text"
                                  value={form.heroTitle}
                                  onChange={(e) => {
                                    set('heroTitle', e.target.value)
                                    if (banners[0]) handleBannerFieldChange(banners[0].id, 'title', e.target.value)
                                  }}
                                  placeholder="Quality mattresses, pillows & furniture"
                                  className={inputClass}
                                />
                              </Field>

                              {/* Subtitle / Paragraph */}
                              <Field label="Subtitle / Paragraph" hint="Descriptive text below the headline">
                                <textarea
                                  rows={2}
                                  value={form.heroSubtitle}
                                  onChange={(e) => {
                                    set('heroSubtitle', e.target.value)
                                    if (banners[0]) handleBannerFieldChange(banners[0].id, 'subtitle', e.target.value)
                                  }}
                                  placeholder="Authentic comfort for Nigerian homes — shop trusted brands with clear pricing and delivery."
                                  className={textareaClass}
                                />
                              </Field>

                              {/* Button Text & Link */}
                              <div className="grid grid-cols-2 gap-2">
                                <Field label="Button Text">
                                  <input
                                    type="text"
                                    value={form.heroCtaLabel}
                                    onChange={(e) => {
                                      set('heroCtaLabel', e.target.value)
                                      if (banners[0]) handleBannerFieldChange(banners[0].id, 'ctaLabel', e.target.value)
                                    }}
                                    placeholder="Shop products"
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Button Link">
                                  <input
                                    type="text"
                                    value={form.heroCtaHref}
                                    onChange={(e) => {
                                      set('heroCtaHref', e.target.value)
                                      if (banners[0]) handleBannerFieldChange(banners[0].id, 'ctaHref', e.target.value)
                                    }}
                                    placeholder="/products"
                                    className={inputClass}
                                  />
                                </Field>
                              </div>

                              {/* Optional: Extra rotating slides disclosure */}
                              <div className="pt-2 border-t border-stone-200/80">
                                <button
                                  type="button"
                                  onClick={() => setShowAddBanner(!showAddBanner)}
                                  className="w-full flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-left text-xs font-semibold text-stone-700 transition-colors"
                                >
                                  <span>Need more rotating slides in your banner carousel? (Optional)</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAddBanner ? 'rotate-180' : ''}`} />
                                </button>

                                {showAddBanner && (
                                  <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold text-stone-700 uppercase">
                                        Total Slides: {banners.length}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const res = await createBanner({
                                            title: 'Comfort for Every Home',
                                            subtitle: 'Original brands delivered directly to your door.',
                                            imageUrl: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
                                            ctaLabel: 'Explore Collection',
                                            ctaHref: '/products',
                                            sortOrder: banners.length,
                                            isActive: true,
                                          })
                                          if (res.success) {
                                            toast.success('Slide added')
                                            void loadBanners()
                                          }
                                        }}
                                        className="px-2 py-1 bg-blue-950 text-white rounded-lg text-xs font-semibold hover:bg-sky-800"
                                      >
                                        + Add Extra Slide
                                      </button>
                                    </div>
                                    {banners.slice(1).map((slide, idx) => (
                                      <div key={slide.id} className="p-3 bg-white rounded-lg border border-stone-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-bold text-blue-950">Slide {idx + 2}</span>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteBanner(slide.id)}
                                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-0.5"
                                          >
                                            <Trash2 className="w-3 h-3" /> Remove
                                          </button>
                                        </div>
                                        <CloudinaryUpload
                                          value={slide.imageUrl ? [slide.imageUrl] : []}
                                          onChange={(urls) => {
                                            if (urls[0]) handleBannerFieldChange(slide.id, 'imageUrl', urls[0])
                                          }}
                                          maxFiles={1}
                                          label={`Slide ${idx + 2} Image`}
                                        />
                                        <input
                                          type="text"
                                          value={slide.title}
                                          onChange={(e) => handleBannerFieldChange(slide.id, 'title', e.target.value)}
                                          placeholder="Slide title"
                                          className={inputClass}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
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
                                    onChange={(urls) => set('storyImageUrl', urls[0] || null)}
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
                                <Field label="Promise Photo" hint="Lifestyle photo shown in Our Promise block">
                                  <CloudinaryUpload
                                    value={((getStyleComfort() as any).storySecondaryImage) ? [(getStyleComfort() as any).storySecondaryImage] : ['/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg']}
                                    onChange={(urls) => {
                                      const sc = getStyleComfort()
                                      setStyleComfort({ ...sc, storySecondaryImage: urls[0] || '' } as any)
                                    }}
                                    maxFiles={1}
                                    label="Upload promise image"
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
                            </div>
                          )}

                          {/* Section 5: Shop by Room / Collections */}
                          {sec.id === 'collections' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Section Title" hint="e.g. Shop by category">
                                <input
                                  type="text"
                                  value={form.collectionsTitle}
                                  onChange={(e) => set('collectionsTitle', e.target.value)}
                                  placeholder="Shop by category"
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Section Subtitle / Description" hint="Descriptive text above category tiles">
                                <input
                                  type="text"
                                  value={form.collectionsDescription}
                                  onChange={(e) => set('collectionsDescription', e.target.value)}
                                  placeholder="Mattresses, pillows, furniture — find exactly what your space is missing."
                                  className={inputClass}
                                />
                              </Field>
                              <div className="pt-2 border-t border-stone-200/80">
                                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                                  Products Catalog Page (/products)
                                </span>
                                <Field label="Shop Page Title">
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
                              </div>
                            </div>
                          )}

                          {/* Section 7: Featured Best Sellers */}
                          {sec.id === 'featured' && (
                            <div className="space-y-3 pt-2">
                              <Field label="Section Title" hint="Headline above your featured products">
                                <input
                                  type="text"
                                  value={form.featuredTitle}
                                  onChange={(e) => set('featuredTitle', e.target.value)}
                                  placeholder="What people keep coming back for."
                                  className={inputClass}
                                />
                              </Field>
                              <Field label="Section Subtitle / Tagline" hint="Small label or tagline above featured products">
                                <input
                                  type="text"
                                  value={form.featuredDescription}
                                  onChange={(e) => set('featuredDescription', e.target.value)}
                                  placeholder="Our most-loved pieces — or browse everything we carry."
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
                                  onChange={(urls) => set('promoImageUrl', urls[0] || null)}
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

                          {/* 8. Style Meets Comfort - simplified */}
                          {sec.id === 'styleComfort' && (() => {
                            const sc = getStyleComfort()
                            return (
                              <div className="space-y-4 pt-2">
                                <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl">
                                  <p className="text-[11px] text-amber-800 leading-relaxed">✏️ Edit the headline, description and photo for the <strong>Style Meets Comfort</strong> section on your homepage.</p>
                                </div>
                                <Field label="Section Headline">
                                  <input type="text" value={sc.title} onChange={(e) => setStyleComfort({ ...sc, title: e.target.value })} placeholder="Style Meets Comfort" className={inputClass} />
                                </Field>
                                <Field label="Section Description" hint="1-2 sentences describing this section">
                                  <textarea rows={3} value={sc.description} onChange={(e) => setStyleComfort({ ...sc, description: e.target.value })} className={textareaClass} placeholder="Where great design meets genuine comfort." />
                                </Field>
                                <Field label="Feature Photo" hint="Large lifestyle photo shown in this section">
                                  <CloudinaryUpload
                                    value={sc.imageUrl ? [sc.imageUrl] : []}
                                    onChange={(urls) => setStyleComfort({ ...sc, imageUrl: urls[0] || '', imageAlt: sc.imageAlt })}
                                    maxFiles={1}
                                    label="Upload feature photo"
                                  />
                                  <input type="url" value={sc.imageUrl} onChange={(e) => setStyleComfort({ ...sc, imageUrl: e.target.value })} placeholder="Or paste a photo URL here" className={`${inputClass} mt-1.5`} />
                                </Field>
                              </div>
                            )
                          })()}

                          {/* 10. Editorial Journal - hidden (too technical for owner) */}
                          {/* 11. Newsletter */}
                          {sec.id === 'ticker' && (() => {
                            const items = getTickerItems()
                            return (
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                                  <span className="text-xs font-semibold text-stone-600">{items.length} ticker items</span>
                                  <button type="button" onClick={() => setTickerItems([...items, { id: Date.now().toString(), text: 'New announcement', href: '/products' }])} className="flex items-center gap-1 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 px-2.5 py-1 rounded-lg">
                                    <Plus className="w-3 h-3" /> Add Item
                                  </button>
                                </div>
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                  {items.map((item, idx) => (
                                    <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold text-sky-700">#{idx + 1}</span>
                                        <div className="flex items-center gap-1">
                                          <button type="button" disabled={idx === 0} onClick={() => { const a = [...items]; [a[idx], a[idx-1]] = [a[idx-1], a[idx]]; setTickerItems(a) }} className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                                          <button type="button" disabled={idx === items.length - 1} onClick={() => { const a = [...items]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; setTickerItems(a) }} className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                                          <button type="button" onClick={() => setTickerItems(items.filter((_, i) => i !== idx))} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                      </div>
                                      <input type="text" value={item.text} onChange={(e) => { const a = [...items]; a[idx] = { ...a[idx], text: e.target.value }; setTickerItems(a) }} placeholder="Ticker text…" className={inputClass} />
                                      <input type="text" value={item.href} onChange={(e) => { const a = [...items]; a[idx] = { ...a[idx], href: e.target.value }; setTickerItems(a) }} placeholder="/products" className={inputClass} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          })()}

                          {/* 12. Trust Badges - hidden (too technical) */}
                          {/* 13. Navigation Links - hidden (could break site) */}
                          {/* 14. Footer Navigation Links - hidden (could break site) */}
                          {sec.id === 'editorial' && (() => {
                            const articles = getEditorial()
                            return (
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                                  <span className="text-xs font-semibold text-stone-600">{articles.length} articles</span>
                                  <button type="button" onClick={() => setEditorial([...articles, { id: Date.now().toString(), tag: 'New', title: '', description: '', imageUrl: '', href: '#' }])} className="flex items-center gap-1 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 px-2.5 py-1 rounded-lg">
                                    <Plus className="w-3 h-3" /> Add Article
                                  </button>
                                </div>
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                  {articles.map((art, idx) => (
                                    <div key={art.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-blue-950">Article {idx + 1}</span>
                                        <button type="button" onClick={() => setEditorial(articles.filter((_, i) => i !== idx))} className="p-1 text-rose-500"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                      <Field label="Tag / Category">
                                        <input type="text" value={art.tag} onChange={(e) => { const a = [...articles]; a[idx] = { ...a[idx], tag: e.target.value }; setEditorial(a) }} placeholder="Guide" className={inputClass} />
                                      </Field>
                                      <Field label="Article Title">
                                        <input type="text" value={art.title} onChange={(e) => { const a = [...articles]; a[idx] = { ...a[idx], title: e.target.value }; setEditorial(a) }} placeholder="How to choose the right mattress" className={inputClass} />
                                      </Field>
                                      <Field label="Description">
                                        <textarea rows={2} value={art.description} onChange={(e) => { const a = [...articles]; a[idx] = { ...a[idx], description: e.target.value }; setEditorial(a) }} placeholder="Short summary…" className={textareaClass} />
                                      </Field>
                                      <Field label="Cover Image">
                                        <CloudinaryUpload value={art.imageUrl ? [art.imageUrl] : []} onChange={(urls) => { const a = [...articles]; a[idx] = { ...a[idx], imageUrl: urls[0] || '' }; setEditorial(a) }} maxFiles={1} label="Article image" />
                                      </Field>
                                      <Field label="Link / Href">
                                        <input type="text" value={art.href} onChange={(e) => { const a = [...articles]; a[idx] = { ...a[idx], href: e.target.value }; setEditorial(a) }} placeholder="#" className={inputClass} />
                                      </Field>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          })()}

                          {/* 11. Newsletter */}
                          {sec.id === 'newsletter' && (() => {
                            const nl = getNewsletter()
                            return (
                              <div className="space-y-3 pt-2">
                                <Field label="Headline">
                                  <input type="text" value={nl.title} onChange={(e) => setNewsletter({ ...nl, title: e.target.value })} placeholder="Get exclusive deals & interior tips" className={inputClass} />
                                </Field>
                                <Field label="Subtitle / Body">
                                  <textarea rows={2} value={nl.subtitle} onChange={(e) => setNewsletter({ ...nl, subtitle: e.target.value })} placeholder="Join 2,000+ Nigerians who shop smarter." className={textareaClass} />
                                </Field>
                                <Field label="Email Input Placeholder">
                                  <input type="text" value={nl.placeholder} onChange={(e) => setNewsletter({ ...nl, placeholder: e.target.value })} placeholder="Enter your email…" className={inputClass} />
                                </Field>
                                <Field label="Subscribe Button Label">
                                  <input type="text" value={nl.ctaLabel} onChange={(e) => setNewsletter({ ...nl, ctaLabel: e.target.value })} placeholder="Subscribe" className={inputClass} />
                                </Field>
                              </div>
                            )
                          })()}

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
                                  onChange={(urls) => set('logoUrl', urls[0] || null)}
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
