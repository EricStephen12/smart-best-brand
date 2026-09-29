'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// Get all categories (100% real database, 0 mock data)
export async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        })
        return { success: true, data: categories }
    } catch (error: any) {
        console.warn('Initial categories fetch error, retrying in 1s for DB cold-start...', error?.message)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const retryCategories = await prisma.category.findMany({
                orderBy: { name: 'asc' },
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            })
            return { success: true, data: retryCategories }
        } catch (retryError) {
            console.error('Final categories fetch error:', retryError)
            return { success: true, data: [] }
        }
    }
}

// Create category
export async function createCategory(formData: FormData) {
    try {
        await requireAdmin()
        const name = formData.get('name') as string
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

        const category = await prisma.category.create({
            data: {
                name,
                slug
            }
        })

        revalidatePath('/account/categories')
        revalidatePath('/products')

        return { success: true, data: category }
    } catch (error) {
        console.error('Error creating category:', error)
        return { success: false, error: 'Failed to create category' }
    }
}

// Update category
export async function updateCategory(id: string, formData: FormData) {
    try {
        await requireAdmin()
        const name = formData.get('name') as string
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug
            }
        })

        revalidatePath('/account/categories')
        revalidatePath('/products')

        return { success: true, data: category }
    } catch (error) {
        console.error('Error updating category:', error)
        return { success: false, error: 'Failed to update category' }
    }
}

// Delete category
export async function deleteCategory(id: string) {
    try {
        await requireAdmin()
        await prisma.category.delete({
            where: { id }
        })

        revalidatePath('/account/categories')
        revalidatePath('/products')

        return { success: true }
    } catch (error) {
        console.error('Error deleting category:', error)
        return { success: false, error: 'Failed to delete category' }
    }
}
