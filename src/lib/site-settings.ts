export type SiteSettingsData = {
    id: string
    siteName: string
    tagline: string
    logoUrl: string | null
    primaryColor: string
    accentColor: string
    backgroundColor: string
    headingFont: string
    bodyFont: string

    // Top Announcement Bar
    announcementEnabled: boolean
    announcementText: string | null
    announcementLink: string | null

    // Hero Section
    heroTitle: string
    heroSubtitle: string
    heroCtaLabel: string
    heroCtaHref: string

    // Homepage Story Section (Our Legacy)
    storyBadge: string
    storyTitle: string
    storyText: string
    storySecondaryBadge: string
    storySecondaryTitle: string
    storySecondaryText: string
    storyImageUrl: string | null

    // Homepage Mid-Page Promo Banner
    promoBadge: string
    promoTitle: string
    promoCtaLabel: string
    promoCtaHref: string
    promoImageUrl: string | null

    // Contact, Location & Social Channels
    storeAddress: string
    contactEmail: string
    whatsappNumber: string | null
    supportPhone: string | null
    instagramUrl: string | null
    facebookUrl: string | null
    twitterUrl: string | null
    tiktokUrl: string | null

    // Footer & Legal
    footerText: string

    // Bank Transfer Payment Details
    bankName: string | null
    bankAccountName: string | null
    bankAccountNumber: string | null

    // Products Page
    shopPageTitle: string
    shopPageTagline: string

    // Story Section Stats
    statOneBadge: string
    statOneValue: string
    statTwoBadge: string
    statTwoValue: string
    storyLinkLabel: string

    // Featured Products Section
    featuredTitle: string
    featuredDescription: string

    // Collections Section
    collectionsTitle: string
    collectionsDescription: string

    // Design & UI Style
    buttonShape: 'sharp' | 'rounded' | 'pill'
    cardStyle: 'sharp' | 'soft' | 'curved'
    badgeStyle: 'sharp' | 'pill'

    // Editorial Watermarks
    heroBackdropWord: string
    storyBackdropWord: string

    // Policies & Guarantees
    deliveryPolicy: string | null
    returnPolicy: string | null
    warrantyPolicy: string | null

    // Custom Size Modal
    customRequestTitle: string
    customRequestSubtitle: string

    // FAQs (JSON string)
    faqsJson: string | null

    // Style Meets Comfort & Curated Combos (JSON string)
    styleComfortJson: string | null

    // Editorial Journal / Articles (JSON string)
    editorialJournalJson: string | null

    // Scrolling Marquee / Ticker (JSON string)
    tickerLabelsJson: string | null

    // Newsletter Section (JSON string)
    newsletterJson: string | null

    // Trust Badges & Feature Checklist (JSON string)
    trustBadgesJson: string | null

    // Custom Navigation & Footer Links (JSON string)
    navLinksJson: string | null
    footerLinksJson: string | null
}

import {
    BRAND,
    COLORS,
    ANNOUNCEMENT_BAR,
    HERO_BANNERS,
    STORY_CONTENT,
    PROMO_BANNER,
    STYLE_COMFORT_CONTENT,
    CURATED_COMBOS_SLIDES,
    EDITORIAL_JOURNAL,
    PRODUCT_NEWSLETTER,
    PRODUCT_FEATURE_CHECKLIST,
    TRUST_BADGES,
    CONTACT,
    BANK_DETAILS,
    ROUTES,
    FOOTER_CONTENT,
    SHOP_HEADER,
    FEATURED_SECTION,
    COLLECTIONS_SECTION,
    POLICIES,
    FAQS,
    SETTINGS_TABS,
    type SettingsTabId,
    COLOR_PRESETS,
    BUTTON_SHAPE_OPTIONS,
    CARD_STYLE_OPTIONS,
    BADGE_STYLE_OPTIONS,
} from '@/lib/constants'

