import React from 'react'
import { getProductBySlug } from '@/actions/products'
import { getProductReviews, getRelatedProducts } from '@/actions/reviews'
import ProductDetailView from '@/components/ProductDetailView'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export const dynamic = 'force-dynamic'

export default async function ProductDetailsPage({ params }: PageProps) {
    const { slug } = await params
    const result = await getProductBySlug(slug)

    if (!result.success || !result.data) {
        notFound()
    }

    const product = result.data
    const categoryIds = product.categories?.map((c: { categoryId: string }) => c.categoryId) || []
    const relatedCategoryLabel =
        product.categories?.[0]?.category?.name || undefined

    const [reviewsResult, relatedResult] = await Promise.all([
        getProductReviews(product.id),
        getRelatedProducts(product.id, product.brandId, categoryIds, 4),
    ])

    return (
        <ProductDetailView
            product={product}
            reviews={reviewsResult.success ? reviewsResult.data?.reviews || [] : []}
            averageRating={reviewsResult.success ? reviewsResult.data?.averageRating || 0 : 0}
            reviewCount={reviewsResult.success ? reviewsResult.data?.count || 0 : 0}
            relatedProducts={relatedResult.success ? relatedResult.data || [] : []}
            relatedCategoryLabel={relatedCategoryLabel}
        />
    )
}
