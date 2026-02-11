'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { mockProducts, mockBrands, mockCategories } from '@/lib/mockData'

interface ProductFilters {
    brandId?: string
    categoryId?: string
    sizeId?: string
    minPrice?: number
    maxPrice?: number
    search?: string
}

// Get all products with filtering
export async function getAllProducts(filters?: ProductFilters) {
    try {
        // If database is unavailable, use mock data
        if (process.env.USE_MOCK_DATA === 'true') {
            console.log('Using mock data for products');
            return {
                success: true,
                data: mockProducts.map(p => ({
                    ...p,
                    brand: mockBrands.find(b => b.id === p.brandId),
                    categories: mockCategories.filter(c => c.id === p.categoryId).map(category => ({ category })),
                    variants: [],
                }))
            };
        }

        const where: any = {
            isActive: true
        }

        if (filters?.brandId) {
            where.brandId = filters.brandId
        }

        if (filters?.categoryId) {
            where.categories = {
                some: {
                    categoryId: filters.categoryId
                }
            }
        }

        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ]
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                brand: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                variants: {
                    where: { isActive: true },
                    include: {
                        size: true
                    },
                    orderBy: { price: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Filter by size and price if needed
        let filteredProducts = products

        if (filters?.sizeId) {
            filteredProducts = products.filter((p: any) =>
                p.variants.some((v: any) => v.sizeId === filters.sizeId)
            )
        }

        if (filters?.minPrice || filters?.maxPrice) {
            filteredProducts = filteredProducts.filter((p: any) => {
                const prices = p.variants.map((v: any) => v.promoPrice || v.price)
                const minProductPrice = Math.min(...prices)
                const maxProductPrice = Math.max(...prices)

                if (filters.minPrice && maxProductPrice < filters.minPrice) return false
                if (filters.maxPrice && minProductPrice > filters.maxPrice) return false
                return true
            })
        }

        return { success: true, data: filteredProducts }
    } catch (error) {
        console.error('Error fetching products:', error)
        return { success: false, error: 'Failed to fetch products' }
    }
}

// Get product by ID
export async function getProductById(id: string) {
    if (!id) return { success: false, error: 'Product ID is required' }
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                brand: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                variants: {
                    include: {
                        size: true
                    },
                    orderBy: { price: 'asc' }
                }
            }
        })

        return { success: true, data: product }
    } catch (error) {
        console.error('Error fetching product by ID:', error)
        return { success: false, error: 'Failed to fetch product' }
    }
}

// Get product by slug
export async function getProductBySlug(slug: string) {
    if (!slug) return { success: false, error: 'Product slug is required' }
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                brand: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                variants: {
                    where: { isActive: true },
                    include: {
                        size: true
                    },
                    orderBy: { price: 'asc' }
                }
            }
        })

        return { success: true, data: product }
    } catch (error) {
        console.error('Error fetching product:', error)
        return { success: false, error: 'Failed to fetch product' }
    }
}

// Create product with variants
export async function createProduct(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const brandId = formData.get('brandId') as string
        const type = formData.get('type') as string
        const materials = formData.get('materials') as string
        const firmness = formData.get('firmness') as string
        const finishing = formData.get('finishing') as string
        const warranty = formData.get('warranty') as string
        const isNegotiable = formData.get('isNegotiable') === 'true'

        // Parse arrays
        const features = JSON.parse(formData.get('features') as string || '[]')
        const images = JSON.parse(formData.get('images') as string || '[]')
        const categoryIds = JSON.parse(formData.get('categoryIds') as string || '[]')
        const variants = JSON.parse(formData.get('variants') as string || '[]')

        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                brandId,
                type,
                materials,
                firmness,
                finishing,
                warranty,
                isNegotiable,
                features,
                images,
                categories: {
                    create: categoryIds.map((categoryId: string) => ({
                        categoryId
                    }))
                },
                variants: {
                    create: variants.map((variant: any) => ({
                        sizeId: variant.sizeId,
                        price: parseFloat(variant.price),
                        promoPrice: variant.promoPrice ? parseFloat(variant.promoPrice) : null,
                        stock: parseInt(variant.stock || '0'),
                        sku: variant.sku || null
                    }))
                }
            },
            include: {
                variants: {
                    include: { size: true }
                },
                categories: {
                    include: { category: true }
                }
            }
        })

        revalidatePath('/account/products')
        revalidatePath('/products')

        return { success: true, data: product }
    } catch (error) {
        console.error('Error creating product:', error)
        return { success: false, error: 'Failed to create product' }
    }
}

// Update product
export async function updateProduct(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const brandId = formData.get('brandId') as string
        const type = formData.get('type') as string
        const materials = formData.get('materials') as string
        const firmness = formData.get('firmness') as string
        const finishing = formData.get('finishing') as string
        const warranty = formData.get('warranty') as string
        const isNegotiable = formData.get('isNegotiable') === 'true'
        const isActive = formData.get('isActive') === 'true'

        const features = JSON.parse(formData.get('features') as string || '[]')
        const images = JSON.parse(formData.get('images') as string || '[]')
        const categoryIds = JSON.parse(formData.get('categoryIds') as string || '[]')
        const variants = JSON.parse(formData.get('variants') as string || '[]')

        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

        // Delete existing categories and variants
        await prisma.productCategory.deleteMany({ where: { productId: id } })
        await prisma.productVariant.deleteMany({ where: { productId: id } })

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                brandId,
                type,
                materials,
                firmness,
                finishing,
                warranty,
                isNegotiable,
                isActive,
                features,
                images,
                categories: {
                    create: categoryIds.map((categoryId: string) => ({
                        categoryId
                    }))
                },
                variants: {
                    create: variants.map((variant: any) => ({
                        sizeId: variant.sizeId,
                        price: parseFloat(variant.price),
                        promoPrice: variant.promoPrice ? parseFloat(variant.promoPrice) : null,
                        stock: parseInt(variant.stock || '0'),
                        sku: variant.sku || null
                    }))
                }
            },
            include: {
                variants: {
                    include: { size: true }
                },
                categories: {
                    include: { category: true }
                }
            }
        })

        revalidatePath('/account/products')
        revalidatePath('/products')
        revalidatePath(`/products/${slug}`)

        return { success: true, data: product }
    } catch (error) {
        console.error('Error updating product:', error)
        return { success: false, error: 'Failed to update product' }
    }
}

// Delete product
export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id }
        })

        revalidatePath('/account/products')
        revalidatePath('/products')

        return { success: true }
    } catch (error) {
        console.error('Error deleting product:', error)
        return { success: false, error: 'Failed to delete product' }
    }
}
