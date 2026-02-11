// Mock data for immediate display while database is being set up
export const mockProducts = [
    {
        id: '1',
        name: 'Premium Leather Sofa',
        slug: 'premium-leather-sofa',
        description: 'Luxurious Italian leather sofa with premium craftsmanship',
        price: 2500,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
        categoryId: '1',
        brandId: '1',
        sizeId: '1',
        inStock: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Modern Dining Table',
        slug: 'modern-dining-table',
        description: 'Elegant oak dining table for 6-8 people',
        price: 1800,
        images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'],
        categoryId: '2',
        brandId: '2',
        sizeId: '2',
        inStock: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        name: 'King Size Mattress',
        slug: 'king-size-mattress',
        description: 'Premium memory foam mattress with cooling technology',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
        categoryId: '3',
        brandId: '3',
        sizeId: '3',
        inStock: true,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const mockBrands = [
    { id: '1', name: 'Italian Luxury', slug: 'italian-luxury', description: 'Premium Italian furniture', logo: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Nordic Design', slug: 'nordic-design', description: 'Scandinavian minimalism', logo: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Comfort Plus', slug: 'comfort-plus', description: 'Premium mattresses', logo: null, createdAt: new Date(), updatedAt: new Date() },
];

export const mockCategories = [
    { id: '1', name: 'Sofas', slug: 'sofas', description: 'Living room sofas', image: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Dining', slug: 'dining', description: 'Dining furniture', image: null, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Mattresses', slug: 'mattresses', description: 'Premium mattresses', image: null, createdAt: new Date(), updatedAt: new Date() },
];

export const mockSizes = [
    { id: '1', label: 'Large', width: 6, length: 7, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', label: 'Medium', width: 4.5, length: 6, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', label: 'King', width: 6, length: 7, createdAt: new Date(), updatedAt: new Date() },
];
