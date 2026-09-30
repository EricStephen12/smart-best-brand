'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { useState } from 'react'
import { X, Upload, Link as LinkIcon, Plus, RefreshCw, Trash2, Check, Image as ImageIcon } from 'lucide-react'

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

    const handleAddUrl = (newUrl: string, replace = false) => {
        const clean = newUrl.trim()
        if (!clean) return
        if (maxFiles === 1 || replace) {
            onChange([clean])
        } else {
            if (urlList.includes(clean)) return
            const next = [...urlList, clean].slice(0, maxFiles)
            onChange(next)
        }
        setManualUrl('')
        setShowManualInput(false)
    }

    const onUpload = (result: any) => {
        if (result.event !== 'success') return

        const newUrl = result.info?.secure_url
        if (newUrl) {
            handleAddUrl(newUrl, maxFiles === 1)
        }
        setUploading(false)
    }

    const onRemove = (url: string) => {
        const next = urlList.filter((u) => u !== url)
        onChange(next)
    }

    const isSingle = maxFiles === 1

    return (
        <div className="space-y-3">
            {/* Header with label & helper */}
            <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {label}
                </label>
                {!isSingle && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {urlList.length} / {maxFiles} images
                    </span>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════
                SINGLE IMAGE MODE (MaxFiles === 1)
            ══════════════════════════════════════════════════════════ */}
            {isSingle ? (
                urlList.length > 0 ? (
                    /* Existing single image preview + explicit Change / Replace controls */
                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 space-y-3">
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group">
                            <img
                                src={urlList[0]}
                                alt="Active preview"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.opacity = '0.5'
                                }}
                            />
                            <div className="absolute top-2 left-2 bg-blue-950/90 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                                <ImageIcon className="w-3 h-3 text-sky-400" />
                                Current Active Photo
                            </div>
                        </div>

                        {/* Explicit replacement action buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                options={{
                                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                                    maxFiles: 1,
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
                                        className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-950 hover:bg-sky-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
                                        <span>{uploading ? 'Uploading...' : 'Change / Replace Photo'}</span>
                                    </button>
                                )}
                            </CldUploadWidget>

                            <button
                                type="button"
                                onClick={() => {
                                    setManualUrl(urlList[0] || '')
                                    setShowManualInput(!showManualInput)
                                }}
                                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                                title="Paste a custom image URL"
                            >
                                <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
                                <span>{showManualInput ? 'Hide URL' : 'Paste URL'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => onRemove(urlList[0])}
                                className="px-2.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                                title="Remove photo"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                            </button>
                        </div>

                        {/* Inline URL editor for replacing photo directly */}
                        {showManualInput && (
                            <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-2 mt-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                    Direct Photo URL
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="url"
                                        value={manualUrl}
                                        onChange={(e) => setManualUrl(e.target.value)}
                                        placeholder="https://... or /images/..."
                                        className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-600 text-slate-800 bg-slate-50"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddUrl(manualUrl, true)
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddUrl(manualUrl, true)}
                                        disabled={!manualUrl.trim()}
                                        className="px-3 py-2 bg-blue-950 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Update
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Empty single photo placeholder - ready to upload or paste */
                    <div className="space-y-2">
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            options={{
                                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                                maxFiles: 1,
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
                                    className="w-full border-2 border-dashed border-slate-300 hover:border-sky-600 bg-slate-50/70 hover:bg-sky-50/50 rounded-2xl p-6 transition-all disabled:opacity-50 text-center group cursor-pointer"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-sky-100 flex items-center justify-center text-slate-500 group-hover:text-sky-600 transition-all shadow-sm border border-slate-200/80">
                                            {uploading ? (
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-sky-600 animate-spin" />
                                            ) : (
                                                <Upload className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                                                {uploading ? 'Uploading to Cloudinary...' : 'Click to Upload Photo'}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                PNG, JPG, WEBP formats supported
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </CldUploadWidget>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setShowManualInput(!showManualInput)}
                                className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                            >
                                <LinkIcon className="w-3 h-3" />
                                {showManualInput ? 'Hide URL paste' : 'Or paste a photo URL'}
                            </button>
                        </div>

                        {showManualInput && (
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
                                            handleAddUrl(manualUrl, true)
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddUrl(manualUrl, true)}
                                    disabled={!manualUrl.trim()}
                                    className="px-3 py-2 bg-blue-950 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                )
            ) : (
                /* ══════════════════════════════════════════════════════════
                   MULTI-IMAGE MODE (MaxFiles > 1, e.g. Product Gallery)
                ══════════════════════════════════════════════════════════ */
                <div className="space-y-3">
                    <div className="flex items-center justify-end">
                        {urlList.length < maxFiles && (
                            <button
                                type="button"
                                onClick={() => setShowManualInput(!showManualInput)}
                                className="text-[11px] font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                            >
                                <LinkIcon className="w-3 h-3" />
                                {showManualInput ? 'Hide URL' : 'Paste Image URL'}
                            </button>
                        )}
                    </div>

                    {showManualInput && urlList.length < maxFiles && (
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

                    {urlList.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {urlList.map((url, index) => (
                                <div
                                    key={url + index}
                                    className="relative group aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                                >
                                    <img
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLElement).style.opacity = '0.5'
                                        }}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <button
                                            type="button"
                                            onClick={() => onRemove(url)}
                                            className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition-all active:scale-95"
                                            title="Delete image"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-blue-950/90 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                                            Cover
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {urlList.length < maxFiles ? (
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
                                    className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 sm:p-5 hover:border-sky-600 hover:bg-sky-50/50 transition-all disabled:opacity-50 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                            {uploading ? (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-sky-600 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                                                {uploading ? 'Uploading...' : 'Add More Photos'}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {maxFiles - urlList.length} slots remaining
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </CldUploadWidget>
                    ) : (
                        <div className="text-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Maximum {maxFiles} images reached
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
