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
  newsletter: '/',
  footer: '/',
  faqs: '/faqs',
  policies: '/delivery',
  contact: '/contact',
  bank: '/',
}

// Maps each section to a friendly label the owner will recognise
const SECTION_CONTEXT: Record<string, { page: string; where: string }> = {
  announcement: { page: 'Every Page', where: 'The coloured banner at the very top of your site' },
  hero: { page: 'Homepage (Top)', where: 'The main hero headline, photo carousel, and primary shop button' },
  story: { page: 'Homepage (Section 2)', where: 'The \'Who We Are\' story writeup, guarantee and story photos' },
  styleComfort: { page: 'Homepage (Section 3)', where: 'The \'Style Meets Comfort\' headline, description and photo' },
  ticker: { page: 'Homepage (Section 4)', where: 'The continuous sliding text banner moving across the page' },
  collections: { page: 'Homepage (Section 5)', where: 'The \'Shop by Room / Collections\' category grid title & description' },
  promo: { page: 'Homepage (Section 6)', where: 'The full-width callout banner with photo, headline & button' },
  featured: { page: 'Homepage (Section 7)', where: 'The \'Featured / Best Sellers\' section title & subtitle' },
  newsletter: { page: 'Homepage (Section 8)', where: 'The email newsletter sign-up box' },
  footer: { page: 'Every Page (Bottom)', where: 'The brand description text and contact details at the bottom of every page' },
  faqs: { page: 'FAQs Page (/faqs)', where: 'Customer questions & answers accordion on your FAQs page' },
  policies: { page: 'Delivery & Refund Pages (/delivery & /refund)', where: 'Your delivery, return/refund, and warranty policy writeups' },
  contact: { page: 'Contact Us (/contact)', where: 'Phone, WhatsApp, store address, and social media handles' },
  bank: { page: 'Checkout Page', where: 'Bank account number and instructions shown to customers paying via transfer' },
}

// Homepage sections list in exact home screen top-to-bottom order
const HOMEPAGE_SECTIONS = [
  { id: 'announcement', number: 'Top Ribbon', label: 'Announcement Ribbon', icon: Megaphone, desc: 'Top message above the header', targetId: 'announcement' },
  { id: 'hero', number: 'Section 1', label: 'Hero Banner (Home Screen Top)', icon: ImageIcon, desc: 'Main headline, photo carousel, description & button', targetId: 'hero' },
  { id: 'story', number: 'Section 2', label: 'Our Story (Who We Are)', icon: Sparkles, desc: 'Story writeup, promise & photos', targetId: 'story' },
  { id: 'styleComfort', number: 'Section 3', label: 'Style Meets Comfort', icon: Sparkles, desc: 'Headline, description & lifestyle photo', targetId: null },
  { id: 'ticker', number: 'Section 4', label: 'Promo Text Ticker', icon: Megaphone, desc: 'Sliding text messages moving across screen', targetId: null },
  { id: 'collections', number: 'Section 5', label: 'Shop by Room / Collections', icon: ShoppingBag, desc: 'Category grid title & description', targetId: 'collections' },
  { id: 'promo', number: 'Section 6', label: 'Mid-Page Promo Banner', icon: Layers, desc: 'Full-width banner with photo, headline & button', targetId: 'promo' },
  { id: 'featured', number: 'Section 7', label: 'Featured Best Sellers', icon: ShoppingBag, desc: 'Best selling products section title & subtitle', targetId: 'featured' },
  { id: 'newsletter', number: 'Section 8', label: 'Newsletter Sign-up', icon: Megaphone, desc: 'Email sign-up box headline & button', targetId: null },
  { id: 'footer', number: 'Section 9', label: 'Footer & Store Details', icon: CreditCard, desc: 'Store writeup, address, phone & copyright', targetId: null },
]

// Standalone pages & FAQs content list
const PAGES_SETTINGS_LIST = [
  { id: 'faqs', label: 'Frequently Asked Questions (FAQs)', icon: HelpCircle, desc: 'Add, edit, reorder & delete Q&As shown on /faqs', targetPage: '/faqs' },
  { id: 'policies', label: 'Delivery, Returns & Warranty Policies', icon: ShieldCheck, desc: 'Delivery guarantees, return window & warranty writeups on /delivery and /refund', targetPage: '/delivery' },
  { id: 'contact', label: 'Contact & Social Channels', icon: Phone, desc: 'Phone, WhatsApp, physical address & social links on /contact', targetPage: '/contact' },
  { id: 'bank', label: 'Bank Transfer Details (Checkout)', icon: CreditCard, desc: 'Bank account name, number & instructions for offline orders', targetPage: '/' },
]

