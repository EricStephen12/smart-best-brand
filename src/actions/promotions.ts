'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

// Get all promotions
export async function getAllPromotions() {
    try {
        const promotions = await prisma.promotion.findMany({
            include: {
                products: { include: { product: true } },
                categories: { include: { category: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: promotions }
    } catch (error) {
        console.error('Error fetching promotions:', error)
        return { success: false, error: 'Failed to fetch promotions' }
    }
}

// ... (getActivePromotions remains similar but could include relations if needed)

// Create promotion
export async function createPromotion(formData: FormData) {
    try {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const code = formData.get('code') as string
        const discountType = formData.get('discountType') as string
        const discountValue = parseFloat(formData.get('discountValue') as string)
        const minPurchase = formData.get('minPurchase') ? parseFloat(formData.get('minPurchase') as string) : null
        const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : null
        const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : null

        // Targeting
        const appliesTo = formData.get('appliesTo') as string || 'ALL'
        const selectedIds = JSON.parse(formData.get('selectedIds') as string || '[]') as string[]

        const promotion = await prisma.promotion.create({
            data: {
                title,
                description,
                code: code ? code.toUpperCase() : null,
                discountType,
                discountValue,
                minPurchase,
                startDate,
                endDate,
                isActive: true,
                appliesTo,
                products: appliesTo === 'PRODUCTS' ? {
                    create: selectedIds.map(id => ({ productId: id }))
                } : undefined,
                categories: appliesTo === 'CATEGORIES' ? {
                    create: selectedIds.map(id => ({ categoryId: id }))
                } : undefined
            }
        })

        revalidatePath('/account/promotions')
        revalidatePath('/checkout')

        return { success: true, data: promotion }
    } catch (error) {
        console.error('Error creating promotion:', error)
        return { success: false, error: 'Failed to create promotion' }
    }
}

// Update promotion
export async function updatePromotion(id: string, formData: FormData) {
    try {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const code = formData.get('code') as string
        const discountType = formData.get('discountType') as string
        const discountValue = parseFloat(formData.get('discountValue') as string)
        const minPurchase = formData.get('minPurchase') ? parseFloat(formData.get('minPurchase') as string) : null
        const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : null
        const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : null
        const isActive = formData.get('isActive') === 'true'

        // Targeting
        const appliesTo = formData.get('appliesTo') as string || 'ALL'
        const selectedIds = JSON.parse(formData.get('selectedIds') as string || '[]') as string[]

        // First clean up existing relations
        await prisma.promotionProduct.deleteMany({ where: { promotionId: id } })
        await prisma.promotionCategory.deleteMany({ where: { promotionId: id } })

        const promotion = await prisma.promotion.update({
            where: { id },
            data: {
                title,
                description,
                code: code ? code.toUpperCase() : null,
                discountType,
                discountValue,
                minPurchase,
                startDate,
                endDate,
                isActive,
                appliesTo,
                products: appliesTo === 'PRODUCTS' ? {
                    create: selectedIds.map(productId => ({ productId }))
                } : undefined,
                categories: appliesTo === 'CATEGORIES' ? {
                    create: selectedIds.map(categoryId => ({ categoryId }))
                } : undefined
            }
        })

        revalidatePath('/account/promotions')
        revalidatePath('/checkout')

        return { success: true, data: promotion }
    } catch (error) {
        console.error('Error updating promotion:', error)
        return { success: false, error: 'Failed to update promotion' }
    }
}

// Validate promotion code
export async function validatePromotionCode(
    code: string,
    subtotal: number,
    cartItems?: { productId: string, categoryIds: string[] }[]
) {
    try {
        const now = new Date()
        const promotion = await prisma.promotion.findFirst({
            where: {
                code: code.toUpperCase(),
                isActive: true,
                OR: [
                    { startDate: null },
                    { startDate: { lte: now } }
                ],
                AND: [
                    {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: now } }
                        ]
                    }
                ]
            },
            include: {
                products: true,
                categories: true
            }
        })

        if (!promotion) {
            return { success: false, error: 'Invalid or expired promotion code' }
        }

        // Shopify Standard: Scope Validation
        if (promotion.appliesTo !== 'ALL' && cartItems) {
            const promotionProductIds = promotion.products.map(p => p.productId)
            const promotionCategoryIds = promotion.categories.map(c => c.categoryId)

            const appliesToAny = cartItems.some(item => {
                if (promotion.appliesTo === 'PRODUCTS') {
                    return promotionProductIds.includes(item.productId)
                }
                if (promotion.appliesTo === 'CATEGORIES') {
                    return item.categoryIds.some(cid => promotionCategoryIds.includes(cid))
                }
                return false
            })

            if (!appliesToAny) {
                return {
                    success: false,
                    error: promotion.appliesTo === 'PRODUCTS'
                        ? 'This code only applies to specific products'
                        : 'This code only applies to specific categories'
                }
            }
        }

        if (promotion.minPurchase && subtotal < promotion.minPurchase) {
            return {
                success: false,
                error: `Minimum purchase of ₦${promotion.minPurchase.toLocaleString()} required`
            }
        }

        let discount = 0
        if (promotion.discountType === 'Percentage') {
            discount = (subtotal * promotion.discountValue) / 100
        } else {
            discount = promotion.discountValue
        }

        return {
            success: true,
            data: {
                promotion,
                discount
            }
        }
    } catch (error) {
        console.error('Error validating promotion code:', error)
        return { success: false, error: 'Failed to validate promotion code' }
    }
}

// Delete promotion
export async function deletePromotion(id: string) {
    try {
        await prisma.promotion.delete({
            where: { id }
        })

        revalidatePath('/account/promotions')
        revalidatePath('/checkout')

        return { success: true }
    } catch (error) {
        console.error('Error deleting promotion:', error)
        return { success: false, error: 'Failed to delete promotion' }
    }
}
