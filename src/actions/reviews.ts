'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'

export async function getFeaturedReviews(limit = 6) {
    try {
        const reviews = await prisma.review.findMany({
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                product: { select: { name: true } },
            },
        })
        return { success: true, data: reviews }
    } catch (error) {
        console.error('Error fetching featured reviews:', error)
        return { success: false, error: 'Failed to fetch reviews', data: [] as never[] }
    }
}

export async function getProductReviews(productId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: { productId, isApproved: true },
            orderBy: { createdAt: 'desc' },
        })

        const avg =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0

        return {
            success: true,
            data: {
                reviews,
                averageRating: Math.round(avg * 10) / 10,
                count: reviews.length,
            },
        }
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return { success: false, error: 'Failed to fetch reviews' }
    }
}

export async function getRelatedProducts(productId: string, brandId: string, categoryIds: string[], limit = 4) {
    try {
        const include = {
            brand: true,
            variants: {
                where: { isActive: true },
                orderBy: { price: 'asc' as const },
                take: 1,
            },
        }

        // Prefer same category — owner sells furniture + bedding across categories
        let products =
            categoryIds.length > 0
                ? await prisma.product.findMany({
                      where: {
                          isActive: true,
                          id: { not: productId },
                          categories: { some: { categoryId: { in: categoryIds } } },
                      },
                      include,
                      take: limit,
                      orderBy: { createdAt: 'desc' },
                  })
                : []

        if (products.length < limit && brandId) {
            const excludeIds = [productId, ...products.map((p) => p.id)]
            const more = await prisma.product.findMany({
                where: {
                    isActive: true,
                    id: { notIn: excludeIds },
                    brandId,
                },
                include,
                take: limit - products.length,
                orderBy: { createdAt: 'desc' },
            })
            products = [...products, ...more]
        }

        return { success: true, data: products }
    } catch (error) {
        console.error('Error fetching related products:', error)
        return { success: false, error: 'Failed to fetch related products', data: [] }
    }
}

export async function submitReview(data: {
    productId: string
    rating: number
    title?: string
    body: string
}) {
    try {
        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Sign in to leave a review' }
        }

        const rating = Math.round(data.rating)
        if (rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' }
        }

        const body = data.body?.trim()
        if (!body || body.length < 10) {
            return { success: false, error: 'Please write a short review (at least 10 characters)' }
        }

        const product = await prisma.product.findUnique({ where: { id: data.productId } })
        if (!product || !product.isActive) {
            return { success: false, error: 'Product not found' }
        }

        const review = await prisma.review.upsert({
            where: {
                productId_userId: {
                    productId: data.productId,
                    userId: session.id,
                },
            },
            create: {
                productId: data.productId,
                userId: session.id,
                authorName: session.name || session.email.split('@')[0],
                rating,
                title: data.title?.trim() || null,
                body,
                isApproved: false,
            },
            update: {
                authorName: session.name || session.email.split('@')[0],
                rating,
                title: data.title?.trim() || null,
                body,
                isApproved: false,
            },
        })

        revalidatePath(`/products/${product.slug}`)
        revalidatePath('/account/reviews')
        return { success: true, data: review }
    } catch (error) {
        console.error('Error submitting review:', error)
        return { success: false, error: 'Failed to submit review' }
    }
}

export async function getAllReviewsAdmin() {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' }
        }

        const reviews = await prisma.review.findMany({
            include: {
                product: { select: { id: true, name: true, slug: true } },
                user: { select: { email: true } },
            },
            orderBy: { createdAt: 'desc' },
        })
        return { success: true, data: reviews }
    } catch (error) {
        console.error('Error fetching admin reviews:', error)
        return { success: false, error: 'Failed to fetch reviews' }
    }
}

export async function setReviewApproval(id: string, isApproved: boolean) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' }
        }

        const review = await prisma.review.update({
            where: { id },
            data: { isApproved },
            include: { product: { select: { slug: true } } },
        })

        revalidatePath(`/products/${review.product.slug}`)
        revalidatePath('/account/reviews')
        return { success: true, data: review }
    } catch (error) {
        console.error('Error updating review:', error)
        return { success: false, error: 'Failed to update review' }
    }
}

export async function deleteReview(id: string) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' }
        }

        const review = await prisma.review.delete({
            where: { id },
            include: { product: { select: { slug: true } } },
        })
        revalidatePath(`/products/${review.product.slug}`)
        revalidatePath('/account/reviews')
        return { success: true }
    } catch (error) {
        console.error('Error deleting review:', error)
        return { success: false, error: 'Failed to delete review' }
    }
}
