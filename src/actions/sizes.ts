'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// Get all sizes (100% real database, 0 mock data)
export async function getAllSizes() {
    try {
        const sizes = await prisma.size.findMany({
            orderBy: { label: 'asc' },
            include: {
                _count: {
                    select: { variants: true }
                }
            }
        })
        return { success: true, data: sizes }
    } catch (error: any) {
        console.warn('Initial sizes fetch error, retrying in 1s for DB cold-start...', error?.message)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const retrySizes = await prisma.size.findMany({
                orderBy: { label: 'asc' },
                include: {
                    _count: {
                        select: { variants: true }
                    }
                }
            })
            return { success: true, data: retrySizes }
        } catch (retryError) {
            console.error('Final sizes fetch error:', retryError)
            return { success: true, data: [] }
        }
    }
}

// Create size
export async function createSize(formData: FormData) {
    try {
        await requireAdmin()
        const label = formData.get('label') as string
        const width = formData.get('width') ? parseFloat(formData.get('width') as string) : null
        const length = formData.get('length') ? parseFloat(formData.get('length') as string) : null

        const size = await prisma.size.create({
            data: {
                label,
                width,
                length
            }
        })

        revalidatePath('/account/sizes')
        revalidatePath('/products')

        return { success: true, data: size }
    } catch (error) {
        console.error('Error creating size:', error)
        return { success: false, error: 'Failed to create size' }
    }
}

// Update size
export async function updateSize(id: string, formData: FormData) {
    try {
        await requireAdmin()
        const label = formData.get('label') as string
        const width = formData.get('width') ? parseFloat(formData.get('width') as string) : null
        const length = formData.get('length') ? parseFloat(formData.get('length') as string) : null

        const size = await prisma.size.update({
            where: { id },
            data: {
                label,
                width,
                length
            }
        })

        revalidatePath('/account/sizes')
        revalidatePath('/products')

        return { success: true, data: size }
    } catch (error) {
        console.error('Error updating size:', error)
        return { success: false, error: 'Failed to update size' }
    }
}

// Delete size
export async function deleteSize(id: string) {
    try {
        await requireAdmin()

        const variantCount = await prisma.productVariant.count({
            where: { sizeId: id }
        })

        if (variantCount > 0) {
            return {
                success: false,
                error: `Cannot delete this size because it is currently linked to ${variantCount} product variant${variantCount > 1 ? 's' : ''}. Please remove or reassign the variant from the product first.`
            }
        }

        await prisma.size.delete({
            where: { id }
        })

        revalidatePath('/account/sizes')
        revalidatePath('/products')

        return { success: true }
    } catch (error: any) {
        console.error('Error deleting size:', error)
        if (error?.code === 'P2003') {
            return {
                success: false,
                error: 'Cannot delete this size because it is linked to existing products or orders.'
            }
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete size'
        }
    }
}

