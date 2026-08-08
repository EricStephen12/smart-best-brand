export type SiteSettingsData = {
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
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
    id: 'default',
    siteName: 'Smart Best Brands',
    tagline: 'Quality mattresses, pillows & furniture',
    primaryColor: '#172554',
    accentColor: '#0284c7',
    backgroundColor: '#f7f6f3',
    heroTitle: 'Quality mattresses, pillows & furniture',
    heroSubtitle:
        'Authentic comfort for Nigerian homes — shop trusted brands with clear pricing and delivery.',
    heroCtaLabel: 'Shop products',
    heroCtaHref: '/products',
    footerText: 'Mattresses, pillows, and furniture for Nigerian homes.',
    contactEmail: 'hello@smartbestbrands.com',
    whatsappNumber: null,
    supportPhone: null,
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