export {
    SETTINGS_TABS,
    type SettingsTabId,
    COLOR_PRESETS,
    BUTTON_SHAPE_OPTIONS,
    CARD_STYLE_OPTIONS,
    BADGE_STYLE_OPTIONS,
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
    id: 'default',
    siteName: BRAND.name,
    tagline: BRAND.tagline,
    logoUrl: null,
    primaryColor: COLORS.brandPrimary,
    accentColor: COLORS.brandAccent,
    backgroundColor: COLORS.brandBg,
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',

    announcementEnabled: ANNOUNCEMENT_BAR.enabled,
    announcementText: ANNOUNCEMENT_BAR.text,
    announcementLink: ANNOUNCEMENT_BAR.link,

    heroTitle: HERO_BANNERS[0].title,
    heroSubtitle: HERO_BANNERS[0].subtitle,
    heroCtaLabel: HERO_BANNERS[0].ctaLabel,
    heroCtaHref: HERO_BANNERS[0].ctaHref,

    storyBadge: STORY_CONTENT.badge,
    storyTitle: STORY_CONTENT.title,
    storyText: STORY_CONTENT.text,
    storySecondaryBadge: STORY_CONTENT.secondaryBadge,
    storySecondaryTitle: STORY_CONTENT.secondaryTitle,
    storySecondaryText: STORY_CONTENT.secondaryText,
    storyImageUrl: null,

    promoBadge: PROMO_BANNER.badge,
    promoTitle: PROMO_BANNER.title,
    promoCtaLabel: PROMO_BANNER.ctaLabel,
    promoCtaHref: PROMO_BANNER.ctaHref,
    promoImageUrl: PROMO_BANNER.imageUrl,

    storeAddress: CONTACT.address,
    contactEmail: CONTACT.email,
    whatsappNumber: CONTACT.whatsappNumber,
    supportPhone: CONTACT.supportPhone,
    instagramUrl: CONTACT.socials.instagram,
    facebookUrl: null,
    twitterUrl: null,
    tiktokUrl: null,

    footerText: FOOTER_CONTENT.text,
    bankName: BANK_DETAILS.bankName,
    bankAccountName: BANK_DETAILS.accountName,
    bankAccountNumber: BANK_DETAILS.accountNumber,

    shopPageTitle: SHOP_HEADER.title,
    shopPageTagline: SHOP_HEADER.tagline,

    statOneBadge: STORY_CONTENT.stats.statOneBadge,
    statOneValue: STORY_CONTENT.stats.statOneValue,
    statTwoBadge: STORY_CONTENT.stats.statTwoBadge,
    statTwoValue: STORY_CONTENT.stats.statTwoValue,
    storyLinkLabel: STORY_CONTENT.storyLinkLabel,

    featuredTitle: FEATURED_SECTION.title,
    featuredDescription: FEATURED_SECTION.description,

    collectionsTitle: COLLECTIONS_SECTION.title,
    collectionsDescription: COLLECTIONS_SECTION.description,

    buttonShape: 'pill',
    cardStyle: 'soft',
    badgeStyle: 'pill',

    heroBackdropWord: 'Comfort',
    storyBackdropWord: 'Rest',

    deliveryPolicy: POLICIES.delivery.points.join('\n'),
    returnPolicy: POLICIES.returns.points.join('\n'),
    warrantyPolicy: POLICIES.warranty.points.join('\n'),

    customRequestTitle: 'Need a Custom Size?',
    customRequestSubtitle:
        'Have an imported bed frame or unique room dimensions? We can order custom-sized mattresses directly from the factory for you.',

    faqsJson: JSON.stringify(FAQS),

    styleComfortJson: JSON.stringify({
        title: STYLE_COMFORT_CONTENT.title,
        description: STYLE_COMFORT_CONTENT.description,
        imageUrl: STYLE_COMFORT_CONTENT.imageUrl,
        imageAlt: STYLE_COMFORT_CONTENT.imageAlt,
        stats: STYLE_COMFORT_CONTENT.stats,
        slides: CURATED_COMBOS_SLIDES,
    }),
    editorialJournalJson: JSON.stringify(EDITORIAL_JOURNAL),
    tickerLabelsJson: JSON.stringify({
        mode: 'auto',
        customItems: [
            { id: '1', text: 'Original Mattresses & Furniture', href: '/products' },
            { id: '2', text: 'Factory Sealed & Warranted', href: '/about' },
            { id: '3', text: 'Fast Delivery in Abuja & Benin', href: '/delivery' },
            { id: '4', text: 'Mouka · Vitafoam · Royal Foam', href: '/products?category=Mattresses' },
        ],
    }),
    newsletterJson: JSON.stringify(PRODUCT_NEWSLETTER),
    trustBadgesJson: JSON.stringify({
        featureChecklist: PRODUCT_FEATURE_CHECKLIST,
        trustBadges: TRUST_BADGES,
    }),
    navLinksJson: null,
    footerLinksJson: null,
}

