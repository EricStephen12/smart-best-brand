export type SiteSettingsData = {
    id: string
    siteName: string
    tagline: string
    logoUrl: string | null
    primaryColor: string
    accentColor: string
    backgroundColor: string

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
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
    id: 'default',
    siteName: 'Smart Best Brands',
    tagline: 'Quality mattresses, pillows & furniture',
    logoUrl: null,
    primaryColor: '#172554',
    accentColor: '#0284c7',
    backgroundColor: '#f7f6f3',

    announcementEnabled: false,
    announcementText: 'Authentic Nigerian home brands — fast nationwide delivery.',
    announcementLink: '/products',

    heroTitle: 'Quality mattresses, pillows & furniture',
    heroSubtitle:
        'Authentic comfort for Nigerian homes — shop trusted brands with clear pricing and delivery.',
    heroCtaLabel: 'Shop products',
    heroCtaHref: '/products',

    storyBadge: 'Our Legacy',
    storyTitle: 'Authenticity as a Standard.',
    storyText:
        "Smart Best Brands was established with a singular mission: to bring Nigeria's most trusted home brands under one roof. We understand that your home is your sanctuary, and the foundation of that sanctuary begins with rest.",
    storySecondaryBadge: 'Craftsmanship',
    storySecondaryTitle: 'Engineered for Nigerian Living.',
    storySecondaryText:
        'From high-density orthopedic mattresses built for durability in our climate to ergonomic pillows designed for restorative sleep, every piece in our curation meets rigorous standards.',
    storyImageUrl: null,

    promoBadge: 'For Nigerian homes',
    promoTitle: 'Comfort that feels like home',
    promoCtaLabel: 'Discover now',
    promoCtaHref: '/products',
    promoImageUrl: null,

    storeAddress: 'Abuja · Benin City',
    contactEmail: 'hello@smartbestbrands.com',
    whatsappNumber: null,
    supportPhone: null,
    instagramUrl: 'https://instagram.com/smartbestbrands',
    facebookUrl: null,
    twitterUrl: null,
    tiktokUrl: null,

    footerText: 'Authentic comfort for Nigerian homes. Quality mattresses, pillows, and furniture from trusted brands.',
}

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
    return `
:root {
  --brand-primary: ${primary};
  --brand-accent: ${accent};
  --brand-bg: ${background};
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
