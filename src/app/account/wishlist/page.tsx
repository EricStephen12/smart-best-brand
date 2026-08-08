import { redirect } from 'next/navigation'

/** Wishlist is not shipped yet — send users to the shop. */
export default function WishlistPage() {
    redirect('/products')
}
