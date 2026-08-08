'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import {
    DEFAULT_SITE_SETTINGS,
    isValidHexColor,
    type SiteSettingsData,
} from '@/lib/site-settings'

function toData(row: {
    id: string
    siteName: string
    tagline: string
    primaryColor: string
    accentColor: string
    backgroundColor: string
    heroTitle: string
    heroSubtitle: string
    heroCtaLabel: string
    heroCtaHref: string
    footerText: string
    contactEmail: string
    whatsappNumber: string | null
    supportPhone: string | null
}): SiteSettingsData {
    return {
        id: row.id,
        siteName: row.siteName,
        tagline: row.tagline,
        primaryColor: row.primaryColor,
        accentColor: row.accentColor,
        backgroundColor: row.backgroundColor,
        heroTitle: row.heroTitle,
        heroSubtitle: row.heroSubtitle,
        heroCtaLabel: row.heroCtaLabel,
        heroCtaHref: row.heroCtaHref,
        footerText: row.footerText,
        contactEmail: row.contactEmail,
        whatsappNumber: row.whatsappNumber,
        supportPhone: row.supportPhone,
    }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
    try {
        const existing = await prisma.siteSettings.findUnique({ where: { id: 'default' } })
        if (existing) return toData(existing)

        const created = await prisma.siteSettings.create({
            data: { id: 'default' },
        })
        return toData(created)
    } catch (error) {
        console.error('getSiteSettings error:', error)
        return DEFAULT_SITE_SETTINGS
    }
}

export async function updateSiteSettings(input: Partial<SiteSettingsData>) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' }
        }

        const colors = [
            input.primaryColor,
            input.accentColor,
            input.backgroundColor,
        ].filter(Boolean) as string[]

        for (const color of colors) {
            if (!isValidHexColor(color)) {
                return { success: false, error: `Invalid color: ${color}. Use hex like #172554` }
            }
        }

        if (input.heroCtaHref !== undefined) {
            const href = input.heroCtaHref.trim()
            if (href && !href.startsWith('/') && !href.startsWith('https://') && !href.startsWith('http://')) {
                return { success: false, error: 'Button link must start with / or https://' }
            }
            if (/^javascript:/i.test(href) || /^data:/i.test(href)) {
                return { success: false, error: 'Invalid button link' }
            }
        }

        const data = {
            siteName: input.siteName?.trim() || undefined,
            tagline: input.tagline?.trim() || undefined,
            primaryColor: input.primaryColor?.trim() || undefined,
            accentColor: input.accentColor?.trim() || undefined,
            backgroundColor: input.backgroundColor?.trim() || undefined,
            heroTitle: input.heroTitle?.trim() || undefined,
            heroSubtitle: input.heroSubtitle?.trim() || undefined,
            heroCtaLabel: input.heroCtaLabel?.trim() || undefined,
            heroCtaHref: input.heroCtaHref?.trim() || undefined,
            footerText: input.footerText?.trim() || undefined,
            contactEmail: input.contactEmail?.trim().toLowerCase() || undefined,
            whatsappNumber: input.whatsappNumber === undefined
                ? undefined
                : input.whatsappNumber?.replace(/\D/g, '') || null,
            supportPhone: input.supportPhone === undefined
                ? undefined
                : input.supportPhone?.trim() || null,
        }

        const updated = await prisma.siteSettings.upsert({
            where: { id: 'default' },
            create: {
                id: 'default',
                siteName: data.siteName || DEFAULT_SITE_SETTINGS.siteName,
                tagline: data.tagline || DEFAULT_SITE_SETTINGS.tagline,
                primaryColor: data.primaryColor || DEFAULT_SITE_SETTINGS.primaryColor,
                accentColor: data.accentColor || DEFAULT_SITE_SETTINGS.accentColor,
                backgroundColor: data.backgroundColor || DEFAULT_SITE_SETTINGS.backgroundColor,
                heroTitle: data.heroTitle || DEFAULT_SITE_SETTINGS.heroTitle,
                heroSubtitle: data.heroSubtitle || DEFAULT_SITE_SETTINGS.heroSubtitle,
                heroCtaLabel: data.heroCtaLabel || DEFAULT_SITE_SETTINGS.heroCtaLabel,
                heroCtaHref: data.heroCtaHref || DEFAULT_SITE_SETTINGS.heroCtaHref,
                footerText: data.footerText || DEFAULT_SITE_SETTINGS.footerText,
                contactEmail: data.contactEmail || DEFAULT_SITE_SETTINGS.contactEmail,
                whatsappNumber: data.whatsappNumber ?? null,
                supportPhone: data.supportPhone ?? null,
            },
            update: Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== undefined)
            ),
        })

        revalidatePath('/', 'layout')
        revalidatePath('/account/site')
        return { success: true, data: toData(updated) }
    } catch (error) {
        console.error('updateSiteSettings error:', error)
        return { success: false, error: 'Failed to save site settings' }
    }
}
