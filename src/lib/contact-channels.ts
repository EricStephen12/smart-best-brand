export type ContactOverrides = {
    whatsappNumber?: string | null
    supportPhone?: string | null
}

function digitsOnly(value: string): string {
    return value.replace(/\D/g, '')
}

export function getWhatsAppNumber(overrides?: ContactOverrides): string | null {
    const fromSettings = overrides?.whatsappNumber?.trim()
    const raw = fromSettings || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim()
    if (!raw) return null
    const digits = digitsOnly(raw)
    return digits.length >= 10 ? digits : null
}

export function getSupportPhone(overrides?: ContactOverrides): string | null {
    const fromSettings =
        overrides?.supportPhone?.trim() || overrides?.whatsappNumber?.trim()
    const raw =
        fromSettings ||
        process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() ||
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim()
    if (!raw) return null
    return raw
}

export function getWhatsAppUrl(message?: string, overrides?: ContactOverrides): string | null {
    const number = getWhatsAppNumber(overrides)
    if (!number) return null
    if (!message) return `https://wa.me/${number}`
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function getTelHref(overrides?: ContactOverrides): string | null {
    const phone = getSupportPhone(overrides)
    if (!phone) return null
    const digits = phone.replace(/[^\d+]/g, '')
    return digits ? `tel:${digits}` : null
}
