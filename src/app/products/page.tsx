import type { Metadata } from 'next'
import { Suspense } from 'react'
import ShopSection from '@/components/ShopSection'
import { getAllProducts } from '@/actions/products'
import { getAllBrands } from '@/actions/brands'
import { getAllCategories } from '@/actions/categories'
import { getAllSizes } from '@/actions/sizes'
import { getSiteSettings } from '@/actions/site-settings'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://smartbestbrands.com'

export const metadata: Metadata = {
  title: 'Shop Mattresses & Furniture | Smart Best Brands Nigeria',
  description:
    'Browse 100% genuine Mouka, Vitafoam, and Royal Foam mattresses — plus luxury pillows and furniture. Factory-direct pricing, manufacturer warranties, and nationwide delivery.',
  keywords: [
    'buy mattress Nigeria',
    'Mouka foam price list',
    'Vitafoam mattress Nigeria',
    'Royal Foam mattresses',
    'orthopedic mattress Nigeria',
    'luxury furniture Lagos',
    'furniture Abuja',
    'semi orthopedic mattress',
    'spring mattress Lagos',
    'bed frames Lagos',
  ],
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Shop Original Mattresses & Furniture | Smart Best Brands Nigeria',
    description:
      'Genuine Mouka, Vitafoam, and Royal Foam mattresses with factory warranties. Fast delivery across Nigeria.',
    url: `${BASE_URL}/products`,
    siteName: 'Smart Best Brands',
    images: [
      {
        url: `${BASE_URL}/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg`,
        width: 1200,
        height: 630,
        alt: 'Smart Best Brands — Original Mattresses & Furniture',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Original Mattresses & Furniture | Smart Best Brands Nigeria',
    description:
      'Original Mouka, Vitafoam, Royal Foam mattresses and luxury furniture with nationwide delivery.',
    images: [`${BASE_URL}/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg`],
  },
}

export default async function ProductsPage() {
  const [productsResult, brandsResult, categoriesResult, sizesResult, siteSettings] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
    getAllSizes(),
    getSiteSettings(),
  ])

  const initialProducts = productsResult.success ? productsResult.data : []
  const brands = brandsResult.success ? brandsResult.data : []
  const categories = categoriesResult.success ? categoriesResult.data : []
  const sizes = sizesResult.success ? sizesResult.data : []

  const shopTitle = siteSettings.shopPageTitle || 'The Collection'
  const shopTagline = siteSettings.shopPageTagline || 'Original mattresses, luxury furniture, and bedding — every piece factory-sealed and warranted.'

  return (
    <div className="pt-16 sm:pt-20">
      {/* Page header — driven by site settings */}
      <div id="products-header" className="border-b border-blue-950/5 bg-white pt-10 pb-0 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8">
            <div>
              <p className="text-[10px] font-black tracking-[0.35em] uppercase text-sky-600 mb-2">
                {siteSettings.siteName}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-blue-950 tracking-tight leading-none">
                {shopTitle}
              </h1>
            </div>
            <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
              {shopTagline}
            </p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="py-24 flex justify-center">
            <div className="w-8 h-8 border-2 border-blue-950/20 border-t-blue-950 rounded-full animate-spin" />
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
