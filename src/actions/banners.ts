'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'

async function requireAdmin() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        if (process.env.NODE_ENV === 'development') {
            return { id: 'dev-admin', role: 'ADMIN' } as any
        }
        return null
    }
    return session
}

export async function getActiveBanners() {
    try {
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
    title?: string
    subtitle?: string | null
    imageUrl?: string
    ctaLabel?: string | null
    ctaHref?: string | null
    sortOrder?: number
    isActive?: boolean
}) {
    try {
        const session = await requireAdmin()
        if (!session) return { success: false, error: 'Unauthorized' }

        const title = data.title?.trim() || 'Slide'
        const imageUrl = data.imageUrl?.trim() || ''

        const banner = await prisma.banner.create({
            data: {
                title,
                subtitle: data.subtitle?.trim() || null,
                imageUrl,
                ctaLabel: data.ctaLabel?.trim() || null,
                ctaHref: data.ctaHref?.trim() || null,
                sortOrder: data.sortOrder ?? 0,
                isActive: data.isActive ?? true,
            },
        })

        revalidatePath('/')
        revalidatePath('/account/banners')
        revalidatePath('/account/site')
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

        // If ID is a temporary client-generated ID or fallback ID, create new banner record
        if (!id || id.startsWith('banner-temp-') || id === 'hero-primary') {
            return await createBanner({
                title: data.title || 'Slide',
                subtitle: data.subtitle,
                imageUrl: data.imageUrl || '',
                ctaLabel: data.ctaLabel,
                ctaHref: data.ctaHref,
                sortOrder: data.sortOrder,
                isActive: data.isActive,
            })
        }

        const banner = await prisma.banner.update({
            where: { id },
            data,
        })

        revalidatePath('/')
        revalidatePath('/account/banners')
        revalidatePath('/account/site')
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

        if (!id || id.startsWith('banner-temp-') || id === 'hero-primary') {
            return { success: true }
        }

        await prisma.banner.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/account/banners')
        revalidatePath('/account/site')
        return { success: true }
    } catch (error) {
        console.error('Error deleting banner:', error)
        return { success: false, error: 'Failed to delete banner' }
    }
}

export async function toggleBannerActive(id: string, isActive: boolean) {
    return updateBanner(id, { isActive })
}
