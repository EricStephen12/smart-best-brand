'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { useState } from 'react'
import Image from 'next/image'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

interface CloudinaryUploadProps {
    value: string[]
    onChange: (value: any) => void
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

    const onUpload = (result: any) => {
        if (result.event !== 'success') return;

        const newUrl = result.info?.secure_url;

        if (newUrl) {
            // Fix race condition: Use functional update to append new URL to the latest state
            onChange((prev: string[]) => {
                const current = Array.isArray(prev) ? prev : [];
                if (current.includes(newUrl)) return current;
                return [...current, newUrl];
            });
        }
        setUploading(false);
    }

    const onRemove = (url: string) => {
        onChange(value.filter(u => u !== url))
    }

    const canUploadMore = value.length < maxFiles

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                    {label}
                </label>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    {value.length} / {maxFiles}
                </span>
            </div>

            {/* Massive Premium Previews */}
            {value.length > 0 && (
                <div className="grid grid-cols-1 gap-8">
                    {value.map((url, index) => (
                        <div key={url} className="relative group aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-slate-200 shadow-2xl">
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => console.error('Image failing to load:', url)}
                            />
                            <div className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/60 transition-all flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => onRemove(url)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 rounded-full text-white hover:bg-red-600 active:scale-90"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-sky-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
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
                        maxFiles: maxFiles
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
                            className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-sky-600 hover:bg-sky-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="flex flex-col items-center gap-4">
                                {uploading ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-sky-600 animate-spin" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                            Uploading...
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-sky-100 flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-all">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-blue-950 uppercase tracking-widest mb-1">
                                                Click to Upload
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                PNG, JPG, WEBP up to 10MB
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
                </CldUploadWidget>
            )}

            {!canUploadMore && (
                <div className="text-center p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                        Maximum {maxFiles} images reached
                    </p>
                </div>
            )}
        </div>
    )
}