// Theme settings list for global visual styling
const THEME_SETTINGS_LIST = [
  { id: 'identity', label: 'Store Identity & Logo', icon: Home, desc: 'Store name, tagline and official logo' },
  { id: 'colors', label: 'Brand Colors', icon: Palette, desc: 'Pick from curated palettes or set your own hex colors' },
  { id: 'buttons', label: 'Button Style', icon: Layers, desc: 'Sharp, Soft or Pill — choose corner radius' },
  { id: 'cards', label: 'Product Cards Style', icon: Layers, desc: 'Corner radius for product cards and containers' },
  { id: 'badges', label: 'Tag & Badge Style', icon: Layers, desc: 'Corner radius for discount and status badges' },
  { id: 'typography', label: 'Typography & Fonts', icon: Type, desc: 'Heading display font & body reading font' },
  { id: 'customSize', label: 'Custom Size Modal', icon: Sliders, desc: 'Popup copy for custom mattress size requests' },
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
  const [initialBanners, setInitialBanners] = useState<BannerItem[]>([])
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
  const [activeHeroSlideIndex, setActiveHeroSlideIndex] = useState(0)

  // Shopify-style customizer state (Homepage, Pages & FAQs, Theme Styles)
  const [category, setCategory] = useState<'sections' | 'pages' | 'theme'>('sections')
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
        setInitialBanners(res.data)
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
        setPreviewUrl('/')
      } else if (sec === 'faqs') {
        setCategory('pages')
        setExpandedSection('faqs')
        setPreviewUrl('/faqs')
      } else if (sec === 'policies' || sec === 'delivery' || sec === 'refund') {
        setCategory('pages')
        setExpandedSection('policies')
        setPreviewUrl('/delivery')
      } else if (sec === 'contact') {
        setCategory('pages')
        setExpandedSection('contact')
        setPreviewUrl('/contact')
      } else if (sec === 'bank') {
        setCategory('pages')
        setExpandedSection('bank')
      } else if (['identity', 'colors', 'buttons', 'cards', 'badges', 'typography', 'customSize'].includes(sec || '')) {
        setCategory('theme')
        setExpandedSection(sec)
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

  const isDirty =
    (form && initialForm ? JSON.stringify(form) !== JSON.stringify(initialForm) : false) ||
    (banners.length > 0 && initialBanners.length > 0 ? JSON.stringify(banners) !== JSON.stringify(initialBanners) : false)

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

      // Also ensure all hero banners in banners table are synced and saved
      if (banners && banners.length > 0) {
        for (let idx = 0; idx < banners.length; idx++) {
          const b = banners[idx]
          const title = idx === 0 ? (form.heroTitle || b.title) : (b.title || 'Slide')
          const subtitle = idx === 0 ? (form.heroSubtitle ?? b.subtitle) : b.subtitle
          const imageUrl = b.imageUrl ?? ''
          const ctaLabel = idx === 0 ? (form.heroCtaLabel || b.ctaLabel) : b.ctaLabel
          const ctaHref = idx === 0 ? (form.heroCtaHref || b.ctaHref) : b.ctaHref

          if (b.id && !b.id.startsWith('banner-temp-')) {
            await updateBanner(b.id, {
              title,
              subtitle,
              imageUrl,
              ctaLabel,
              ctaHref,
              isActive: b.isActive ?? true,
              sortOrder: idx,
            })
          } else {
            await createBanner({
              title,
              subtitle: subtitle || undefined,
              imageUrl,
              ctaLabel: ctaLabel || 'Shop products',
              ctaHref: ctaHref || '/products',
              sortOrder: idx,
              isActive: true,
            })
          }
        }
      }

      await loadBanners()
      setInitialBanners(banners)

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
    storySecondaryImage?: string
    storyCompanionImage?: string
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
    if (!searchQuery.trim()) return HOMEPAGE_SECTIONS
    const q = searchQuery.toLowerCase()
    return HOMEPAGE_SECTIONS.filter(
      (s) => s.label.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return PAGES_SETTINGS_LIST
    const q = searchQuery.toLowerCase()
    return PAGES_SETTINGS_LIST.filter(
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
              onChange={(e) => {
                const nextUrl = e.target.value
                setPreviewUrl(nextUrl)
                if (nextUrl === '/faqs') {
                  setCategory('pages')
                  setExpandedSection('faqs')
                } else if (nextUrl === '/delivery' || nextUrl === '/refund') {
                  setCategory('pages')
                  setExpandedSection('policies')
                } else if (nextUrl === '/contact') {
                  setCategory('pages')
                  setExpandedSection('contact')
                } else if (nextUrl === '/') {
                  setCategory('sections')
                  setExpandedSection('hero')
                }
              }}
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

            {/* Quick jump pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <span className="text-stone-400 font-bold uppercase text-[9px] tracking-wider shrink-0 mr-0.5">Jump:</span>
              <button
                type="button"
                onClick={() => {
                  setCategory('sections')
                  setExpandedSection('hero')
                  setPreviewUrl('/')
                }}
                className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition-colors ${
                  category === 'sections' && expandedSection === 'hero'
                    ? 'bg-blue-950 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                ⚡ Hero
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('pages')
                  setExpandedSection('faqs')
                  setPreviewUrl('/faqs')
                }}
                className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition-colors border ${
                  category === 'pages' && expandedSection === 'faqs'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200/70'
                }`}
              >
                ❓ FAQs
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('pages')
                  setExpandedSection('policies')
                  setPreviewUrl('/delivery')
                }}
                className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition-colors border ${
                  category === 'pages' && expandedSection === 'policies'
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200/70'
                }`}
              >
                🛡️ Policies
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('theme')
                  setExpandedSection('colors')
                }}
                className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition-colors border ${
                  category === 'theme' && expandedSection === 'colors'
                    ? 'bg-indigo-700 text-white border-indigo-700'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200/70'
                }`}
              >
                🎨 Colors
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('pages')
                  setExpandedSection('contact')
                  setPreviewUrl('/contact')
                }}
                className={`px-2 py-0.5 rounded-md font-semibold shrink-0 transition-colors ${
                  category === 'pages' && expandedSection === 'contact'
                    ? 'bg-blue-950 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                📞 Contact
              </button>
            </div>

            {/* Category Toggle: 3 clear tabs */}
            <div className="grid grid-cols-3 p-1 bg-stone-100/80 rounded-xl border border-stone-200/60 text-xs">
              <button
                type="button"
                onClick={() => {
                  setCategory('sections')
                  setExpandedSection('hero')
                  setPreviewUrl('/')
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 font-semibold rounded-lg transition-all ${
                  category === 'sections'
                    ? 'bg-white text-blue-950 shadow-sm border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Homepage</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('pages')
                  setExpandedSection('faqs')
                  setPreviewUrl('/faqs')
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 font-semibold rounded-lg transition-all ${
                  category === 'pages'
                    ? 'bg-white text-blue-950 shadow-sm border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pages &amp; FAQs</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('theme')
                  setExpandedSection('identity')
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 font-semibold rounded-lg transition-all ${
                  category === 'theme'
                    ? 'bg-white text-blue-950 shadow-sm border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
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
                          {sec.id === 'hero' && (() => {
                            const curSlideIdx = Math.min(activeHeroSlideIndex, Math.max(0, banners.length - 1))
                            const currentSlide = banners[curSlideIdx] || {
                              id: 'hero-primary',
                              title: form.heroTitle,
                              subtitle: form.heroSubtitle,
                              imageUrl: '',
                              ctaLabel: form.heroCtaLabel,
                              ctaHref: form.heroCtaHref,
                              isActive: true,
                              sortOrder: 0,
                            }

                            return (
                              <div className="space-y-4 pt-2">
                                {/* Slide Tabs Switcher */}
                                <div className="flex items-center justify-between pb-3 border-b border-stone-200/70">
                                  <div className="flex items-center gap-1.5 overflow-x-auto">
                                    {banners.map((_, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveHeroSlideIndex(idx)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                          curSlideIdx === idx
                                            ? 'bg-blue-950 text-white shadow-sm'
                                            : 'bg-stone-100 text-stone-600 hover:text-blue-950 hover:bg-stone-200/70'
                                        }`}
                                      >
                                        Slide {idx + 1}
                                      </button>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSlide: BannerItem = {
                                          id: `banner-temp-${Date.now()}`,
                                          title: '',
                                          subtitle: '',
                                          imageUrl: '',
                                          ctaLabel: 'Shop products',
                                          ctaHref: '/products',
                                          isActive: true,
                                          sortOrder: banners.length,
                                        }
                                        const updated = [...banners, newSlide]
                                        setBanners(updated)
                                        setActiveHeroSlideIndex(updated.length - 1)
                                        if (form) syncIframe(form, updated)
                                      }}
                                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100/70 border border-sky-200/60 rounded-lg transition-all shrink-0"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Slide</span>
                                    </button>
                                  </div>

                                  {banners.length > 1 && curSlideIdx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const bannerToDelete = banners[curSlideIdx]
                                        if (bannerToDelete && !bannerToDelete.id.startsWith('banner-temp-')) {
                                          void handleDeleteBanner(bannerToDelete.id)
                                        } else {
                                          const updated = banners.filter((_, idx) => idx !== curSlideIdx)
                                          setBanners(updated)
                                          setActiveHeroSlideIndex(Math.max(0, curSlideIdx - 1))
                                          if (form) syncIframe(form, updated)
                                        }
                                      }}
                                      className="text-[11px] font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete Slide</span>
                                    </button>
                                  )}
                                </div>

                                {/* Banner Photo */}
                                <Field
                                  label={`Slide ${curSlideIdx + 1} Photo`}
                                  hint="Full-screen photo for this slide"
                                >
                                  <CloudinaryUpload
                                    value={currentSlide?.imageUrl ? [currentSlide.imageUrl] : []}
                                    onChange={(urls) => {
                                      const newUrl = urls[0] || ''
                                      if (banners.length > 0 && banners[curSlideIdx]) {
                                        handleBannerFieldChange(banners[curSlideIdx].id, 'imageUrl', newUrl)
                                      } else {
                                        setBanners([
                                          {
                                            id: 'hero-primary',
                                            title: form.heroTitle,
                                            subtitle: form.heroSubtitle,
                                            imageUrl: newUrl,
                                            ctaLabel: form.heroCtaLabel,
                                            ctaHref: form.heroCtaHref,
                                            isActive: true,
                                            sortOrder: 0,
                                          },
                                        ])
                                      }
                                    }}
                                    maxFiles={1}
                                    label={`Slide ${curSlideIdx + 1} photo`}
                                  />
                                </Field>

                                {/* Headline */}
                                <Field
                                  label={`Slide ${curSlideIdx + 1} Headline`}
                                  hint="Large bold title on this slide"
                                >
                                  <input
                                    type="text"
                                    value={curSlideIdx === 0 ? form.heroTitle : (currentSlide.title || '')}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      if (curSlideIdx === 0) set('heroTitle', val)
                                      if (banners[curSlideIdx]) {
                                        handleBannerFieldChange(banners[curSlideIdx].id, 'title', val)
                                      }
                                    }}
                                    placeholder="Quality mattresses, pillows & furniture"
                                    className={inputClass}
                                  />
                                </Field>

                                {/* Subtitle / Paragraph */}
                                <Field
                                  label={`Slide ${curSlideIdx + 1} Subtitle / Paragraph`}
                                  hint="Descriptive text below the headline"
                                >
                                  <textarea
                                    rows={2}
                                    value={curSlideIdx === 0 ? form.heroSubtitle : (currentSlide.subtitle || '')}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      if (curSlideIdx === 0) set('heroSubtitle', val)
                                      if (banners[curSlideIdx]) {
                                        handleBannerFieldChange(banners[curSlideIdx].id, 'subtitle', val)
                                      }
                                    }}
                                    placeholder="Authentic comfort for Nigerian homes…"
                                    className={textareaClass}
                                  />
                                </Field>

                                {/* Button Text & Link */}
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Button Text">
                                    <input
                                      type="text"
                                      value={curSlideIdx === 0 ? form.heroCtaLabel : (currentSlide.ctaLabel || '')}
                                      onChange={(e) => {
                                        const val = e.target.value
                                        if (curSlideIdx === 0) set('heroCtaLabel', val)
                                        if (banners[curSlideIdx]) {
                                          handleBannerFieldChange(banners[curSlideIdx].id, 'ctaLabel', val)
                                        }
                                      }}
                                      placeholder="Shop products"
                                      className={inputClass}
                                    />
                                  </Field>
                                  <Field label="Button Link">
                                    <input
                                      type="text"
                                      value={curSlideIdx === 0 ? form.heroCtaHref : (currentSlide.ctaHref || '')}
                                      onChange={(e) => {
                                        const val = e.target.value
                                        if (curSlideIdx === 0) set('heroCtaHref', val)
                                        if (banners[curSlideIdx]) {
                                          handleBannerFieldChange(banners[curSlideIdx].id, 'ctaHref', val)
                                        }
                                      }}
                                      placeholder="/products"
                                      className={inputClass}
                                    />
                                  </Field>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Section 2: Story Section (Who We Are & Our Promise) */}
                          {sec.id === 'story' && (() => {
                            const sc = getStyleComfort()
                            return (
                              <div className="space-y-4 pt-2">
                                {/* Story Block 1: Who We Are */}
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
                                  <Field label="Block 1 Lifestyle Photo (Image 1 of 3)" hint="Main featured lifestyle photo for Block 1">
                                    <CloudinaryUpload
                                      value={form.storyImageUrl ? [form.storyImageUrl] : []}
                                      onChange={(urls) => set('storyImageUrl', urls[0] || '')}
                                      maxFiles={1}
                                      label="Story Block 1 photo"
                                    />
                                  </Field>
                                </div>

                                {/* Story Block 2: Our Promise */}
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
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <Field label="Promise Photo (Image 2 of 3)" hint="Square photo on left">
                                      <CloudinaryUpload
                                        value={sc.storySecondaryImage ? [sc.storySecondaryImage] : []}
                                        onChange={(urls) => {
                                          setStyleComfort({ ...sc, storySecondaryImage: urls[0] || '' })
                                        }}
                                        maxFiles={1}
                                        label="Promise photo"
                                      />
                                    </Field>
                                    <Field label="Companion Photo (Image 3 of 3)" hint="Tall photo on right">
                                      <CloudinaryUpload
                                        value={sc.storyCompanionImage ? [sc.storyCompanionImage] : []}
                                        onChange={(urls) => {
                                          setStyleComfort({ ...sc, storyCompanionImage: urls[0] || '' })
                                        }}
                                        maxFiles={1}
                                        label="Companion photo"
                                      />
                                    </Field>
                                  </div>
                                </div>

                                {/* Story Stats & Link */}
                                <div className="space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                                  <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block">
                                    Story Stats & Link
                                  </span>
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
                                  <Field label="Story Link Label" hint="Link button text pointing to /about">
                                    <input
                                      type="text"
                                      value={form.storyLinkLabel}
                                      onChange={(e) => set('storyLinkLabel', e.target.value)}
                                      placeholder="Learn more"
                                      className={inputClass}
                                    />
                                  </Field>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Section 3: Style Meets Comfort */}
                          {sec.id === 'styleComfort' && (() => {
                            const sc = getStyleComfort()
                            const stats = sc.stats && sc.stats.length >= 2 ? sc.stats : [
                              { value: '07', label: 'Partner Brands' },
                              { value: '100%', label: 'Authentic Warranty' },
                            ]

                            return (
                              <div className="space-y-4 pt-2">
                                <Field label="Headline" hint="Main large uppercase title">
                                  <input
                                    type="text"
                                    value={sc.title ?? 'STYLE MEETS COMFORT'}
                                    onChange={(e) => setStyleComfort({ ...sc, title: e.target.value })}
                                    placeholder="STYLE MEETS COMFORT"
                                    className={inputClass}
                                  />
                                </Field>

                                <Field label="Description / Paragraph" hint="Descriptive text below the headline">
                                  <textarea
                                    rows={3}
                                    value={sc.description ?? ''}
                                    onChange={(e) => setStyleComfort({ ...sc, description: e.target.value })}
                                    placeholder="Crafted with purpose, engineered for longevity. Every piece is sourced to transform your home with genuine comfort."
                                    className={textareaClass}
                                  />
                                </Field>

                                <Field label="Lifestyle Photo" hint="Clean square lifestyle image shown on the right">
                                  <CloudinaryUpload
                                    value={sc.imageUrl ? [sc.imageUrl] : []}
                                    onChange={(urls) => setStyleComfort({ ...sc, imageUrl: urls[0] || '' })}
                                    maxFiles={1}
                                    label="Lifestyle photo"
                                  />
                                </Field>

                                <div className="space-y-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                                  <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block">
                                    Section Stats
                                  </span>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Field label="Stat 1 (Number / Label)">
                                      <input
                                        type="text"
                                        value={stats[0]?.value ?? ''}
                                        onChange={(e) => {
                                          const next = [...stats]
                                          next[0] = { ...next[0], value: e.target.value }
                                          setStyleComfort({ ...sc, stats: next })
                                        }}
                                        placeholder="07"
                                        className={inputClass}
                                      />
                                      <input
                                        type="text"
                                        value={stats[0]?.label ?? ''}
                                        onChange={(e) => {
                                          const next = [...stats]
                                          next[0] = { ...next[0], label: e.target.value }
                                          setStyleComfort({ ...sc, stats: next })
                                        }}
                                        placeholder="Partner Brands"
                                        className={`${inputClass} mt-1`}
                                      />
                                    </Field>
                                    <Field label="Stat 2 (Number / Label)">
                                      <input
                                        type="text"
                                        value={stats[1]?.value ?? ''}
                                        onChange={(e) => {
                                          const next = [...stats]
                                          next[1] = { ...next[1], value: e.target.value }
                                          setStyleComfort({ ...sc, stats: next })
                                        }}
                                        placeholder="100%"
                                        className={inputClass}
                                      />
                                      <input
                                        type="text"
                                        value={stats[1]?.label ?? ''}
                                        onChange={(e) => {
                                          const next = [...stats]
                                          next[1] = { ...next[1], label: e.target.value }
                                          setStyleComfort({ ...sc, stats: next })
                                        }}
                                        placeholder="Authentic Warranty"
                                        className={`${inputClass} mt-1`}
                                      />
                                    </Field>
                                  </div>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Section 4: Promo Text Ticker */}
                          {sec.id === 'ticker' && (() => {
                            const items = getTickerItems()
                            return (
                              <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between pb-1 border-b border-stone-200/70">
                                  <div>
                                    <span className="text-xs font-bold text-blue-950 block">Sliding Ticker Messages</span>
                                    <span className="text-[10px] text-stone-400">Continuous sliding marquee banner across the homepage</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [
                                        ...items,
                                        { id: `ticker-${Date.now()}`, text: '', href: '/products' },
                                      ]
                                      setTickerItems(next)
                                    }}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100/70 border border-sky-200/60 rounded-lg transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Message</span>
                                  </button>
                                </div>

                                {items.length === 0 ? (
                                  <div className="p-4 rounded-xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-2">
                                    <p className="text-xs text-stone-500">
                                      Default category and brand names are currently scrolling.
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTickerItems([
                                          { id: '1', text: '100% FACTORY-SEALED MATTRESSES', href: '/products' },
                                          { id: '2', text: 'NATIONWIDE DIRECT DELIVERY', href: '/delivery' },
                                          { id: '3', text: 'GENUINE MANUFACTURER WARRANTY', href: '/products' },
                                          { id: '4', text: 'OFFICIAL MOUKA & VITAFOAM DISTRIBUTOR', href: '/products' },
                                        ])
                                      }}
                                      className="text-xs font-semibold text-blue-950 underline hover:text-blue-800"
                                    >
                                      Load standard promo messages
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-2.5">
                                    {items.map((item, idx) => (
                                      <div key={item.id || idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                                            Message {idx + 1}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const next = items.filter((_, i) => i !== idx)
                                              setTickerItems(next)
                                            }}
                                            className="text-stone-400 hover:text-rose-600 p-1"
                                            title="Delete message"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          <Field label="Text">
                                            <input
                                              type="text"
                                              value={item.text}
                                              onChange={(e) => {
                                                const next = [...items]
                                                next[idx] = { ...next[idx], text: e.target.value }
                                                setTickerItems(next)
                                              }}
                                              placeholder="e.g. FACTORY-SEALED MATTRESSES"
                                              className={inputClass}
                                            />
                                          </Field>
                                          <Field label="Link (Optional)">
                                            <input
                                              type="text"
                                              value={item.href}
                                              onChange={(e) => {
                                                const next = [...items]
                                                next[idx] = { ...next[idx], href: e.target.value }
                                                setTickerItems(next)
                                              }}
                                              placeholder="/products"
                                              className={inputClass}
                                            />
                                          </Field>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })()}

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

                          {/* Section 6: Mid-Page Promo Banner */}
                          {sec.id === 'promo' && (
                            <div className="space-y-4 pt-2">
                              <Field label="Banner Badge" hint="Small label above headline (e.g. For Nigerian homes)">
                                <input
                                  type="text"
                                  value={form.promoBadge}
                                  onChange={(e) => set('promoBadge', e.target.value)}
                                  placeholder="For Nigerian homes"
                                  className={inputClass}
                                />
                              </Field>

                              <Field label="Headline" hint="Large bold title on the promo banner">
                                <input
                                  type="text"
                                  value={form.promoTitle}
                                  onChange={(e) => set('promoTitle', e.target.value)}
                                  placeholder="Comfort that feels like home"
                                  className={inputClass}
                                />
                              </Field>

                              <Field label="Banner Photo (Image)" hint="Full-width background image for the promo banner">
                                <CloudinaryUpload
                                  value={form.promoImageUrl ? [form.promoImageUrl] : []}
                                  onChange={(urls) => set('promoImageUrl', urls[0] || '')}
                                  maxFiles={1}
                                  label="Promo banner photo"
                                />
                              </Field>

                              <div className="grid grid-cols-2 gap-2">
                                <Field label="Button Text">
                                  <input
                                    type="text"
                                    value={form.promoCtaLabel}
                                    onChange={(e) => set('promoCtaLabel', e.target.value)}
                                    placeholder="Discover now"
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

                          {/* Section 8: Newsletter */}
                          {sec.id === 'newsletter' && (() => {
                            const nl = getNewsletter()
                            return (
                              <div className="space-y-3 pt-2">
                                <Field label="Headline">
                                  <input
                                    type="text"
                                    value={nl.title}
                                    onChange={(e) => setNewsletter({ ...nl, title: e.target.value })}
                                    placeholder="Get exclusive deals & interior tips"
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Subtitle / Body">
                                  <textarea
                                    rows={2}
                                    value={nl.subtitle}
                                    onChange={(e) => setNewsletter({ ...nl, subtitle: e.target.value })}
                                    placeholder="Join 2,000+ Nigerians who shop smarter."
                                    className={textareaClass}
                                  />
                                </Field>
                                <Field label="Email Input Placeholder">
                                  <input
                                    type="text"
                                    value={nl.placeholder}
                                    onChange={(e) => setNewsletter({ ...nl, placeholder: e.target.value })}
                                    placeholder="Enter your email…"
                                    className={inputClass}
                                  />
                                </Field>
                                <Field label="Subscribe Button Label">
                                  <input
                                    type="text"
                                    value={nl.ctaLabel}
                                    onChange={(e) => setNewsletter({ ...nl, ctaLabel: e.target.value })}
                                    placeholder="Subscribe"
                                    className={inputClass}
                                  />
                                </Field>
                              </div>
                            )
                          })()}

                          {/* Section 9: Footer Copy Form */}
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

            {/* ── 2B. PAGES & FAQS CONTENT MODE ── */}
            {category === 'pages' && (
              <div className="space-y-2">
                {filteredPages.map((pageSec) => {
                  const Icon = pageSec.icon
                  const isOpen = expandedSection === pageSec.id

                  return (
                    <div
                      key={pageSec.id}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isOpen
                          ? 'border-blue-950/20 bg-stone-50/40 shadow-sm ring-1 ring-blue-950/5'
                          : 'border-stone-200/80 bg-white hover:border-stone-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const next = isOpen ? null : pageSec.id
                          setExpandedSection(next)
                          if (next && pageSec.targetPage) {
                            setPreviewUrl(pageSec.targetPage)
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
                            <span className="text-xs font-bold text-blue-950 block truncate">{pageSec.label}</span>
                            <span className="text-[11px] text-stone-400 block truncate">{pageSec.desc}</span>
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
                          {/* Context banner */}
                          {SECTION_CONTEXT[pageSec.id] && (
                            <div className="flex items-start gap-2.5 p-3 bg-sky-950/5 border border-sky-950/10 rounded-xl">
                              <span className="text-base shrink-0 mt-0.5">📍</span>
                              <div>
                                <p className="text-[11px] font-bold text-blue-950">{SECTION_CONTEXT[pageSec.id].page}</p>
                                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{SECTION_CONTEXT[pageSec.id].where}</p>
                              </div>
                            </div>
                          )}

                          {/* 1. FAQs Manager */}
                          {pageSec.id === 'faqs' && (
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                                <span className="text-xs font-semibold text-stone-600">
                                  {getFaqsList().length} Questions Configured
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewUrl('/faqs')}
                                    className="text-[10px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg border border-sky-200/60 transition-colors"
                                  >
                                    Preview /faqs ↗
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleAddFaq}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-lg transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add FAQ</span>
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
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
                                          title="Move up"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleMoveFaq(idx, 1)}
                                          disabled={idx === getFaqsList().length - 1}
                                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                                          title="Move down"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteFaq(idx)}
                                          className="p-1 text-rose-500 hover:text-rose-700"
                                          title="Delete question"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <input
                                      type="text"
                                      value={faq.question}
                                      onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                                      placeholder="Frequently Asked Question..."
                                      className={inputClass}
                                    />
                                    <textarea
                                      rows={2}
                                      value={faq.answer}
                                      onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                                      placeholder="Clear and helpful answer..."
                                      className={textareaClass}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 2. Policies & Guarantees Form */}
                          {pageSec.id === 'policies' && (
                            <div className="space-y-4 pt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewUrl('/delivery')}
                                  className="text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200/60 transition-colors"
                                >
                                  Preview /delivery ↗
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPreviewUrl('/refund')}
                                  className="text-[11px] font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-colors"
                                >
                                  Preview /refund ↗
                                </button>
                              </div>

                              <Field label="Delivery Guarantees" hint="One bullet per line · Appears live on /delivery page">
                                <textarea
                                  rows={3}
                                  value={form.deliveryPolicy || ''}
                                  onChange={(e) => set('deliveryPolicy', e.target.value)}
                                  placeholder="Abuja & Lagos: 24–48 hours. Same-day dispatch on morning orders.&#10;Other states: 3–5 business days.&#10;Check the packaging before the driver leaves."
                                  className={textareaClass}
                                />
                              </Field>

                              <Field label="Return & Refund Terms" hint="One bullet per line · Appears live on /delivery and /refund pages">
                                <textarea
                                  rows={3}
                                  value={form.returnPolicy || ''}
                                  onChange={(e) => set('returnPolicy', e.target.value)}
                                  placeholder="7-day inspection window on factory-sealed items.&#10;Mattress polythene seal must remain intact for hygiene reasons.&#10;Immediate replacement if damaged in transit."
                                  className={textareaClass}
                                />
                              </Field>

                              <Field label="Factory Warranty Terms" hint="One bullet per line · Appears live on /delivery page">
                                <textarea
                                  rows={3}
                                  value={form.warrantyPolicy || ''}
                                  onChange={(e) => set('warrantyPolicy', e.target.value)}
                                  placeholder="100% authentic manufacturer warranty.&#10;Direct replacement on verified manufacturing defects.&#10;Official distributor coverage for Mouka & Vitafoam."
                                  className={textareaClass}
                                />
                              </Field>
                            </div>
                          )}

                          {/* 3. Contact & Socials Form */}
                          {pageSec.id === 'contact' && (
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => setPreviewUrl('/contact')}
                                  className="text-[10px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200/60 transition-colors"
                                >
                                  Preview /contact ↗
                                </button>
                              </div>
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
                              <Field label="WhatsApp Number (With country code)">
                                <input
                                  type="text"
                                  value={form.whatsappNumber || ''}
                                  onChange={(e) => set('whatsappNumber', e.target.value || null)}
                                  placeholder="2348012345678"
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

                          {/* 4. Bank Transfer Details Form */}
                          {pageSec.id === 'bank' && (
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
                                  label="Store logo"
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

                          {/* Custom Size Modal */}
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
