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

export const dynamic = 'force-dynamic'

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
