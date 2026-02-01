import ShopSection from '@/components/ShopSection'
import { getAllProducts } from '@/actions/products'
import { getAllBrands } from '@/actions/brands'
import { getAllCategories } from '@/actions/categories'
import { getAllSizes } from '@/actions/sizes'

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
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
    <div className="pt-16">
      <ShopSection
        initialProducts={initialProducts || []}
        brands={brands || []}
        categories={categories || []}
        sizes={sizes || []}
      />
    </div>
  )
}
