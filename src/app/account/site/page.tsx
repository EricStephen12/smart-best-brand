'use client'

import React, { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/actions/site-settings'
import type { SiteSettingsData } from '@/lib/site-settings'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import toast from 'react-hot-toast'
import {
    Loader2,
    Save,
    Sparkles,
    Palette,
    Megaphone,
    BookOpen,
    Image as ImageIcon,
    MapPin,
    Share2,
    CheckCircle2,
    Eye,
    Globe,
    Layers,
} from 'lucide-react'

type TabType = 'identity' | 'theme' | 'story' | 'promo' | 'contact' | 'footer'

const COLOR_PRESETS = [
    { name: 'Default Navy & Sky', primary: '#172554', accent: '#0284c7', bg: '#f7f6f3' },
    { name: 'Royal Midnight & Gold', primary: '#0f172a', accent: '#d97706', bg: '#fafaf9' },
    { name: 'Emerald Sanctuary', primary: '#064e3b', accent: '#10b981', bg: '#f4fbf7' },
    { name: 'Minimalist Noir', primary: '#18181b', accent: '#475569', bg: '#ffffff' },
]

export default function SiteSettingsAdminPage() {
    const [form, setForm] = useState<SiteSettingsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>('identity')

    useEffect(() => {
        void (async () => {
            setLoading(true)
            const data = await getSiteSettings()
            setForm(data)
            setLoading(false)
        })()
    }, [])

    const set = <K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) => {
        setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
    }

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!form) return
        setSaving(true)
        const result = await updateSiteSettings(form)
        setSaving(false)
        if (!result.success) {
            toast.error(result.error || 'Failed to save settings')
            return
        }
        if (result.data) setForm(result.data)
        toast.success('Site settings saved successfully!')
    }

    if (loading || !form) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-950" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Loading Store Customizer...
                </p>
            </div>
        )
    }

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'identity', label: 'Identity & Announcement', icon: Megaphone },
        { id: 'theme', label: 'Theme & Colors', icon: Palette },
        { id: 'story', label: 'Homepage Story', icon: BookOpen },
        { id: 'promo', label: 'Promo Banner', icon: ImageIcon },
        { id: 'contact', label: 'Location & Socials', icon: MapPin },
        { id: 'footer', label: 'Footer & Policies', icon: Layers },
    ]

    return (
        <div className="space-y-8 max-w-5xl pb-16 font-sans">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/50">
                            No-Code Store Customizer
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
                        Site Appearance & Content Studio
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                        Change brand colors, announcement banners, homepage copy, store addresses, and social channels without touching code.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors"
                    >
                        <Eye className="w-4 h-4 text-slate-500" />
                        View Live Store
                    </a>
                    <button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-blue-950 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-sky-800 transition-all shadow-md shadow-blue-950/10 disabled:opacity-60"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200/60">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                isActive
                                    ? 'bg-white text-blue-950 shadow-sm border border-stone-200/50'
                                    : 'text-slate-500 hover:text-blue-950 hover:bg-white/50'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Main Form */}
            <form onSubmit={handleSave} className="space-y-6">
                {/* ─────────────────────────────────────────────────────────────
                    TAB 1: IDENTITY & ANNOUNCEMENT BAR
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'identity' && (
                    <div className="space-y-6">
                        {/* Identity Card */}
                        <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <div>
                                <h2 className="text-base font-bold text-blue-950">Store Identity</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Your store name, tagline, and brand logo.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Site Name (Store Brand)">
                                    <input
                                        required
                                        value={form.siteName}
                                        onChange={(e) => set('siteName', e.target.value)}
                                        className={inputClass}
                                        placeholder="Smart Best Brands"
                                    />
                                </Field>

                                <Field label="Tagline">
                                    <input
                                        value={form.tagline}
                                        onChange={(e) => set('tagline', e.target.value)}
                                        className={inputClass}
                                        placeholder="Quality mattresses, pillows & furniture"
                                    />
                                </Field>
                            </div>

                            {/* Brand Logo Upload */}
                            <div className="pt-4 border-t border-stone-100 space-y-4">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Custom Brand Logo
                                    <span className="text-slate-400 font-normal ml-2">
                                        (Leave empty to use stylized brand typography)
                                    </span>
                                </label>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div>
                                        <CloudinaryUpload
                                            value={form.logoUrl ? [form.logoUrl] : []}
                                            onChange={(urls: string[]) => set('logoUrl', urls[urls.length - 1] || null)}
                                            maxFiles={1}
                                            label="Upload Logo Image"
                                        />
                                        <div className="mt-3">
                                            <input
                                                type="url"
                                                value={form.logoUrl || ''}
                                                onChange={(e) => set('logoUrl', e.target.value || null)}
                                                className={inputClass}
                                                placeholder="Or paste external logo image URL..."
                                            />
                                        </div>
                                    </div>

                                    {/* Preview Box */}
                                    <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[140px] text-center border border-slate-800">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            Header Preview
                                        </span>
                                        {form.logoUrl ? (
                                            <img
                                                src={form.logoUrl}
                                                alt={form.siteName}
                                                className="h-10 max-w-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-white font-black text-lg tracking-widest font-sans">
                                                {form.siteName.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Announcement Bar Card */}
                        <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-blue-950">Top Announcement Bar</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Display a promotional banner across the very top of all pages.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.announcementEnabled}
                                        onChange={(e) => set('announcementEnabled', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                                    <span className="ml-3 text-xs font-bold text-slate-700">
                                        {form.announcementEnabled ? 'Active' : 'Hidden'}
                                    </span>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <Field label="Announcement Message">
                                    <input
                                        value={form.announcementText || ''}
                                        onChange={(e) => set('announcementText', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Free delivery nationwide on orders above ₦150,000 | 100% Genuine Brands"
                                    />
                                </Field>

                                <Field label="Banner Link (Optional)">
                                    <input
                                        value={form.announcementLink || ''}
                                        onChange={(e) => set('announcementLink', e.target.value || null)}
                                        className={inputClass}
                                        placeholder="e.g. /products or /products?category=Mattresses"
                                    />
                                </Field>
                            </div>

                            {form.announcementEnabled && form.announcementText && (
                                <div className="p-3 rounded-xl bg-blue-950 text-white text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
                                    <span>{form.announcementText}</span>
                                    {form.announcementLink && (
                                        <span className="underline opacity-75 font-normal text-[10px]">
                                            Learn more &rarr;
                                        </span>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 2: THEME & COLORS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'theme' && (
                    <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                        <div>
                            <h2 className="text-base font-bold text-blue-950">Store Theme Colors</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Customize your brand palette. Colors automatically apply to buttons, headers, and backgrounds.
                            </p>
                        </div>

                        {/* Quick Presets */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-700">Curated Color Palettes:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {COLOR_PRESETS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => {
                                            set('primaryColor', preset.primary)
                                            set('accentColor', preset.accent)
                                            set('backgroundColor', preset.bg)
                                            toast.success(`Applied ${preset.name}`)
                                        }}
                                        className="p-3 rounded-2xl border border-stone-200 hover:border-sky-500 bg-stone-50/60 text-left transition-all group"
                                    >
                                        <div className="flex gap-1.5 mb-2">
                                            <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: preset.primary }} />
                                            <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: preset.accent }} />
                                            <div className="w-6 h-6 rounded-full shadow-sm border border-stone-300" style={{ backgroundColor: preset.bg }} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700 group-hover:text-sky-700">
                                            {preset.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Individual Pickers */}
                        <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <ColorField
                                label="Primary Brand Color"
                                description="Navigation, dark buttons & accents"
                                value={form.primaryColor}
                                onChange={(v) => set('primaryColor', v)}
                            />
                            <ColorField
                                label="Accent / Action Color"
                                description="Highlighted badges & links"
                                value={form.accentColor}
                                onChange={(v) => set('accentColor', v)}
                            />
                            <ColorField
                                label="Page Background Color"
                                description="Body background tone"
                                value={form.backgroundColor}
                                onChange={(v) => set('backgroundColor', v)}
                            />
                        </div>
                    </section>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 3: HOMEPAGE STORY SECTION
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'story' && (
                    <div className="space-y-6">
                        <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <div>
                                <h2 className="text-base font-bold text-blue-950">Homepage Story ("Our Legacy" Section)</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Control the primary brand narrative displayed prominently on your storefront homepage.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Story Badge Label">
                                    <input
                                        value={form.storyBadge}
                                        onChange={(e) => set('storyBadge', e.target.value)}
                                        className={inputClass}
                                        placeholder="Our Legacy"
                                    />
                                </Field>
                                <Field label="Story Headline">
                                    <input
                                        value={form.storyTitle}
                                        onChange={(e) => set('storyTitle', e.target.value)}
                                        className={inputClass}
                                        placeholder="Authenticity as a Standard."
                                    />
                                </Field>
                            </div>

                            <Field label="Story Narrative Paragraph">
                                <textarea
                                    rows={4}
                                    value={form.storyText}
                                    onChange={(e) => set('storyText', e.target.value)}
                                    className={inputClass}
                                    placeholder="Explain your brand mission and quality standards..."
                                />
                            </Field>

                            {/* Story Image */}
                            <div className="pt-4 border-t border-stone-100 space-y-4">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Main Story Featured Image
                                </label>
                                <CloudinaryUpload
                                    value={form.storyImageUrl ? [form.storyImageUrl] : []}
                                    onChange={(urls: string[]) => set('storyImageUrl', urls[urls.length - 1] || null)}
                                    maxFiles={1}
                                    label="Upload Story Section Image"
                                />
                                <input
                                    type="url"
                                    value={form.storyImageUrl || ''}
                                    onChange={(e) => set('storyImageUrl', e.target.value || null)}
                                    className={inputClass}
                                    placeholder="Or paste image URL (default: /images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg)"
                                />
                            </div>
                        </section>

                        {/* Secondary Promise Section */}
                        <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <div>
                                <h2 className="text-base font-bold text-blue-950">Secondary Craftsmanship Story</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    The companion section highlighting your materials, warranty, and brand partnerships.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Secondary Badge">
                                    <input
                                        value={form.storySecondaryBadge}
                                        onChange={(e) => set('storySecondaryBadge', e.target.value)}
                                        className={inputClass}
                                        placeholder="Craftsmanship / Our Promise"
                                    />
                                </Field>
                                <Field label="Secondary Headline">
                                    <input
                                        value={form.storySecondaryTitle}
                                        onChange={(e) => set('storySecondaryTitle', e.target.value)}
                                        className={inputClass}
                                        placeholder="Engineered for Nigerian Living."
                                    />
                                </Field>
                            </div>

                            <Field label="Secondary Paragraph">
                                <textarea
                                    rows={3}
                                    value={form.storySecondaryText}
                                    onChange={(e) => set('storySecondaryText', e.target.value)}
                                    className={inputClass}
                                    placeholder="Details about manufacturer warranties and trusted foam partnerships..."
                                />
                            </Field>
                        </section>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 4: MID-PAGE PROMO BANNER
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'promo' && (
                    <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                        <div>
                            <h2 className="text-base font-bold text-blue-950">Mid-Page Promo Banner</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                The full-bleed call-to-action banner situated midway down the homepage.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Banner Badge">
                                <input
                                    value={form.promoBadge}
                                    onChange={(e) => set('promoBadge', e.target.value)}
                                    className={inputClass}
                                    placeholder="For Nigerian homes"
                                />
                            </Field>
                            <Field label="Banner Headline">
                                <input
                                    value={form.promoTitle}
                                    onChange={(e) => set('promoTitle', e.target.value)}
                                    className={inputClass}
                                    placeholder="Comfort that feels like home"
                                />
                            </Field>
                            <Field label="Button Label">
                                <input
                                    value={form.promoCtaLabel}
                                    onChange={(e) => set('promoCtaLabel', e.target.value)}
                                    className={inputClass}
                                    placeholder="Discover now"
                                />
                            </Field>
                            <Field label="Button Link">
                                <input
                                    value={form.promoCtaHref}
                                    onChange={(e) => set('promoCtaHref', e.target.value)}
                                    className={inputClass}
                                    placeholder="/products"
                                />
                            </Field>
                        </div>

                        {/* Banner Image */}
                        <div className="pt-4 border-t border-stone-100 space-y-4">
                            <label className="block text-xs font-semibold text-slate-700">
                                Background Banner Image
                            </label>
                            <CloudinaryUpload
                                value={form.promoImageUrl ? [form.promoImageUrl] : []}
                                onChange={(urls: string[]) => set('promoImageUrl', urls[urls.length - 1] || null)}
                                maxFiles={1}
                                label="Upload Promo Background"
                            />
                            <input
                                type="url"
                                value={form.promoImageUrl || ''}
                                onChange={(e) => set('promoImageUrl', e.target.value || null)}
                                className={inputClass}
                                placeholder="Or paste background image URL..."
                            />
                        </div>
                    </section>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 5: LOCATION, CONTACT & SOCIALS
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <div>
                                <h2 className="text-base font-bold text-blue-950">Store Locations & Channels</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Physical showrooms and customer service touchpoints.
                                </p>
                            </div>

                            <Field label="Physical Store Locations (Cities or Full Address)">
                                <input
                                    value={form.storeAddress}
                                    onChange={(e) => set('storeAddress', e.target.value)}
                                    className={inputClass}
                                    placeholder="e.g. Abuja · Benin City · Lagos"
                                />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field label="Official Contact Email">
                                    <input
                                        type="email"
                                        required
                                        value={form.contactEmail}
                                        onChange={(e) => set('contactEmail', e.target.value)}
                                        className={inputClass}
                                        placeholder="hello@smartbestbrands.com"
                                    />
                                </Field>
                                <Field label="WhatsApp Business (digits only)">
                                    <input
                                        value={form.whatsappNumber || ''}
                                        onChange={(e) => set('whatsappNumber', e.target.value || null)}
                                        className={inputClass}
                                        placeholder="e.g. 2348012345678"
                                    />
                                </Field>
                                <Field label="Customer Support Phone">
                                    <input
                                        value={form.supportPhone || ''}
                                        onChange={(e) => set('supportPhone', e.target.value || null)}
                                        className={inputClass}
                                        placeholder="e.g. +234 800 000 0000"
                                    />
                                </Field>
                            </div>
                        </section>

                        {/* Social Media Links */}
                        <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                            <div>
                                <h2 className="text-base font-bold text-blue-950">Social Media Profiles</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Links shown in your storefront footer and contact pages.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Instagram Profile URL">
                                    <input
                                        type="url"
                                        value={form.instagramUrl || ''}
                                        onChange={(e) => set('instagramUrl', e.target.value || null)}
                                        className={inputClass}
                                        placeholder="https://instagram.com/smartbestbrands"
                                    />
                                </Field>
                                <Field label="Facebook Page URL">
                                    <input
                                        type="url"
                                        value={form.facebookUrl || ''}
                                        onChange={(e) => set('facebookUrl', e.target.value || null)}
                                        className={inputClass}
                                        placeholder="https://facebook.com/smartbestbrands"
                                    />
                                </Field>
                                <Field label="Twitter / X Profile URL">
                                    <input
                                        type="url"
                                        value={form.twitterUrl || ''}
                                        onChange={(e) => set('twitterUrl', e.target.value || null)}
                                        className={inputClass}
                                        placeholder="https://x.com/smartbestbrands"
                                    />
                                </Field>
                                <Field label="TikTok Profile URL">
                                    <input
                                        type="url"
                                        value={form.tiktokUrl || ''}
                                        onChange={(e) => set('tiktokUrl', e.target.value || null)}
                                        className={inputClass}
                                        placeholder="https://tiktok.com/@smartbestbrands"
                                    />
                                </Field>
                            </div>
                        </section>
                    </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    TAB 6: FOOTER & POLICIES
                ───────────────────────────────────────────────────────────── */}
                {activeTab === 'footer' && (
                    <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                        <div>
                            <h2 className="text-base font-bold text-blue-950">Footer Description</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Brief introductory summary displayed beneath your logo in the website footer.
                            </p>
                        </div>

                        <Field label="Footer Description Text">
                            <textarea
                                rows={4}
                                value={form.footerText}
                                onChange={(e) => set('footerText', e.target.value)}
                                className={inputClass}
                                placeholder="Authentic comfort for Nigerian homes. Quality mattresses, pillows, and furniture from trusted brands."
                            />
                        </Field>
                    </section>
                )}

                {/* Bottom Save Bar */}
                <div className="pt-6 border-t border-stone-200/80 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                        Changes will be published immediately across the storefront.
                    </p>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-blue-950 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-sky-800 transition-all shadow-md shadow-blue-950/10 disabled:opacity-60"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving changes...' : 'Save All Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

const inputClass =
    'w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all text-blue-950 bg-white'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">{label}</span>
            {children}
        </label>
    )
}

function ColorField({
    label,
    description,
    value,
    onChange,
}: {
    label: string
    description: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="space-y-2">
            <div>
                <span className="text-xs font-semibold text-slate-700 block">{label}</span>
                <span className="text-[11px] text-slate-400 block">{description}</span>
            </div>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={/^#([0-9A-Fa-f]{6})$/.test(value) ? value : '#172554'}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 w-14 rounded-xl border border-stone-200 cursor-pointer bg-white p-1 shadow-sm"
                />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClass}
                    placeholder="#172554"
                />
            </div>
        </div>
    )
}
