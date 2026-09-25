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
        headingFont: row.headingFont || DEFAULT_SITE_SETTINGS.headingFont,
        bodyFont: row.bodyFont || DEFAULT_SITE_SETTINGS.bodyFont,

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
        bankName: row.bankName || null,
        bankAccountName: row.bankAccountName || null,
        bankAccountNumber: row.bankAccountNumber || null,

        shopPageTitle: row.shopPageTitle || DEFAULT_SITE_SETTINGS.shopPageTitle,
        shopPageTagline: row.shopPageTagline || DEFAULT_SITE_SETTINGS.shopPageTagline,

        statOneBadge: row.statOneBadge || DEFAULT_SITE_SETTINGS.statOneBadge,
        statOneValue: row.statOneValue ?? DEFAULT_SITE_SETTINGS.statOneValue,
        statTwoBadge: row.statTwoBadge || DEFAULT_SITE_SETTINGS.statTwoBadge,
        statTwoValue: row.statTwoValue || DEFAULT_SITE_SETTINGS.statTwoValue,
        storyLinkLabel: row.storyLinkLabel || DEFAULT_SITE_SETTINGS.storyLinkLabel,

        featuredTitle: row.featuredTitle || DEFAULT_SITE_SETTINGS.featuredTitle,
        featuredDescription: row.featuredDescription || DEFAULT_SITE_SETTINGS.featuredDescription,

        collectionsTitle: row.collectionsTitle || DEFAULT_SITE_SETTINGS.collectionsTitle,
        collectionsDescription: row.collectionsDescription || DEFAULT_SITE_SETTINGS.collectionsDescription,
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

        const normalizeHex = (c?: string | null) => {
            if (!c) return undefined
            let trimmed = c.trim()
            if (!trimmed.startsWith('#') && /^[0-9A-Fa-f]{3,6}$/.test(trimmed)) {
                trimmed = '#' + trimmed
            }
            return trimmed
        }

        if (input.primaryColor) input.primaryColor = normalizeHex(input.primaryColor)
        if (input.accentColor) input.accentColor = normalizeHex(input.accentColor)
        if (input.backgroundColor) input.backgroundColor = normalizeHex(input.backgroundColor)

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
        if (input.headingFont !== undefined) data.headingFont = input.headingFont.trim()
        if (input.bodyFont !== undefined) data.bodyFont = input.bodyFont.trim()

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
            let digits = input.whatsappNumber?.replace(/\D/g, '') || null
            if (digits && digits.startsWith('0') && digits.length === 11) {
                digits = '234' + digits.slice(1)
            }
            data.whatsappNumber = digits
        }
        if (input.supportPhone !== undefined) data.supportPhone = input.supportPhone?.trim() || null

        if (input.instagramUrl !== undefined) data.instagramUrl = cleanLink(input.instagramUrl)
        if (input.facebookUrl !== undefined) data.facebookUrl = cleanLink(input.facebookUrl)
        if (input.twitterUrl !== undefined) data.twitterUrl = cleanLink(input.twitterUrl)
        if (input.tiktokUrl !== undefined) data.tiktokUrl = cleanLink(input.tiktokUrl)

        if (input.footerText !== undefined) data.footerText = input.footerText.trim()

        if (input.bankName !== undefined) data.bankName = input.bankName?.trim() || null
        if (input.bankAccountName !== undefined) data.bankAccountName = input.bankAccountName?.trim() || null
        if (input.bankAccountNumber !== undefined) data.bankAccountNumber = input.bankAccountNumber?.trim() || null

        if (input.shopPageTitle !== undefined) data.shopPageTitle = input.shopPageTitle.trim() || DEFAULT_SITE_SETTINGS.shopPageTitle
        if (input.shopPageTagline !== undefined) data.shopPageTagline = input.shopPageTagline.trim()

        if (input.statOneBadge !== undefined) data.statOneBadge = input.statOneBadge.trim()
        if (input.statOneValue !== undefined) data.statOneValue = input.statOneValue.trim()
        if (input.statTwoBadge !== undefined) data.statTwoBadge = input.statTwoBadge.trim()
        if (input.statTwoValue !== undefined) data.statTwoValue = input.statTwoValue.trim()
        if (input.storyLinkLabel !== undefined) data.storyLinkLabel = input.storyLinkLabel.trim()

        if (input.featuredTitle !== undefined) data.featuredTitle = input.featuredTitle.trim()
        if (input.featuredDescription !== undefined) data.featuredDescription = input.featuredDescription.trim()

        if (input.collectionsTitle !== undefined) data.collectionsTitle = input.collectionsTitle.trim()
        if (input.collectionsDescription !== undefined) data.collectionsDescription = input.collectionsDescription.trim()

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

export async function resetSiteSettings() {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Admin privileges required' }
        }

        const { id: _unusedId, ...defaultsWithoutId } = DEFAULT_SITE_SETTINGS
        const updated = await prisma.siteSettings.upsert({
            where: { id: 'default' },
            create: {
                id: 'default',
                ...defaultsWithoutId,
            },
            update: {
                ...defaultsWithoutId,
            },
        })

        revalidatePath('/', 'layout')
        revalidatePath('/account/site')
        return { success: true, data: toData(updated) }
    } catch (error) {
        console.error('resetSiteSettings error:', error)
        return { success: false, error: 'Failed to reset site settings' }
    }
}
