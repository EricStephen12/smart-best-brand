'use client'

import React, { useEffect, useState } from 'react'
import { deleteReview, getAllReviewsAdmin, setReviewApproval } from '@/actions/reviews'
import toast from 'react-hot-toast'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'

type AdminReview = {
    id: string
    authorName: string
    rating: number
    title: string | null
    body: string
    isApproved: boolean
    createdAt: string | Date
    product: { id: string; name: string; slug: string }
    user: { email: string } | null
}

export default function ReviewsAdminPage() {
    const [reviews, setReviews] = useState<AdminReview[]>([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setLoading(true)
        const result = await getAllReviewsAdmin()
        if (result.success && result.data) setReviews(result.data as AdminReview[])
        else toast.error(result.error || 'Failed to load reviews')
        setLoading(false)
    }

    useEffect(() => {
        void load()
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-blue-950">Product reviews</h1>
                <p className="text-sm text-stone-500 mt-1">
                    Approve reviews before they appear on product pages.
                </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-sky-700" />
                    </div>
                ) : reviews.length === 0 ? (
                    <p className="p-8 text-sm text-stone-500 text-center">No reviews yet</p>
                ) : (
                    <ul className="divide-y divide-stone-100">
                        {reviews.map((review) => (
                            <li key={review.id} className="p-4 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-medium text-blue-950">
                                            {review.authorName}
                                            <span className="text-stone-400 font-normal">
                                                {' '}· {review.user?.email}
                                            </span>
                                        </p>
                                        <Link
                                            href={`/products/${review.product.slug}`}
                                            className="text-xs text-sky-700 hover:underline"
                                        >
                                            {review.product.name}
                                        </Link>
                                    </div>
                                    <span className="inline-flex text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-stone-200'}`}
                                            />
                                        ))}
                                    </span>
                                </div>
                                {review.title && (
                                    <p className="text-sm font-semibold text-blue-950">{review.title}</p>
                                )}
                                <p className="text-sm text-stone-600">{review.body}</p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${review.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {review.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                    <button
                                        onClick={async () => {
                                            const result = await setReviewApproval(review.id, !review.isApproved)
                                            if (!result.success) toast.error(result.error || 'Failed')
                                            else await load()
                                        }}
                                        className="text-xs font-medium px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-50"
                                    >
                                        {review.isApproved ? 'Unapprove' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!confirm('Delete this review?')) return
                                            const result = await deleteReview(review.id)
                                            if (!result.success) toast.error(result.error || 'Failed')
                                            else {
                                                toast.success('Deleted')
                                                await load()
                                            }
                                        }}
                                        className="text-xs font-medium px-3 py-1.5 text-red-600 border border-red-100 rounded-lg hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
