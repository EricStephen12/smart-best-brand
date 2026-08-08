'use client'

import React, { createContext, useContext } from 'react'
import { DEFAULT_SITE_SETTINGS, type SiteSettingsData } from '@/lib/site-settings'

const SiteSettingsContext = createContext<SiteSettingsData>(DEFAULT_SITE_SETTINGS)

export function SiteSettingsProvider({
    settings,
    children,
}: {
    settings: SiteSettingsData
    children: React.ReactNode
}) {
    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    )
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext)
}
