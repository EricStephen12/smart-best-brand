'use client'

import React, { useEffect, useState } from 'react'
import {
    createBanner,
    deleteBanner,
    getAllBanners,
    toggleBannerActive,
    updateBanner,
} from '@/actions/banners'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import toast from 'react-hot-toast'
import { Loader2, Pencil, Trash2 } from 'lucide-react'

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

    useEffect(() => {
        void load()
    }, [])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!images[0]) {
            toast.error('Upload a banner image')
            return
        }
        setSaving(true)
        const result = await createBanner({
            title,
            subtitle,
            imageUrl: images[0],
            ctaLabel,
            ctaHref,
            sortOrder,
            isActive: true,
        })
        setSaving(false)
        if (!result.success) {
            toast.error(result.error || 'Failed to create banner')
            return
        }
        toast.success('Banner created')
        setTitle('')
        setSubtitle('')
        setImages([])
        await load()
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-blue-950">Homepage banners</h1>
                <p className="text-sm text-stone-500 mt-1">
                    Homepage full-bleed hero slides. Show, hide, edit image and button. Multiple active banners rotate.
                </p>
            </div>

            <form onSubmit={handleCreate} className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-blue-950">Add banner</h2>
                <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-sky-500"
                />
                <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Subtitle (optional)"
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-sky-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                        value={ctaLabel}
                        onChange={(e) => setCtaLabel(e.target.value)}
                        placeholder="Button label"
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-sky-500"
                    />
                    <input
                        value={ctaHref}
                        onChange={(e) => setCtaHref(e.target.value)}
                        placeholder="/products"
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-sky-500"
                    />
                    <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                        placeholder="Sort order"
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-sky-500"
                    />
                </div>
                <CloudinaryUpload value={images} onChange={setImages} maxFiles={1} label="Banner image" />
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2.5 bg-blue-950 text-white text-sm font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50"
                >
                    {saving ? 'Saving…' : 'Create banner'}
                </button>
            </form>

            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-sky-700" />
                    </div>
                ) : banners.length === 0 ? (
                    <p className="p-8 text-sm text-stone-500 text-center">No banners yet</p>
                ) : (
                    <ul className="divide-y divide-stone-100">
                        {banners.map((banner) => (
                            <li key={banner.id} className="p-4 space-y-3">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-24 h-16 rounded-lg bg-stone-100 bg-cover bg-center shrink-0"
                                        style={{ backgroundImage: `url(${banner.imageUrl})` }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-blue-950 truncate">{banner.title}</p>
                                        <p className="text-xs text-stone-500">
                                            Order {banner.sortOrder} · {banner.isActive ? 'Active' : 'Hidden'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const result = await toggleBannerActive(banner.id, !banner.isActive)
                                            if (!result.success) toast.error(result.error || 'Failed')
                                            else await load()
                                        }}
                                        className="text-xs font-medium px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-50"
                                    >
                                        {banner.isActive ? 'Hide' : 'Show'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(editingId === banner.id ? null : banner.id)
                                            setEditTitle(banner.title)
                                            setEditSubtitle(banner.subtitle || '')
                                            setEditCtaLabel(banner.ctaLabel || 'View Collection')
                                            setEditCtaHref(banner.ctaHref || '/products')
                                            setEditImages([banner.imageUrl])
                                        }}
                                        className="p-2 text-blue-950 hover:bg-stone-50 rounded-lg"
                                        aria-label="Edit banner"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!confirm('Delete this banner?')) return
                                            const result = await deleteBanner(banner.id)
                                            if (!result.success) toast.error(result.error || 'Failed')
                                            else {
                                                toast.success('Deleted')
                                                await load()
                                            }
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {editingId === banner.id ? (
                                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
                                        <input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white"
                                            placeholder="Title"
                                        />
                                        <input
                                            value={editSubtitle}
                                            onChange={(e) => setEditSubtitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white"
                                            placeholder="Subtitle"
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                value={editCtaLabel}
                                                onChange={(e) => setEditCtaLabel(e.target.value)}
                                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white"
                                                placeholder="Button label"
                                            />
                                            <input
                                                value={editCtaHref}
                                                onChange={(e) => setEditCtaHref(e.target.value)}
                                                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white"
                                                placeholder="/products"
                                            />
                                        </div>
                                        <CloudinaryUpload
                                            value={editImages}
                                            onChange={setEditImages}
                                            maxFiles={1}
                                            label="Replace image"
                                        />
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={async () => {
                                                setSaving(true)
                                                const result = await updateBanner(banner.id, {
                                                    title: editTitle,
                                                    subtitle: editSubtitle || null,
                                                    ctaLabel: editCtaLabel || null,
                                                    ctaHref: editCtaHref || null,
                                                    imageUrl: editImages[0] || banner.imageUrl,
                                                })
                                                setSaving(false)
                                                if (!result.success) {
                                                    toast.error(result.error || 'Failed to update')
                                                    return
                                                }
                                                toast.success('Banner updated')
                                                setEditingId(null)
                                                await load()
                                            }}
                                            className="px-4 py-2 bg-blue-950 text-white text-sm font-medium rounded-lg hover:bg-sky-700"
                                        >
                                            Save changes
                                        </button>
                                    </div>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
