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
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
    id: 'default',
    siteName: 'Smart Best Brands',
    tagline: 'Quality mattresses, pillows & furniture',
    logoUrl: null,
    primaryColor: '#172554',
    accentColor: '#0284c7',
    backgroundColor: '#f7f6f3',
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',

    announcementEnabled: false,
    announcementText: 'Original Nigerian mattresses & furniture — fast delivery to your door.',
    announcementLink: '/products',

    heroTitle: 'Quality mattresses, pillows & furniture',
    heroSubtitle:
        'Authentic comfort for Nigerian homes — shop trusted brands with clear pricing and delivery.',
    heroCtaLabel: 'Shop products',
    heroCtaHref: '/products',

    storyBadge: 'Who We Are',
    storyTitle: 'Original Mattresses, Directly to Your Home.',
    storyText:
        "We started Smart Best Brands to make buying genuine mattresses simple in Nigeria. No fake foam, no hidden fees—just original brands like Mouka, Vitafoam, and Royal Foam delivered directly to your doorstep.",
    storySecondaryBadge: 'Our Promise',
    storySecondaryTitle: '100% Authentic, Direct From the Factory.',
    storySecondaryText:
        'We source directly from authorized factory distributors so you never have to worry about counterfeits. Every mattress comes in its original factory packaging with a real manufacturer warranty.',
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

    return `
:root {
  --brand-primary: ${primary};
  --brand-accent: ${accent};
  --brand-bg: ${background};
  --font-heading: '${headingFont}', Georgia, serif;
  --font-body: '${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-playfair: var(--font-heading);
  --font-inter: var(--font-body);
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
