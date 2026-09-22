import React, { cache } from 'react'
import type { Metadata } from 'next'
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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com'
const FALLBACK_OG_IMAGE = `${BASE_URL}/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg`

/** Cached so generateMetadata and the page component share one DB round-trip. */
const fetchProduct = cache((slug: string) => getProductBySlug(slug))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const result = await fetchProduct(slug)

    if (!result.success || !result.data) {
        return {
            title: 'Product Not Found | Smart Best Brands',
        }
    }

    const product = result.data
    const brandName = product.brand?.name || 'Smart Best Brands'
    const title = `${product.name} | ${brandName} Nigeria`
    const description =
        product.description?.slice(0, 160) ||
        `Buy authentic ${product.name} from ${brandName} at Smart Best Brands. Guaranteed original quality with reliable delivery across Nigeria.`
    const image = product.images?.[0] || FALLBACK_OG_IMAGE

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/products/${slug}`,
            siteName: 'Smart Best Brands',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
            type: 'website',
            locale: 'en_NG',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    }
}

export default async function ProductDetailsPage({ params }: PageProps) {
    const { slug } = await params
    const result = await fetchProduct(slug)

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

    const reviews = reviewsResult.success ? reviewsResult.data?.reviews || [] : []
    const averageRating = reviewsResult.success ? reviewsResult.data?.averageRating || 0 : 0
    const reviewCount = reviewsResult.success ? reviewsResult.data?.count || 0 : 0

    // Schema.org Structured Data
    const prices = product.variants?.map((v: any) => v.promoPrice || v.price).filter(Boolean) || [0]
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0
    const hasStock = product.variants?.some((v: any) => (v.stock ?? 0) > 0)

    const jsonLd = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: product.images || [],
        description: product.description || `Original ${product.name} available at Smart Best Brands.`,
        brand: {
            '@type': 'Brand',
            name: product.brand?.name || 'Smart Best Brands',
        },
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'NGN',
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: product.variants?.length || 1,
            availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        ...(reviewCount > 0
            ? {
                  aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: averageRating,
                      reviewCount: reviewCount,
                  },
              }
            : {}),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailView
                product={product}
                reviews={reviews}
                averageRating={averageRating}
                reviewCount={reviewCount}
                relatedProducts={relatedResult.success ? relatedResult.data || [] : []}
                relatedCategoryLabel={relatedCategoryLabel}
            />
        </>
    )
}
