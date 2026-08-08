'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'

async function requireAdmin() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        return null
    }
    return session
}

const DEFAULT_SLIDES = [
    {
        title: 'Pure Comfort',
        subtitle: 'Mattresses, pillows & furniture for Nigerian homes.',
        imageUrl: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
        ctaLabel: 'View the Collection',
        ctaHref: '/products',
        sortOrder: 0,
        isActive: true,
    },
    {
        title: 'Rest Well',
        subtitle: 'Trusted brands. Clear pricing. Delivery you can count on.',
        imageUrl: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
        ctaLabel: 'Shop products',
        ctaHref: '/products',
        sortOrder: 1,
        isActive: true,
    },
    {
        title: 'Live Better',
        subtitle: 'From bedroom to living space — comfort that fits your home.',
        imageUrl: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
        ctaLabel: 'Explore now',
        ctaHref: '/products',
        sortOrder: 2,
        isActive: true,
    },
]

/** Seeds multiple hero slides so the carousel works out of the box. */
export async function ensureDefaultBanner() {
    const existing = await prisma.banner.findMany({ select: { imageUrl: true } })
    const urls = new Set(existing.map((b) => b.imageUrl))

    for (const slide of DEFAULT_SLIDES) {
        if (urls.has(slide.imageUrl)) continue
        await prisma.banner.create({ data: slide })
        urls.add(slide.imageUrl)
    }
}

export async function getActiveBanners() {
    try {
        await ensureDefaultBanner()
        const banners = await prisma.banner.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        })
        return { success: true, data: banners }
    } catch (error) {
        console.error('Error fetching active banners:', error)
        return { success: false, error: 'Failed to fetch banners', data: [] as never[] }
    }
}

export async function getAllBanners() {
    try {
        const session = await requireAdmin()
        if (!session) return { success: false, error: 'Unauthorized' }

        await ensureDefaultBanner()
        const banners = await prisma.banner.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        })
        return { success: true, data: banners }
    } catch (error) {
        console.error('Error fetching banners:', error)
        return { success: false, error: 'Failed to fetch banners' }
    }
}

export async function createBanner(data: {
    title: string
    subtitle?: string
    imageUrl: string
    ctaLabel?: string
    ctaHref?: string
    sortOrder?: number
    isActive?: boolean
}) {
    try {
        const session = await requireAdmin()
        if (!session) return { success: false, error: 'Unauthorized' }

        if (!data.title?.trim() || !data.imageUrl?.trim()) {
            return { success: false, error: 'Title and image are required' }
        }

        const banner = await prisma.banner.create({
            data: {
                title: data.title.trim(),
                subtitle: data.subtitle?.trim() || null,
                imageUrl: data.imageUrl.trim(),
                ctaLabel: data.ctaLabel?.trim() || null,
                ctaHref: data.ctaHref?.trim() || null,
                sortOrder: data.sortOrder ?? 0,
                isActive: data.isActive ?? true,
            },
        })

        revalidatePath('/')
        revalidatePath('/account/banners')
        return { success: true, data: banner }
    } catch (error) {
        console.error('Error creating banner:', error)
        return { success: false, error: 'Failed to create banner' }
    }
}

export async function updateBanner(
    id: string,
    data: {
        title?: string
        subtitle?: string | null
        imageUrl?: string
        ctaLabel?: string | null
        ctaHref?: string | null
        sortOrder?: number
        isActive?: boolean
    }
) {
    try {
        const session = await requireAdmin()
        if (!session) return { success: false, error: 'Unauthorized' }

        const banner = await prisma.banner.update({
            where: { id },
            data,
        })

        revalidatePath('/')
        revalidatePath('/account/banners')
        return { success: true, data: banner }
    } catch (error) {
        console.error('Error updating banner:', error)
        return { success: false, error: 'Failed to update banner' }
    }
}

export async function deleteBanner(id: string) {
    try {
        const session = await requireAdmin()
        if (!session) return { success: false, error: 'Unauthorized' }

        await prisma.banner.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/account/banners')
        return { success: true }
    } catch (error) {
        console.error('Error deleting banner:', error)
        return { success: false, error: 'Failed to delete banner' }
    }
}

export async function toggleBannerActive(id: string, isActive: boolean) {
    return updateBanner(id, { isActive })
}
