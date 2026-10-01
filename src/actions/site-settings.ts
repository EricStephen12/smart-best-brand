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
        siteName: row.siteName ?? DEFAULT_SITE_SETTINGS.siteName,
        tagline: row.tagline ?? DEFAULT_SITE_SETTINGS.tagline,
        logoUrl: row.logoUrl || null,
        primaryColor: row.primaryColor ?? DEFAULT_SITE_SETTINGS.primaryColor,
        accentColor: row.accentColor ?? DEFAULT_SITE_SETTINGS.accentColor,
        backgroundColor: row.backgroundColor ?? DEFAULT_SITE_SETTINGS.backgroundColor,
        headingFont: row.headingFont ?? DEFAULT_SITE_SETTINGS.headingFont,
        bodyFont: row.bodyFont ?? DEFAULT_SITE_SETTINGS.bodyFont,

        announcementEnabled: Boolean(row.announcementEnabled),
        announcementText: row.announcementText ?? DEFAULT_SITE_SETTINGS.announcementText,
        announcementLink: row.announcementLink ?? DEFAULT_SITE_SETTINGS.announcementLink,

        heroTitle: row.heroTitle ?? DEFAULT_SITE_SETTINGS.heroTitle,
        heroSubtitle: row.heroSubtitle ?? DEFAULT_SITE_SETTINGS.heroSubtitle,
        heroCtaLabel: row.heroCtaLabel ?? DEFAULT_SITE_SETTINGS.heroCtaLabel,
        heroCtaHref: row.heroCtaHref ?? DEFAULT_SITE_SETTINGS.heroCtaHref,

        storyBadge: row.storyBadge ?? DEFAULT_SITE_SETTINGS.storyBadge,
        storyTitle: row.storyTitle ?? DEFAULT_SITE_SETTINGS.storyTitle,
        storyText: row.storyText ?? DEFAULT_SITE_SETTINGS.storyText,
        storySecondaryBadge: row.storySecondaryBadge ?? DEFAULT_SITE_SETTINGS.storySecondaryBadge,
        storySecondaryTitle: row.storySecondaryTitle ?? DEFAULT_SITE_SETTINGS.storySecondaryTitle,
        storySecondaryText: row.storySecondaryText ?? DEFAULT_SITE_SETTINGS.storySecondaryText,
        storyImageUrl: row.storyImageUrl || null,

        promoBadge: row.promoBadge ?? DEFAULT_SITE_SETTINGS.promoBadge,
        promoTitle: row.promoTitle ?? DEFAULT_SITE_SETTINGS.promoTitle,
        promoCtaLabel: row.promoCtaLabel ?? DEFAULT_SITE_SETTINGS.promoCtaLabel,
        promoCtaHref: row.promoCtaHref ?? DEFAULT_SITE_SETTINGS.promoCtaHref,
        promoImageUrl: row.promoImageUrl ?? DEFAULT_SITE_SETTINGS.promoImageUrl,

        storeAddress: row.storeAddress ?? DEFAULT_SITE_SETTINGS.storeAddress,
        contactEmail: row.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail,
        whatsappNumber: row.whatsappNumber ?? DEFAULT_SITE_SETTINGS.whatsappNumber,
        supportPhone: row.supportPhone ?? DEFAULT_SITE_SETTINGS.supportPhone,
        instagramUrl: row.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl,
        facebookUrl: row.facebookUrl || null,
        twitterUrl: row.twitterUrl || null,
        tiktokUrl: row.tiktokUrl || null,
        footerText: row.footerText ?? DEFAULT_SITE_SETTINGS.footerText,
        bankName: row.bankName ?? DEFAULT_SITE_SETTINGS.bankName,
        bankAccountName: row.bankAccountName ?? DEFAULT_SITE_SETTINGS.bankAccountName,
        bankAccountNumber: row.bankAccountNumber ?? DEFAULT_SITE_SETTINGS.bankAccountNumber,

        shopPageTitle: row.shopPageTitle ?? DEFAULT_SITE_SETTINGS.shopPageTitle,
        shopPageTagline: row.shopPageTagline ?? DEFAULT_SITE_SETTINGS.shopPageTagline,

        statOneBadge: row.statOneBadge ?? DEFAULT_SITE_SETTINGS.statOneBadge,
        statOneValue: row.statOneValue ?? DEFAULT_SITE_SETTINGS.statOneValue,
        statTwoBadge: row.statTwoBadge ?? DEFAULT_SITE_SETTINGS.statTwoBadge,
        statTwoValue: row.statTwoValue ?? DEFAULT_SITE_SETTINGS.statTwoValue,
        storyLinkLabel: row.storyLinkLabel ?? DEFAULT_SITE_SETTINGS.storyLinkLabel,

        featuredTitle: row.featuredTitle ?? DEFAULT_SITE_SETTINGS.featuredTitle,
        featuredDescription: row.featuredDescription ?? DEFAULT_SITE_SETTINGS.featuredDescription,

        collectionsTitle: row.collectionsTitle ?? DEFAULT_SITE_SETTINGS.collectionsTitle,
        collectionsDescription: row.collectionsDescription ?? DEFAULT_SITE_SETTINGS.collectionsDescription,

        buttonShape: (row.buttonShape ?? DEFAULT_SITE_SETTINGS.buttonShape) as any,
        cardStyle: (row.cardStyle ?? DEFAULT_SITE_SETTINGS.cardStyle) as any,
        badgeStyle: (row.badgeStyle ?? DEFAULT_SITE_SETTINGS.badgeStyle) as any,

        heroBackdropWord: row.heroBackdropWord ?? DEFAULT_SITE_SETTINGS.heroBackdropWord,
        storyBackdropWord: row.storyBackdropWord ?? DEFAULT_SITE_SETTINGS.storyBackdropWord,

        deliveryPolicy: row.deliveryPolicy ?? DEFAULT_SITE_SETTINGS.deliveryPolicy,
        returnPolicy: row.returnPolicy ?? DEFAULT_SITE_SETTINGS.returnPolicy,
        warrantyPolicy: row.warrantyPolicy ?? DEFAULT_SITE_SETTINGS.warrantyPolicy,

        customRequestTitle: row.customRequestTitle ?? DEFAULT_SITE_SETTINGS.customRequestTitle,
        customRequestSubtitle: row.customRequestSubtitle ?? DEFAULT_SITE_SETTINGS.customRequestSubtitle,

        faqsJson: row.faqsJson ?? DEFAULT_SITE_SETTINGS.faqsJson,

        styleComfortJson: row.styleComfortJson ?? DEFAULT_SITE_SETTINGS.styleComfortJson,
        editorialJournalJson: row.editorialJournalJson ?? DEFAULT_SITE_SETTINGS.editorialJournalJson,
        tickerLabelsJson: row.tickerLabelsJson ?? DEFAULT_SITE_SETTINGS.tickerLabelsJson,
        newsletterJson: row.newsletterJson ?? DEFAULT_SITE_SETTINGS.newsletterJson,
        trustBadgesJson: row.trustBadgesJson ?? DEFAULT_SITE_SETTINGS.trustBadgesJson,
        navLinksJson: row.navLinksJson ?? DEFAULT_SITE_SETTINGS.navLinksJson,
        footerLinksJson: row.footerLinksJson ?? DEFAULT_SITE_SETTINGS.footerLinksJson,
    }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
    try {
        const rows: any[] = await prisma.$queryRawUnsafe(
            `SELECT * FROM "SiteSettings" WHERE id = 'default' LIMIT 1`
        )
        if (rows && rows[0]) {
            return toData(rows[0])
        }

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
        if ((!session || session.role !== 'ADMIN') && process.env.NODE_ENV === 'production') {
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

        const colors = [input.primaryColor, input.accentColor, input.backgroundColor].filter(Boolean) as string[]
        for (const color of colors) {
            if (!isValidHexColor(color)) {
                return { success: false, error: `Invalid color: ${color}. Use hex like #172554` }
            }
        }

        const cleanLink = (link?: string | null) => {
            if (!link) return null
            const trimmed = link.trim()
            return trimmed || null
        }

        // Build SET clause dynamically — only include fields that were provided
        const setCols: string[] = []
        const vals: any[] = []
        let p = 1

        const add = (col: string, val: any) => {
            setCols.push(`"${col}" = $${p++}`)
            vals.push(val)
        }

        // Scalar fields
        if (input.siteName !== undefined) add('siteName', input.siteName.trim() || DEFAULT_SITE_SETTINGS.siteName)
        if (input.tagline !== undefined) add('tagline', input.tagline.trim())
        if (input.logoUrl !== undefined) add('logoUrl', cleanLink(input.logoUrl))
        if (input.primaryColor !== undefined) add('primaryColor', input.primaryColor.trim())
        if (input.accentColor !== undefined) add('accentColor', input.accentColor.trim())
        if (input.backgroundColor !== undefined) add('backgroundColor', input.backgroundColor.trim())
        if (input.headingFont !== undefined) add('headingFont', input.headingFont.trim())
        if (input.bodyFont !== undefined) add('bodyFont', input.bodyFont.trim())

        if (input.announcementEnabled !== undefined) add('announcementEnabled', Boolean(input.announcementEnabled))
        if (input.announcementText !== undefined) add('announcementText', input.announcementText?.trim() || null)
        if (input.announcementLink !== undefined) add('announcementLink', cleanLink(input.announcementLink))

        if (input.heroTitle !== undefined) add('heroTitle', input.heroTitle.trim())
        if (input.heroSubtitle !== undefined) add('heroSubtitle', input.heroSubtitle.trim())
        if (input.heroCtaLabel !== undefined) add('heroCtaLabel', input.heroCtaLabel.trim())
        if (input.heroCtaHref !== undefined) add('heroCtaHref', cleanLink(input.heroCtaHref) || '/products')

        if (input.storyBadge !== undefined) add('storyBadge', input.storyBadge.trim())
        if (input.storyTitle !== undefined) add('storyTitle', input.storyTitle.trim())
        if (input.storyText !== undefined) add('storyText', input.storyText.trim())
        if (input.storySecondaryBadge !== undefined) add('storySecondaryBadge', input.storySecondaryBadge.trim())
        if (input.storySecondaryTitle !== undefined) add('storySecondaryTitle', input.storySecondaryTitle.trim())
        if (input.storySecondaryText !== undefined) add('storySecondaryText', input.storySecondaryText.trim())
        if (input.storyImageUrl !== undefined) add('storyImageUrl', cleanLink(input.storyImageUrl))

        if (input.promoBadge !== undefined) add('promoBadge', input.promoBadge.trim())
        if (input.promoTitle !== undefined) add('promoTitle', input.promoTitle.trim())
        if (input.promoCtaLabel !== undefined) add('promoCtaLabel', input.promoCtaLabel.trim())
        if (input.promoCtaHref !== undefined) add('promoCtaHref', cleanLink(input.promoCtaHref) || '/products')
        if (input.promoImageUrl !== undefined) add('promoImageUrl', cleanLink(input.promoImageUrl))

        if (input.storeAddress !== undefined) add('storeAddress', input.storeAddress.trim())
        if (input.contactEmail !== undefined) add('contactEmail', input.contactEmail.trim().toLowerCase())
        if (input.whatsappNumber !== undefined) {
            let digits = input.whatsappNumber?.replace(/\D/g, '') || null
            if (digits && digits.startsWith('0') && digits.length === 11) digits = '234' + digits.slice(1)
            add('whatsappNumber', digits)
        }
        if (input.supportPhone !== undefined) add('supportPhone', input.supportPhone?.trim() || null)
        if (input.instagramUrl !== undefined) add('instagramUrl', cleanLink(input.instagramUrl))
        if (input.facebookUrl !== undefined) add('facebookUrl', cleanLink(input.facebookUrl))
        if (input.twitterUrl !== undefined) add('twitterUrl', cleanLink(input.twitterUrl))
        if (input.tiktokUrl !== undefined) add('tiktokUrl', cleanLink(input.tiktokUrl))

        if (input.footerText !== undefined) add('footerText', input.footerText.trim())
        if (input.bankName !== undefined) add('bankName', input.bankName?.trim() || null)
        if (input.bankAccountName !== undefined) add('bankAccountName', input.bankAccountName?.trim() || null)
        if (input.bankAccountNumber !== undefined) add('bankAccountNumber', input.bankAccountNumber?.trim() || null)

        if (input.shopPageTitle !== undefined) add('shopPageTitle', input.shopPageTitle.trim() || DEFAULT_SITE_SETTINGS.shopPageTitle)
        if (input.shopPageTagline !== undefined) add('shopPageTagline', input.shopPageTagline.trim())

        if (input.statOneBadge !== undefined) add('statOneBadge', input.statOneBadge.trim())
        if (input.statOneValue !== undefined) add('statOneValue', input.statOneValue.trim())
        if (input.statTwoBadge !== undefined) add('statTwoBadge', input.statTwoBadge.trim())
        if (input.statTwoValue !== undefined) add('statTwoValue', input.statTwoValue.trim())
        if (input.storyLinkLabel !== undefined) add('storyLinkLabel', input.storyLinkLabel.trim())

        if (input.featuredTitle !== undefined) add('featuredTitle', input.featuredTitle.trim())
        if (input.featuredDescription !== undefined) add('featuredDescription', input.featuredDescription.trim())
        if (input.collectionsTitle !== undefined) add('collectionsTitle', input.collectionsTitle.trim())
        if (input.collectionsDescription !== undefined) add('collectionsDescription', input.collectionsDescription.trim())

        if (input.buttonShape !== undefined) add('buttonShape', input.buttonShape)
        if (input.cardStyle !== undefined) add('cardStyle', input.cardStyle)
        if (input.badgeStyle !== undefined) add('badgeStyle', input.badgeStyle)

        if (input.heroBackdropWord !== undefined) add('heroBackdropWord', input.heroBackdropWord.trim())
        if (input.storyBackdropWord !== undefined) add('storyBackdropWord', input.storyBackdropWord.trim())

        if (input.deliveryPolicy !== undefined) add('deliveryPolicy', input.deliveryPolicy?.trim() || null)
        if (input.returnPolicy !== undefined) add('returnPolicy', input.returnPolicy?.trim() || null)
        if (input.warrantyPolicy !== undefined) add('warrantyPolicy', input.warrantyPolicy?.trim() || null)

        if (input.customRequestTitle !== undefined) add('customRequestTitle', input.customRequestTitle.trim())
        if (input.customRequestSubtitle !== undefined) add('customRequestSubtitle', input.customRequestSubtitle.trim())

        if (input.faqsJson !== undefined) add('faqsJson', input.faqsJson)

        // JSON columns added via raw SQL (not in Prisma schema)
        if (input.styleComfortJson !== undefined) add('styleComfortJson', input.styleComfortJson)
        if (input.editorialJournalJson !== undefined) add('editorialJournalJson', input.editorialJournalJson)
        if (input.tickerLabelsJson !== undefined) add('tickerLabelsJson', input.tickerLabelsJson)
        if (input.newsletterJson !== undefined) add('newsletterJson', input.newsletterJson)
        if (input.trustBadgesJson !== undefined) add('trustBadgesJson', input.trustBadgesJson)
        if (input.navLinksJson !== undefined) add('navLinksJson', input.navLinksJson)
        if (input.footerLinksJson !== undefined) add('footerLinksJson', input.footerLinksJson)

        // Ensure row exists first with valid updatedAt
        await prisma.$executeRawUnsafe(
            `INSERT INTO "SiteSettings" (id, "updatedAt") VALUES ('default', NOW()) ON CONFLICT (id) DO NOTHING`
        )

        if (setCols.length > 0) {
            setCols.push(`"updatedAt" = NOW()`)
            vals.push('default')
            await prisma.$executeRawUnsafe(
                `UPDATE "SiteSettings" SET ${setCols.join(', ')} WHERE id = $${p}`,
                ...vals
            )
        }

        const freshRows: any[] = await prisma.$queryRawUnsafe(
            `SELECT * FROM "SiteSettings" WHERE id = 'default' LIMIT 1`
        )
        const finalData = freshRows && freshRows[0] ? toData(freshRows[0]) : DEFAULT_SITE_SETTINGS

        revalidatePath('/', 'layout')
        revalidatePath('/account/site')
        return { success: true, data: finalData }
    } catch (error) {
        console.error('updateSiteSettings error:', error)
        return { success: false, error: 'Failed to save site settings' }
    }
}

