import type { CollectionTile } from '@/components/CollectionsSection'

type CategoryLike = {
    id: string
    name: string
    slug?: string
}

type ProductLike = {
    id: string
    name: string
    slug: string
    images?: string[]
    categories?: Array<{
        categoryId?: string
        category?: { id: string; name: string }
    }>
}

/** Build up to 4 collection tiles from categories, using a product image when available. */
export function buildCollectionTiles(
    categories: CategoryLike[],
    products: ProductLike[],
    limit = 4
): CollectionTile[] {
    const fromCategories = categories.slice(0, limit).map((category) => {
        const match = products.find((product) =>
            product.categories?.some(
                (c) => c.categoryId === category.id || c.category?.id === category.id
            )
        )
        return {
            id: category.id,
            name: category.name,
            href: `/products?category=${encodeURIComponent(category.name)}`,
            imageUrl: match?.images?.[0] || null,
        }
    })

    if (fromCategories.length >= limit) return fromCategories

    // Fill remaining slots with featured products if few categories
    const usedImages = new Set(fromCategories.map((c) => c.imageUrl).filter(Boolean))
    for (const product of products) {
        if (fromCategories.length >= limit) break
        const image = product.images?.[0]
        if (!image || usedImages.has(image)) continue
        fromCategories.push({
            id: `product-${product.id}`,
            name: product.name,
            href: `/products/${product.slug}`,
            imageUrl: image,
        })
        usedImages.add(image)
    }

    return fromCategories
}
