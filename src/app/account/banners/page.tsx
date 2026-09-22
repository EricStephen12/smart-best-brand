'use client'

import React, { useEffect, useState } from 'react'
import {
  createBanner, deleteBanner, getAllBanners, toggleBannerActive, updateBanner,
} from '@/actions/banners'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import toast from 'react-hot-toast'
import { Loader2, Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react'

const inputClass =
  'w-full px-4 py-3 border border-stone-200 rounded-xl text-sm outline-none focus:border-blue-950/50 focus:ring-2 focus:ring-blue-950/10 transition-all text-blue-950 bg-white'

type Banner = {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  ctaLabel: string | null
  ctaHref: string | null
  isActive: boolean
  sortOrder: number
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [ctaLabel, setCtaLabel] = useState('View Collection')
  const [ctaHref, setCtaHref] = useState('/products')
  const [sortOrder, setSortOrder] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSubtitle, setEditSubtitle] = useState('')
  const [editCtaLabel, setEditCtaLabel] = useState('')
  const [editCtaHref, setEditCtaHref] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])

  const load = async () => {
    setLoading(true)
    const result = await getAllBanners()
    if (result.success && result.data) setBanners(result.data)
    else toast.error(result.error || 'Failed to load banners')
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!images[0]) { toast.error('Upload a banner image'); return }
    setSaving(true)
    const result = await createBanner({
      title, subtitle, imageUrl: images[0], ctaLabel, ctaHref, sortOrder, isActive: true,
    })
    setSaving(false)
    if (!result.success) { toast.error(result.error || 'Failed to create banner'); return }
    toast.success('Banner created')
    setTitle(''); setSubtitle(''); setImages([])
    await load()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Hero Banners</h1>
        <p className="text-sm text-stone-500 mt-1">
          Full-bleed homepage hero slides. Multiple active banners rotate automatically.
        </p>
      </div>

      {/* Add banner form */}
      <form onSubmit={handleCreate} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">Add new banner</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline (e.g. Sleep Like It Matters)" className={inputClass} />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtext (optional)" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="Button label" className={inputClass} />
          <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)}
            placeholder="Button link (e.g. /products)" className={inputClass} />
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))}
            placeholder="Sort order (0 = first)" className={inputClass} />
        </div>
        <CloudinaryUpload value={images} onChange={setImages} maxFiles={1} label="Banner image" />
        <button type="submit" disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-950 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? 'Creating…' : 'Create banner'}
        </button>
      </form>

      {/* Banners list */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-sky-700" /></div>
        ) : banners.length === 0 ? (
          <p className="p-10 text-sm text-stone-500 text-center">No banners yet — create your first above.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {banners.map((banner) => (
              <li key={banner.id} className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl bg-stone-100 bg-cover bg-center shrink-0 border border-stone-200"
                    style={{ backgroundImage: `url(${banner.imageUrl})` }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-blue-950 truncate">{banner.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Sort: {banner.sortOrder} ·{' '}
                      <span className={banner.isActive ? 'text-emerald-600' : 'text-stone-400'}>
                        {banner.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={async () => {
                      const result = await toggleBannerActive(banner.id, !banner.isActive)
                      if (!result.success) toast.error(result.error || 'Failed')
                      else await load()
                    }}
                      className="p-2 border border-stone-200 rounded-xl text-stone-500 hover:text-blue-950 hover:border-stone-300 transition-colors"
                      title={banner.isActive ? 'Hide' : 'Show'}>
                      {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => {
                      setEditingId(editingId === banner.id ? null : banner.id)
                      setEditTitle(banner.title)
                      setEditSubtitle(banner.subtitle || '')
                      setEditCtaLabel(banner.ctaLabel || 'View Collection')
                      setEditCtaHref(banner.ctaHref || '/products')
                      setEditImages([banner.imageUrl])
                    }}
                      className="p-2 border border-stone-200 rounded-xl text-stone-500 hover:text-blue-950 hover:border-stone-300 transition-colors"
                      aria-label="Edit banner">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={async () => {
                      if (!confirm('Delete this banner?')) return
                      const result = await deleteBanner(banner.id)
                      if (!result.success) toast.error(result.error || 'Failed')
                      else { toast.success('Deleted'); await load() }
                    }}
                      className="p-2 border border-red-100 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingId === banner.id && (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
                    <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">Edit banner</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                        className={inputClass} placeholder="Headline" />
                      <input value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)}
                        className={inputClass} placeholder="Subtext" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={editCtaLabel} onChange={(e) => setEditCtaLabel(e.target.value)}
                        className={inputClass} placeholder="Button label" />
                      <input value={editCtaHref} onChange={(e) => setEditCtaHref(e.target.value)}
                        className={inputClass} placeholder="/products" />
                    </div>
                    <CloudinaryUpload value={editImages} onChange={setEditImages} maxFiles={1} label="Replace image" />
                    <div className="flex items-center gap-3 pt-1">
                      <button type="button" disabled={saving} onClick={async () => {
                        setSaving(true)
                        const result = await updateBanner(banner.id, {
                          title: editTitle, subtitle: editSubtitle || null,
                          ctaLabel: editCtaLabel || null, ctaHref: editCtaHref || null,
                          imageUrl: editImages[0] || banner.imageUrl,
                        })
                        setSaving(false)
                        if (!result.success) { toast.error(result.error || 'Failed to update'); return }
                        toast.success('Banner updated')
                        setEditingId(null)
                        await load()
                      }}
                        className="inline-flex items-center gap-2 bg-blue-950 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Save changes
                      </button>
                      <button type="button" onClick={() => setEditingId(null)}
                        className="px-5 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:border-stone-300 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
