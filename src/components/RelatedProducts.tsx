import Link from 'next/link'
import Image from 'next/image'
import SectionHeading from '@/components/SectionHeading'

type RelatedProduct = {
  id: string
  name: string
  slug: string
  images: string[]
  brand?: { name: string } | null
  variants: Array<{ price: number; promoPrice: number | null }>
}

export default function RelatedProducts({
  products,
  categoryLabel,
}: {
  products: RelatedProduct[]
  categoryLabel?: string
}) {
  if (!products.length) return null

  return (
    <section className="mt-16 sm:mt-20 border-t border-blue-950/5 pt-14 sm:pt-16">
      <SectionHeading
        eyebrow="More to explore"
        title={categoryLabel ? `More in ${categoryLabel}` : 'Related products'}
        className="!mb-10"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.map((product) => {
          const prices = product.variants.map((v) => v.price)
          const promos = product.variants
            .map((v) => v.promoPrice)
            .filter((p): p is number => typeof p === 'number' && p > 0)
          const minPrice = prices.length ? Math.min(...prices) : 0
          const minPromo = promos.length ? Math.min(...promos) : Infinity
          const display = minPromo !== Infinity ? minPromo : minPrice
          const onSale = minPromo !== Infinity && minPromo < minPrice

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="relative aspect-square bg-[var(--brand-bg)] overflow-hidden mb-3 border border-blue-950/5">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                ) : null}
                {onSale ? (
                  <span className="absolute top-3 left-3 bg-sky-600 text-white text-[9px] font-black tracking-widest uppercase px-2 py-1">
                    Sale
                  </span>
                ) : null}
              </div>
              <p className="text-[10px] font-medium text-stone-400 tracking-[0.18em] uppercase mb-1">
                {product.brand?.name || 'Product'}
              </p>
              <h3 className="text-sm font-medium text-blue-950 line-clamp-2 group-hover:text-sky-700 transition-colors">
                {product.name}
              </h3>
              {display > 0 ? (
                <p className="text-sm text-blue-950/70 mt-1 font-medium">
                  ₦{display.toLocaleString()}
                  {onSale ? (
                    <span className="ml-2 text-stone-300 line-through text-xs font-normal">
                      ₦{minPrice.toLocaleString()}
                    </span>
                  ) : null}
                </p>
              ) : null}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
