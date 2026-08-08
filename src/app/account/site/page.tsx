'use client'

import React, { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/actions/site-settings'
import type { SiteSettingsData } from '@/lib/site-settings'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function SiteSettingsAdminPage() {
    const [form, setForm] = useState<SiteSettingsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form) return
        setSaving(true)
        const result = await updateSiteSettings(form)
        setSaving(false)
        if (!result.success) {
            toast.error(result.error || 'Failed to save')
            return
        }
        if (result.data) setForm(result.data)
        toast.success('Site settings saved')
    }

    if (loading || !form) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-blue-950" />
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-2xl font-semibold text-blue-950">Site appearance</h1>
                <p className="text-sm text-stone-500 mt-1">
                    Change brand colors, homepage copy, and contact details without editing code.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-blue-950">Brand</h2>
                    <Field label="Site name">
                        <input
                            required
                            value={form.siteName}
                            onChange={(e) => set('siteName', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Tagline">
                        <input
                            value={form.tagline}
                            onChange={(e) => set('tagline', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ColorField
                            label="Primary"
                            value={form.primaryColor}
                            onChange={(v) => set('primaryColor', v)}
                        />
                        <ColorField
                            label="Accent"
                            value={form.accentColor}
                            onChange={(v) => set('accentColor', v)}
                        />
                        <ColorField
                            label="Background"
                            value={form.backgroundColor}
                            onChange={(v) => set('backgroundColor', v)}
                        />
                    </div>
                </section>

                <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-blue-950">Footer & contact</h2>
                    <Field label="Footer text">
                        <textarea
                            rows={3}
                            value={form.footerText}
                            onChange={(e) => set('footerText', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Contact email">
                        <input
                            type="email"
                            value={form.contactEmail}
                            onChange={(e) => set('contactEmail', e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="WhatsApp (digits, e.g. 2348012345678)">
                            <input
                                value={form.whatsappNumber || ''}
                                onChange={(e) => set('whatsappNumber', e.target.value || null)}
                                className={inputClass}
                                placeholder="Uses env if empty"
                            />
                        </Field>
                        <Field label="Support phone">
                            <input
                                value={form.supportPhone || ''}
                                onChange={(e) => set('supportPhone', e.target.value || null)}
                                className={inputClass}
                                placeholder="Uses env if empty"
                            />
                        </Field>
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-blue-950 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 disabled:opacity-60"
                >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save changes
                </button>
            </form>
        </div>
    )
}

const inputClass =
    'w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm outline-none focus:border-sky-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-medium text-stone-500">{label}</span>
            {children}
        </label>
    )
}

function ColorField({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <Field label={label}>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={/^#([0-9A-Fa-f]{6})$/.test(value) ? value : '#172554'}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-12 rounded border border-stone-200 cursor-pointer bg-white"
                />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClass}
                    placeholder="#172554"
                />
            </div>
        </Field>
    )
}
