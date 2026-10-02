import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import StyleComfortSection from '@/components/StyleComfortSection'
import ScrollLabels from '@/components/ScrollLabels'
import CollectionsSection from '@/components/CollectionsSection'
import PromoBanner from '@/components/PromoBanner'
import FeaturedProducts from '@/components/FeaturedProducts'
import EditorialJournal from '@/components/EditorialJournal'
import NewsletterSection from '@/components/NewsletterSection'
import { getAllProducts } from '@/actions/products'
import { getAllBrands } from '@/actions/brands'
import { getAllCategories } from '@/actions/categories'
import { getActiveBanners } from '@/actions/banners'
import { getPublishedBlogPosts } from '@/actions/blog'
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
  const [productsResult, brandsResult, categoriesResult, bannersResult, blogResult] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
    getActiveBanners(),
    getPublishedBlogPosts({ limit: 3 }),
  ])

  const initialProducts = [...((productsResult.success ? productsResult.data : []) || [])]
  const brands = brandsResult.success ? brandsResult.data : []
  const categories = categoriesResult.success ? categoriesResult.data : []
  const banners = bannersResult.success ? bannersResult.data : []
  const blogPosts = (blogResult.success && blogResult.data) ? blogResult.data : []
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

  const scrollLabels = labels

  return (
    <div className="bg-transparent">
      <HeroSection banners={banners || []} />
      <StorySection brandCount={brands?.length || 0} />
      <StyleComfortSection />
      <ScrollLabels labels={scrollLabels} />
      <CollectionsSection collections={collections} />
      <PromoBanner />
      <FeaturedProducts products={featured} />
      <EditorialJournal posts={blogPosts} />
      <NewsletterSection />
    </div>
  )
}
