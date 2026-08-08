import { Suspense } from 'react'
import ShopSection from '@/components/ShopSection'
import { getAllProducts } from '@/actions/products'
import { getAllBrands } from '@/actions/brands'
import { getAllCategories } from '@/actions/categories'
import { getAllSizes } from '@/actions/sizes'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const [productsResult, brandsResult, categoriesResult, sizesResult] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
    getAllSizes(),
  ])

  const initialProducts = productsResult.success ? productsResult.data : []
  const brands = brandsResult.success ? brandsResult.data : []
  const categories = categoriesResult.success ? categoriesResult.data : []
  const sizes = sizesResult.success ? sizesResult.data : []

  return (
    <div className="pt-16 sm:pt-20">
      <Suspense
        fallback={
          <div className="py-24 text-center text-sm text-stone-500 tracking-wide">
            Loading products…
          </div>
        }
      >
        <ShopSection
          initialProducts={(initialProducts || []) as never[]}
          brands={(brands || []) as never[]}
          categories={(categories || []) as never[]}
          sizes={(sizes || []) as never[]}
        />
      </Suspense>
    </div>
  )
}