export async function resetSiteSettings() {
    try {
        const session = await getSession()
        if ((!session || session.role !== 'ADMIN') && process.env.NODE_ENV === 'production') {
            return { success: false, error: 'Unauthorized: Admin privileges required' }
        }

        const d = DEFAULT_SITE_SETTINGS

        await prisma.$executeRawUnsafe(
            `INSERT INTO "SiteSettings" (id, "updatedAt") VALUES ('default', NOW()) ON CONFLICT (id) DO NOTHING`
        )

        await prisma.$executeRawUnsafe(`
            UPDATE "SiteSettings" SET
                "siteName" = $1, "tagline" = $2, "logoUrl" = $3,
                "primaryColor" = $4, "accentColor" = $5, "backgroundColor" = $6,
                "headingFont" = $7, "bodyFont" = $8,
                "announcementEnabled" = $9, "announcementText" = $10, "announcementLink" = $11,
                "heroTitle" = $12, "heroSubtitle" = $13, "heroCtaLabel" = $14, "heroCtaHref" = $15,
                "storyBadge" = $16, "storyTitle" = $17, "storyText" = $18,
                "storySecondaryBadge" = $19, "storySecondaryTitle" = $20, "storySecondaryText" = $21,
                "storyImageUrl" = $22,
                "promoBadge" = $23, "promoTitle" = $24, "promoCtaLabel" = $25,
                "promoCtaHref" = $26, "promoImageUrl" = $27,
                "storeAddress" = $28, "contactEmail" = $29,
                "whatsappNumber" = $30, "supportPhone" = $31,
                "instagramUrl" = $32, "facebookUrl" = $33, "twitterUrl" = $34, "tiktokUrl" = $35,
                "footerText" = $36,
                "bankName" = $37, "bankAccountName" = $38, "bankAccountNumber" = $39,
                "shopPageTitle" = $40, "shopPageTagline" = $41,
                "statOneBadge" = $42, "statOneValue" = $43, "statTwoBadge" = $44, "statTwoValue" = $45,
                "storyLinkLabel" = $46,
                "featuredTitle" = $47, "featuredDescription" = $48,
                "collectionsTitle" = $49, "collectionsDescription" = $50,
                "buttonShape" = $51, "cardStyle" = $52, "badgeStyle" = $53,
                "heroBackdropWord" = $54, "storyBackdropWord" = $55,
                "deliveryPolicy" = $56, "returnPolicy" = $57, "warrantyPolicy" = $58,
                "customRequestTitle" = $59, "customRequestSubtitle" = $60,
                "faqsJson" = $61,
                "styleComfortJson" = $62, "editorialJournalJson" = $63,
                "tickerLabelsJson" = $64, "newsletterJson" = $65,
                "trustBadgesJson" = $66, "navLinksJson" = $67, "footerLinksJson" = $68,
                "updatedAt" = NOW()
            WHERE id = 'default'`,
            d.siteName, d.tagline, d.logoUrl,
            d.primaryColor, d.accentColor, d.backgroundColor,
            d.headingFont, d.bodyFont,
            d.announcementEnabled, d.announcementText, d.announcementLink,
            d.heroTitle, d.heroSubtitle, d.heroCtaLabel, d.heroCtaHref,
            d.storyBadge, d.storyTitle, d.storyText,
            d.storySecondaryBadge, d.storySecondaryTitle, d.storySecondaryText,
            d.storyImageUrl,
            d.promoBadge, d.promoTitle, d.promoCtaLabel, d.promoCtaHref, d.promoImageUrl,
            d.storeAddress, d.contactEmail,
            d.whatsappNumber, d.supportPhone,
            d.instagramUrl, d.facebookUrl, d.twitterUrl, d.tiktokUrl,
            d.footerText,
            d.bankName, d.bankAccountName, d.bankAccountNumber,
            d.shopPageTitle, d.shopPageTagline,
            d.statOneBadge, d.statOneValue, d.statTwoBadge, d.statTwoValue,
            d.storyLinkLabel,
            d.featuredTitle, d.featuredDescription,
            d.collectionsTitle, d.collectionsDescription,
            d.buttonShape, d.cardStyle, d.badgeStyle,
            d.heroBackdropWord, d.storyBackdropWord,
            d.deliveryPolicy, d.returnPolicy, d.warrantyPolicy,
            d.customRequestTitle, d.customRequestSubtitle,
            d.faqsJson,
            d.styleComfortJson, d.editorialJournalJson,
            d.tickerLabelsJson, d.newsletterJson,
            d.trustBadgesJson, d.navLinksJson, d.footerLinksJson
        )

        const freshRows: any[] = await prisma.$queryRawUnsafe(
            `SELECT * FROM "SiteSettings" WHERE id = 'default' LIMIT 1`
        )
        const finalData = freshRows && freshRows[0] ? toData(freshRows[0]) : DEFAULT_SITE_SETTINGS

        revalidatePath('/', 'layout')
        revalidatePath('/account/site')
        return { success: true, data: finalData }
    } catch (error) {
        console.error('resetSiteSettings error:', error)
        return { success: false, error: 'Failed to reset site settings' }
    }
}
