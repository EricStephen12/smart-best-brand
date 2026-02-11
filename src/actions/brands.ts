'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { mockBrands } from '@/lib/mockData'

// Get all brands
export async function getAllBrands() {
    try {
        if (process.env.USE_MOCK_DATA === 'true') {
            return { success: true, data: mockBrands.map(b => ({ ...b, _count: { products: 0 } })) };
        }
        const brands = await prisma.brand.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        })
        return { success: true, data: brands }
    } catch (error) {
        console.error('Error fetching brands:', error)
        return { success: false, error: 'Failed to fetch brands' }
    }
}

// Get brand by slug
export async function getBrandBySlug(slug: string) {
    try {
        const brand = await prisma.brand.findUnique({
            where: { slug },
            include: {
                products: {
                    where: { isActive: true },
                    include: {
                        variants: {
                            include: { size: true }
                        }
                    }
                }
            }
        })
        return { success: true, data: brand }
    } catch (error) {
        console.error('Error fetching brand:', error)
        return { success: false, error: 'Failed to fetch brand' }
    }
}

// Create brand
export async function createBrand(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const logoUrl = formData.get('logoUrl') as string
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                logoUrl: logoUrl || null,
                isActive: true
            }
        })

        revalidatePath('/account/brands')
        revalidatePath('/products')

        return { success: true, data: brand }
    } catch (error) {
        console.error('Error creating brand:', error)
        return { success: false, error: 'Failed to create brand' }
    }
}

// Update brand
export async function updateBrand(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string
        const logoUrl = formData.get('logoUrl') as string
        const isActive = formData.get('isActive') === 'true'
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

        const brand = await prisma.brand.update({
            where: { id },
            data: {
                name,
                slug,
                logoUrl: logoUrl || null,
                isActive
            }
        })

        revalidatePath('/account/brands')
        revalidatePath('/products')

        return { success: true, data: brand }
    } catch (error) {
        console.error('Error updating brand:', error)
        return { success: false, error: 'Failed to update brand' }
    }
}

// Delete brand
export async function deleteBrand(id: string) {
    try {
        await prisma.brand.delete({
            where: { id }
        })

        revalidatePath('/account/brands')
        revalidatePath('/products')

        return { success: true }
    } catch (error) {
        console.error('Error deleting brand:', error)
        return { success: false, error: 'Failed to delete brand. It may have associated products.' }
    }
}
