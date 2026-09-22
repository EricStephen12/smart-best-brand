import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import ScrollLabels from '@/components/ScrollLabels'
import CollectionsSection from '@/components/CollectionsSection'
import PromoBanner from '@/components/PromoBanner'
import FeaturedProducts from '@/components/FeaturedProducts'
import { getAllProducts } from '@/actions/products'
import { getAllBrands } from '@/actions/brands'
import { getAllCategories } from '@/actions/categories'
import { getActiveBanners } from '@/actions/banners'
import { buildCollectionTiles } from '@/lib/collections'
import { pickFeaturedProducts } from '@/lib/featured-products'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Smart Best Brands — Original Mattresses & Luxury Furniture Nigeria',
  description:
    "Nigeria's home for original Mouka, Vitafoam, and Royal Foam mattresses — plus luxury furniture, pillows, and bedding. Factory-direct pricing, genuine warranties, and doorstep delivery across Nigeria.",
  openGraph: {
    title: 'Smart Best Brands — Original Mattresses & Luxury Furniture Nigeria',
    description:
      "Factory-direct Mouka, Vitafoam, and Royal Foam mattresses — plus luxury furniture and bedding. 100% original, every time. Nationwide delivery across Nigeria.",
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com',
    siteName: 'Smart Best Brands',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com'}/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg`,
        width: 1200,
        height: 630,
        alt: 'Smart Best Brands — Original Mattresses & Luxury Furniture',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Best Brands — Original Mattresses & Luxury Furniture Nigeria',
    description:
      'Original Mouka, Vitafoam, Royal Foam mattresses and luxury furniture. Factory-direct, warranted, nationwide delivery.',
    images: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com'}/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg`,
    ],
  },
}

export default async function Home() {
  const [productsResult, brandsResult, categoriesResult, bannersResult] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
    getActiveBanners(),
  ])

  // Prisma vs mock return a union of product shapes — normalize to one array type.
  const initialProducts = [...((productsResult.success ? productsResult.data : []) || [])]
  const brands = brandsResult.success ? brandsResult.data : []
  const categories = categoriesResult.success ? categoriesResult.data : []
  const banners = bannersResult.success ? bannersResult.data : []
  const featured = pickFeaturedProducts(initialProducts, 8)
  const collections = buildCollectionTiles(categories || [], initialProducts, 4)

  const labels = [
    ...(categories || []).map((c) => ({
      id: `cat-${c.id}`,
      name: c.name,
      href: `/products?category=${encodeURIComponent(c.name)}`,
    })),
    ...(brands || []).map((b) => ({
      id: `brand-${b.id}`,
      name: b.name,
      href: `/products?brand=${encodeURIComponent(b.name)}`,
    })),
  ]

  // Ensure marquee has enough items to scroll smoothly
  const scrollLabels =
    labels.length >= 4
      ? labels
      : [
          ...labels,
          { id: 'x1', name: 'Mattresses', href: '/products?category=Mattresses' },
          { id: 'x2', name: 'Furniture', href: '/products?category=Furniture' },
          { id: 'x3', name: 'Pillows', href: '/products?category=Pillows' },
          { id: 'x4', name: 'Shop all', href: '/products' },
        ]

  return (
    <div className="bg-white">
      <HeroSection banners={banners || []} />
      <StorySection brandCount={brands?.length || 0} />
      <ScrollLabels labels={scrollLabels} />
      <CollectionsSection collections={collections} />
      <PromoBanner />
      <FeaturedProducts products={featured} />
    </div>
  )
}
