import HeroSection from '@/components/HeroSection'
import StorySection from '@/components/StorySection'
import ShopSection from '@/components/ShopSection'
import { getAllProducts } from '@/actions/products'
import { getAllBrands } from '@/actions/brands'
import { getAllCategories } from '@/actions/categories'
import { getAllSizes } from '@/actions/sizes'

export default async function Home() {
  const [productsResult, brandsResult, categoriesResult, sizesResult] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
    getAllSizes()
  ]);

  const initialProducts = productsResult.success ? productsResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];
  const categories = categoriesResult.success ? categoriesResult.data : [];
  const sizes = sizesResult.success ? sizesResult.data : [];

  return (
    <>
      <HeroSection />
      <StorySection brandCount={brands?.length || 0} />
      <ShopSection
        initialProducts={initialProducts || []}
        brands={brands || []}
        categories={categories || []}
        sizes={sizes || []}
      />
    </>
  )
}