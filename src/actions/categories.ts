'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { mockCategories } from '@/lib/mockData'

// Get all categories
export async function getAllCategories() {
    try {
        if (process.env.USE_MOCK_DATA === 'true') {
            return { success: true, data: mockCategories.map(c => ({ ...c, _count: { products: 0 } })) };
        }
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        })
        return { success: true, data: categories }
    } catch (error) {
        console.error('Error fetching categories:', error)
        return { success: false, error: 'Failed to fetch categories' }
    }
}

// Create category
export async function createCategory(formData: FormData) {
    try {
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
