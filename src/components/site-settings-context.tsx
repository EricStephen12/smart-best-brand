'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'
import { DEFAULT_SITE_SETTINGS, type SiteSettingsData, isValidHexColor } from '@/lib/site-settings'

const SiteSettingsContext = createContext<SiteSettingsData>(DEFAULT_SITE_SETTINGS)

const PREVIEW_STORAGE_KEY = 'sbb_preview_site_settings'

export function SiteSettingsProvider({
    settings,
    children,
}: {
    settings: SiteSettingsData
    children: React.ReactNode
}) {
    const [currentSettings, setCurrentSettings] = useState<SiteSettingsData>(settings)
    const [, startTransition] = useTransition()

    // Sync if server-passed settings prop changes
    useEffect(() => {
        setCurrentSettings(settings)
    }, [settings])

    // Initialize from sessionStorage if inside iframe or preview mode
    useEffect(() => {
        if (typeof window === 'undefined') return

        try {
            const cached = sessionStorage.getItem(PREVIEW_STORAGE_KEY)
            if (cached) {
                const parsed = JSON.parse(cached)
                if (parsed && typeof parsed === 'object') {
                    setCurrentSettings((prev) => ({ ...prev, ...parsed }))
                }
            }
        } catch {
            // Ignore storage errors
        }

        // Notify parent customizer that iframe is mounted and ready for real-time sync
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({ type: 'SITE_SETTINGS_IFRAME_MOUNTED' }, '*')
            }
        } catch {}

        // Listen for real-time live preview updates from parent customizer
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'UPDATE_SITE_SETTINGS_PREVIEW' && event.data.settings) {
                startTransition(() => {
                    setCurrentSettings((prev) => ({ ...prev, ...event.data.settings }))
                })
                try {
                    sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(event.data.settings))
                } catch {}
            }

            if (event.data?.type === 'HIGHLIGHT_SECTION' && event.data.targetId) {
                highlightSection(event.data.targetId)
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    // Real-time CSS Custom Properties and Fonts injection
    useEffect(() => {
        if (typeof document === 'undefined') return

        const root = document.documentElement
        const primary = isValidHexColor(currentSettings.primaryColor)
            ? currentSettings.primaryColor.trim()
            : DEFAULT_SITE_SETTINGS.primaryColor
        const accent = isValidHexColor(currentSettings.accentColor)
            ? currentSettings.accentColor.trim()
            : DEFAULT_SITE_SETTINGS.accentColor
        const bg = isValidHexColor(currentSettings.backgroundColor)
            ? currentSettings.backgroundColor.trim()
            : DEFAULT_SITE_SETTINGS.backgroundColor

        const headingFont = currentSettings.headingFont || DEFAULT_SITE_SETTINGS.headingFont
        const bodyFont = currentSettings.bodyFont || DEFAULT_SITE_SETTINGS.bodyFont

        root.style.setProperty('--brand-primary', primary)
        root.style.setProperty('--brand-accent', accent)
        root.style.setProperty('--brand-bg', bg)
        root.style.setProperty('--font-heading', `'${headingFont}', Georgia, serif`)
        root.style.setProperty('--font-body', `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
        root.style.setProperty('--font-playfair', `'${headingFont}', Georgia, serif`)
        root.style.setProperty('--font-inter', `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)

        // Dynamically load Google Fonts if not already in document
        loadGoogleFont(headingFont)
        loadGoogleFont(bodyFont)
    }, [
        currentSettings.primaryColor,
        currentSettings.accentColor,
        currentSettings.backgroundColor,
        currentSettings.headingFont,
        currentSettings.bodyFont,
    ])

    return (
        <SiteSettingsContext.Provider value={currentSettings}>
            {children}
        </SiteSettingsContext.Provider>
    )
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext)
}

function highlightSection(targetId: string) {
    if (typeof document === 'undefined') return
    const el = document.getElementById(targetId)
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Inject temporary highlight animation styles if missing
    if (!document.getElementById('sbb-customizer-highlight-style')) {
        const style = document.createElement('style')
        style.id = 'sbb-customizer-highlight-style'
        style.innerHTML = `
            @keyframes sbbHighlightPulse {
                0% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.85); }
                50% { box-shadow: 0 0 0 8px rgba(2, 132, 199, 0.35); }
                100% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0); }
            }
            .sbb-customizer-highlight {
                animation: sbbHighlightPulse 1.8s ease-in-out !important;
                outline: 2px solid #0284c7 !important;
                outline-offset: 4px !important;
                transition: outline 0.3s ease;
            }
        `
        document.head.appendChild(style)
    }

    el.classList.add('sbb-customizer-highlight')
    setTimeout(() => {
        el.classList.remove('sbb-customizer-highlight')
    }, 2000)
}

function loadGoogleFont(fontName: string) {
    if (typeof document === 'undefined' || !fontName) return
    const id = `sbb-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`
    if (document.getElementById(id)) return

    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`
    document.head.appendChild(link)
}
