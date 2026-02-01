'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { mockSizes } from '@/lib/mockData'

// Get all sizes
export async function getAllSizes() {
    try {
        if (process.env.USE_MOCK_DATA === 'true') {
            return { success: true, data: mockSizes.map(s => ({ ...s, _count: { variants: 0 } })) };
        }
        const sizes = await prisma.size.findMany({
            orderBy: { label: 'asc' },
            include: {
                _count: {
                    select: { variants: true }
                }
            }
        })
        return { success: true, data: sizes }
    } catch (error) {
        console.error('Error fetching sizes:', error)
        return { success: false, error: 'Failed to fetch sizes' }
    }
}

// Create size
export async function createSize(formData: FormData) {
    try {
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
        await prisma.size.delete({
            where: { id }
        })

        revalidatePath('/account/sizes')
        revalidatePath('/products')

        return { success: true }
    } catch (error) {
        console.error('Error deleting size:', error)
        return { success: false, error: 'Failed to delete size' }
    }
}
