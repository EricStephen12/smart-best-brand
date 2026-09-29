'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { useState } from 'react'
import { X, Upload, Link as LinkIcon, Plus } from 'lucide-react'

interface CloudinaryUploadProps {
    value: string[] | string | null | undefined
    onChange: (value: string[]) => void
    maxFiles?: number
    label?: string
}

export default function CloudinaryUpload({
    value = [],
    onChange,
    maxFiles = 5,
    label = 'Upload Images'
}: CloudinaryUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [manualUrl, setManualUrl] = useState('')
    const [showManualInput, setShowManualInput] = useState(false)

    // Normalize value to an array of non-empty strings
    const urlList: string[] = Array.isArray(value)
        ? value.filter(Boolean)
        : typeof value === 'string' && value.trim()
        ? [value.trim()]
        : []

    const handleAddUrl = (newUrl: string) => {
        const clean = newUrl.trim()
        if (!clean) return
        if (urlList.includes(clean)) return
        const next = [...urlList, clean].slice(0, maxFiles)
        onChange(next)
        setManualUrl('')
        setShowManualInput(false)
    }

    const onUpload = (result: any) => {
        if (result.event !== 'success') return

        const newUrl = result.info?.secure_url
        if (newUrl) {
            handleAddUrl(newUrl)
        }
        setUploading(false)
    }

    const onRemove = (url: string) => {
        const next = urlList.filter((u) => u !== url)
        onChange(next)
    }

    const canUploadMore = urlList.length < maxFiles

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {label}
                </label>
                <div className="flex items-center gap-2">
                    {canUploadMore && (
                        <button
                            type="button"
                            onClick={() => setShowManualInput(!showManualInput)}
                            className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 uppercase tracking-wider"
                        >
                            <LinkIcon className="w-3 h-3" />
                            {showManualInput ? 'Hide URL' : 'Paste URL'}
                        </button>
                    )}
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                        {urlList.length} / {maxFiles}
                    </span>
                </div>
            </div>

            {/* Direct URL input fallback */}
            {showManualInput && canUploadMore && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <input
                        type="url"
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        placeholder="https://... or /images/..."
                        className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-600 text-slate-800 bg-white"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddUrl(manualUrl)
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => handleAddUrl(manualUrl)}
                        disabled={!manualUrl.trim()}
                        className="px-3 py-2 bg-blue-950 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                    </button>
                </div>
            )}

            {/* Thumbnails Previews */}
            {urlList.length > 0 && (
                <div className={`grid ${urlList.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'} gap-3`}>
                    {urlList.map((url, index) => (
                        <div
                            key={url + index}
                            className="relative group aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                        >
                            <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    // Fallback visual styling if image doesn't load
                                    (e.target as HTMLElement).style.opacity = '0.5'
                                }}
                            />
                            <div className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/50 transition-all flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => onRemove(url)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 rounded-full text-white hover:bg-red-700 active:scale-95 shadow-lg"
                                    title="Remove image"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-950/90 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {canUploadMore && (
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{
                        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                        maxFiles: maxFiles - urlList.length,
                    }}
                    onSuccess={(result) => onUpload(result)}
                    onOpen={() => setUploading(true)}
                    onClose={() => setUploading(false)}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            disabled={uploading}
                            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 sm:p-6 hover:border-sky-600 hover:bg-sky-50/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-left"
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center text-slate-500 group-hover:text-sky-600 transition-all shrink-0">
                                    {uploading ? (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-sky-600 animate-spin" />
                                    ) : (
                                        <Upload className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-0.5">
                                        {uploading ? 'Uploading to Cloudinary...' : 'Click to Upload Image'}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        PNG, JPG, WEBP • Or use &ldquo;Paste URL&rdquo; above
                                    </p>
                                </div>
                            </div>
                        </button>
                    )}
                </CldUploadWidget>
            )}

            {!canUploadMore && (
                <div className="text-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Maximum {maxFiles} {maxFiles === 1 ? 'image' : 'images'} reached
                    </p>
                </div>
            )}
        </div>
    )
}
