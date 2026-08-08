/** Minimal shape needed to choose featured items from Prisma or mock products. */
export type FeaturedPickable = {
  id: string
  images?: string[] | null
  variants?: Array<{ price?: number; promoPrice?: number | null }> | null
}

export function pickFeaturedProducts<T extends FeaturedPickable>(
  products: readonly T[],
  limit = 8
): T[] {
  const withImage = products.filter((p) => Boolean(p.images?.[0]))
  const withPromo = withImage.filter((p) =>
    p.variants?.some((v) => typeof v.promoPrice === 'number' && v.promoPrice > 0)
  )
  const rest = withImage.filter((p) => !withPromo.some((x) => x.id === p.id))
  return [...withPromo, ...rest].slice(0, limit)
}
