'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'
import {
    DEFAULT_SITE_SETTINGS,
    isValidHexColor,
    type SiteSettingsData,
} from '@/lib/site-settings'

function toData(row: any): SiteSettingsData {
    return {
        id: row.id,
        siteName: row.siteName || DEFAULT_SITE_SETTINGS.siteName,
        tagline: row.tagline || DEFAULT_SITE_SETTINGS.tagline,
        logoUrl: row.logoUrl || null,
        primaryColor: row.primaryColor || DEFAULT_SITE_SETTINGS.primaryColor,
        accentColor: row.accentColor || DEFAULT_SITE_SETTINGS.accentColor,
        backgroundColor: row.backgroundColor || DEFAULT_SITE_SETTINGS.backgroundColor,

        announcementEnabled: Boolean(row.announcementEnabled),
        announcementText: row.announcementText ?? DEFAULT_SITE_SETTINGS.announcementText,
        announcementLink: row.announcementLink ?? DEFAULT_SITE_SETTINGS.announcementLink,

        heroTitle: row.heroTitle || DEFAULT_SITE_SETTINGS.heroTitle,
        heroSubtitle: row.heroSubtitle || DEFAULT_SITE_SETTINGS.heroSubtitle,
        heroCtaLabel: row.heroCtaLabel || DEFAULT_SITE_SETTINGS.heroCtaLabel,
        heroCtaHref: row.heroCtaHref || DEFAULT_SITE_SETTINGS.heroCtaHref,

        storyBadge: row.storyBadge || DEFAULT_SITE_SETTINGS.storyBadge,
        storyTitle: row.storyTitle || DEFAULT_SITE_SETTINGS.storyTitle,
        storyText: row.storyText || DEFAULT_SITE_SETTINGS.storyText,
        storySecondaryBadge: row.storySecondaryBadge || DEFAULT_SITE_SETTINGS.storySecondaryBadge,
        storySecondaryTitle: row.storySecondaryTitle || DEFAULT_SITE_SETTINGS.storySecondaryTitle,
        storySecondaryText: row.storySecondaryText || DEFAULT_SITE_SETTINGS.storySecondaryText,
        storyImageUrl: row.storyImageUrl || null,

        promoBadge: row.promoBadge || DEFAULT_SITE_SETTINGS.promoBadge,
        promoTitle: row.promoTitle || DEFAULT_SITE_SETTINGS.promoTitle,
        promoCtaLabel: row.promoCtaLabel || DEFAULT_SITE_SETTINGS.promoCtaLabel,
        promoCtaHref: row.promoCtaHref || DEFAULT_SITE_SETTINGS.promoCtaHref,
        promoImageUrl: row.promoImageUrl || null,

        storeAddress: row.storeAddress || DEFAULT_SITE_SETTINGS.storeAddress,
        contactEmail: row.contactEmail || DEFAULT_SITE_SETTINGS.contactEmail,
        whatsappNumber: row.whatsappNumber || null,
        supportPhone: row.supportPhone || null,
        instagramUrl: row.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl,
        facebookUrl: row.facebookUrl || null,
        twitterUrl: row.twitterUrl || null,
        tiktokUrl: row.tiktokUrl || null,

        footerText: row.footerText || DEFAULT_SITE_SETTINGS.footerText,
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
            return { success: false, error: 'Unauthorized: Admin privileges required' }
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

        const cleanLink = (link?: string | null) => {
            if (!link) return null
            const trimmed = link.trim()
            if (!trimmed) return null
            return trimmed
        }

        const data: Record<string, any> = {}

        if (input.siteName !== undefined) data.siteName = input.siteName.trim() || DEFAULT_SITE_SETTINGS.siteName
        if (input.tagline !== undefined) data.tagline = input.tagline.trim()
        if (input.logoUrl !== undefined) data.logoUrl = cleanLink(input.logoUrl)
        if (input.primaryColor !== undefined) data.primaryColor = input.primaryColor.trim()
        if (input.accentColor !== undefined) data.accentColor = input.accentColor.trim()
        if (input.backgroundColor !== undefined) data.backgroundColor = input.backgroundColor.trim()

        if (input.announcementEnabled !== undefined) data.announcementEnabled = Boolean(input.announcementEnabled)
        if (input.announcementText !== undefined) data.announcementText = input.announcementText?.trim() || null
        if (input.announcementLink !== undefined) data.announcementLink = cleanLink(input.announcementLink)

        if (input.heroTitle !== undefined) data.heroTitle = input.heroTitle.trim()
        if (input.heroSubtitle !== undefined) data.heroSubtitle = input.heroSubtitle.trim()
        if (input.heroCtaLabel !== undefined) data.heroCtaLabel = input.heroCtaLabel.trim()
        if (input.heroCtaHref !== undefined) data.heroCtaHref = cleanLink(input.heroCtaHref) || '/products'

        if (input.storyBadge !== undefined) data.storyBadge = input.storyBadge.trim()
        if (input.storyTitle !== undefined) data.storyTitle = input.storyTitle.trim()
        if (input.storyText !== undefined) data.storyText = input.storyText.trim()
        if (input.storySecondaryBadge !== undefined) data.storySecondaryBadge = input.storySecondaryBadge.trim()
        if (input.storySecondaryTitle !== undefined) data.storySecondaryTitle = input.storySecondaryTitle.trim()
        if (input.storySecondaryText !== undefined) data.storySecondaryText = input.storySecondaryText.trim()
        if (input.storyImageUrl !== undefined) data.storyImageUrl = cleanLink(input.storyImageUrl)

        if (input.promoBadge !== undefined) data.promoBadge = input.promoBadge.trim()
        if (input.promoTitle !== undefined) data.promoTitle = input.promoTitle.trim()
        if (input.promoCtaLabel !== undefined) data.promoCtaLabel = input.promoCtaLabel.trim()
        if (input.promoCtaHref !== undefined) data.promoCtaHref = cleanLink(input.promoCtaHref) || '/products'
        if (input.promoImageUrl !== undefined) data.promoImageUrl = cleanLink(input.promoImageUrl)

        if (input.storeAddress !== undefined) data.storeAddress = input.storeAddress.trim()
        if (input.contactEmail !== undefined) data.contactEmail = input.contactEmail.trim().toLowerCase()
        if (input.whatsappNumber !== undefined) {
            data.whatsappNumber = input.whatsappNumber?.replace(/\D/g, '') || null
        }
        if (input.supportPhone !== undefined) data.supportPhone = input.supportPhone?.trim() || null

        if (input.instagramUrl !== undefined) data.instagramUrl = cleanLink(input.instagramUrl)
        if (input.facebookUrl !== undefined) data.facebookUrl = cleanLink(input.facebookUrl)
        if (input.twitterUrl !== undefined) data.twitterUrl = cleanLink(input.twitterUrl)
        if (input.tiktokUrl !== undefined) data.tiktokUrl = cleanLink(input.tiktokUrl)

        if (input.footerText !== undefined) data.footerText = input.footerText.trim()

        const updated = await prisma.siteSettings.upsert({
            where: { id: 'default' },
            create: {
                id: 'default',
                ...data,
            },
            update: data,
        })

        revalidatePath('/', 'layout')
        revalidatePath('/account/site')
        return { success: true, data: toData(updated) }
    } catch (error) {
        console.error('updateSiteSettings error:', error)
        return { success: false, error: 'Failed to save site settings' }
    }
}