export const HEADING_FONTS = [
    { name: 'Playfair Display', label: 'Playfair Display', family: 'serif', sample: 'Luxury Comfort & Authentic Rest' },
    { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', family: 'sans-serif', sample: 'Modern Architecture & Clean Form' },
    { name: 'Montserrat', label: 'Montserrat', family: 'sans-serif', sample: 'Bold Contemporary Studio Standard' },
    { name: 'Cinzel', label: 'Cinzel', family: 'serif', sample: 'Imperial Elegance & Royal Heritage' },
    { name: 'Cormorant Garamond', label: 'Cormorant Garamond', family: 'serif', sample: 'Refined Bedding & Master Craft' },
    { name: 'Outfit', label: 'Outfit', family: 'sans-serif', sample: 'Minimalist Balance & Clean Design' },
    { name: 'Inter', label: 'Inter', family: 'sans-serif', sample: 'Clean Universal Structure' },
]

export const BODY_FONTS = [
    { name: 'Inter', label: 'Inter', sample: 'Engineered for supreme legibility and comfortable shopping.' },
    { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', sample: 'Crisp, contemporary geometric rhythm across all screens.' },
    { name: 'Montserrat', label: 'Montserrat', sample: 'Solid, spacious sans-serif with excellent character presence.' },
    { name: 'Outfit', label: 'Outfit', sample: 'Light, airy modern typography perfect for sleek interfaces.' },
]

export const FONT_PAIRINGS = [
    {
        name: 'Luxury Boutique',
        heading: 'Playfair Display',
        body: 'Inter',
        tag: 'Default Storefront',
        description: 'Prestigious serif titles paired with crystal-clear interface reading.',
    },
    {
        name: 'Modern Studio',
        heading: 'Plus Jakarta Sans',
        body: 'Inter',
        tag: 'Clean & Tech',
        description: 'Geometric high-end modern furniture showroom appearance.',
    },
    {
        name: 'Imperial Heritage',
        heading: 'Cinzel',
        body: 'Montserrat',
        tag: 'Aristocratic',
        description: 'Regal Roman titles for high-end luxury mattress collections.',
    },
    {
        name: 'Fine Editorial',
        heading: 'Cormorant Garamond',
        body: 'Outfit',
        tag: 'Architectural',
        description: 'Delicate high-fashion aesthetic for bespoke bedroom decor.',
    },
]

export function isValidHexColor(value: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value.trim())
}

export function buildThemeCss(settings: SiteSettingsData): string {
    const primary = isValidHexColor(settings.primaryColor)
        ? settings.primaryColor.trim()
        : DEFAULT_SITE_SETTINGS.primaryColor
    const accent = isValidHexColor(settings.accentColor)
        ? settings.accentColor.trim()
        : DEFAULT_SITE_SETTINGS.accentColor
    const background = isValidHexColor(settings.backgroundColor)
        ? settings.backgroundColor.trim()
        : DEFAULT_SITE_SETTINGS.backgroundColor
    const headingFont = settings.headingFont || DEFAULT_SITE_SETTINGS.headingFont
    const bodyFont = settings.bodyFont || DEFAULT_SITE_SETTINGS.bodyFont

    const buttonRadius =
        settings.buttonShape === 'pill'
            ? '9999px'
            : settings.buttonShape === 'rounded'
            ? '8px'
            : '0px'
    const cardRadius =
        settings.cardStyle === 'curved'
            ? '24px'
            : settings.cardStyle === 'soft'
            ? '12px'
            : '0px'
    const badgeRadius = settings.badgeStyle === 'pill' ? '9999px' : '0px'

    return `
:root {
  --brand-primary: ${primary};
  --brand-accent: ${accent};
  --brand-bg: ${background};
  --font-heading: '${headingFont}', Georgia, serif;
  --font-body: '${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-playfair: var(--font-heading);
  --font-inter: var(--font-body);
  --button-radius: ${buttonRadius};
  --card-radius: ${cardRadius};
  --badge-radius: ${badgeRadius};
}
`.trim()
}

export function brandNameParts(siteName: string): { lead: string; accent: string } {
    const compact = siteName.replace(/\s+/g, '').toUpperCase()
    if (compact.includes('BRAND')) {
        const idx = compact.indexOf('BRAND')
        return { lead: compact.slice(0, idx) || compact, accent: compact.slice(idx) || '' }
    }
    const mid = Math.ceil(compact.length / 2)
    return { lead: compact.slice(0, mid), accent: compact.slice(mid) }
}
