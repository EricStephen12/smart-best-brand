import type { Metadata } from 'next'
import { Suspense } from 'react'
import ShopSection from '@/components/ShopSection'
import { getAllProducts } from '@/actions/products'
import { getAllBrands } from '@/actions/brands'
import { getAllCategories } from '@/actions/categories'
import { getAllSizes } from '@/actions/sizes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Buy Original Mattresses & Furniture in Nigeria | Mouka, Vitafoam, Royal Foam',
  description:
    'Browse Nigeria’s premier catalog of 100% genuine mattresses, orthopedic beds, luxury pillows, and bespoke home furniture. Competitive prices with doorstep delivery across Lagos, Abuja, and nationwide.',
  keywords: [
    'buy mattress Nigeria',
    'Mouka foam price list',
    'Vitafoam mattress price Nigeria',
    'Royal Foam mattresses',
    'orthopedic mattress Nigeria',
    'luxury furniture Lagos',
    'furniture Abuja',
    'semi orthopedic mattress',
    'spring mattress Lagos',
    'bed frames Lagos',
  ],
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Original Mattresses & Luxury Furniture Catalog | Smart Best Brands',
    description:
      'Guaranteed authentic Mouka, Vitafoam, and Royal Foam mattresses with direct nationwide delivery.',
    url: 'https://smartbestbrands.com/products',
    siteName: 'Smart Best Brands',
    images: [
      {
        url: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Best Brands Products Catalog',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Original Mattresses & Furniture | Smart Best Brands Nigeria',
    description:
      'Shop original Mouka, Vitafoam, Royal Foam, and luxury furniture with fast delivery across Nigeria.',
    images: ['/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg'],
  },
}

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
