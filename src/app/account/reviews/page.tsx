'use client'

import React, { useEffect, useState } from 'react'
import { deleteReview, getAllReviewsAdmin, setReviewApproval } from '@/actions/reviews'
import toast from 'react-hot-toast'
import { Loader2, Star, CheckCircle2, Clock } from 'lucide-react'
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

type Filter = 'all' | 'pending' | 'approved'

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  const load = async () => {
    setLoading(true)
    const result = await getAllReviewsAdmin()
    if (result.success && result.data) setReviews(result.data as AdminReview[])
    else toast.error(result.error || 'Failed to load reviews')
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const pendingCount = reviews.filter((r) => !r.isApproved).length
  const approvedCount = reviews.filter((r) => r.isApproved).length

  const visible = reviews.filter((r) => {
    if (filter === 'pending') return !r.isApproved
    if (filter === 'approved') return r.isApproved
    return true
  })

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: reviews.length },
    { id: 'pending', label: 'Pending', count: pendingCount },
    { id: 'approved', label: 'Approved', count: approvedCount },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">Product Reviews</h1>
        <p className="text-sm text-stone-500 mt-1">
          Approve or reject reviews before they appear on product pages.
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {pendingCount} pending
            </span>
          )}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
              filter === tab.id
                ? 'border-blue-950 text-blue-950'
                : 'border-transparent text-stone-500 hover:text-blue-950'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              filter === tab.id ? 'bg-blue-950 text-white' : 'bg-stone-100 text-stone-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-sky-700" />
          </div>
        ) : visible.length === 0 ? (
          <p className="p-10 text-sm text-stone-500 text-center">
            {filter === 'pending' ? 'No pending reviews — all caught up.' : 'No reviews yet.'}
          </p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {visible.map((review) => (
              <li key={review.id} className="p-5 space-y-2.5">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-blue-950">
                      {review.authorName}
                      {review.user?.email && (
                        <span className="text-stone-400 font-normal text-xs ml-1.5">
                          · {review.user.email}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Link
                        href={`/products/${review.product.slug}`}
                        className="text-xs text-sky-700 hover:underline"
                      >
                        {review.product.name}
                      </Link>
                      <span className="text-stone-300 text-xs">·</span>
                      <span className="text-xs text-stone-400">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-stone-200'}`} />
                    ))}
                  </span>
                </div>

                {/* Content */}
                {review.title && (
                  <p className="text-sm font-semibold text-blue-950">{review.title}</p>
                )}
                <p className="text-sm text-stone-600 leading-relaxed">{review.body}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    review.isApproved
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {review.isApproved
                      ? <><CheckCircle2 className="w-3 h-3" /> Approved</>
                      : <><Clock className="w-3 h-3" /> Pending</>
                    }
                  </span>
                  <button
                    onClick={async () => {
                      const result = await setReviewApproval(review.id, !review.isApproved)
                      if (!result.success) toast.error(result.error || 'Failed')
                      else await load()
                    }}
                    className="text-xs font-semibold px-3 py-1.5 border border-stone-200 rounded-xl hover:bg-stone-50 text-stone-600 hover:text-blue-950 transition-colors"
                  >
                    {review.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this review?')) return
                      const result = await deleteReview(review.id)
                      if (!result.success) toast.error(result.error || 'Failed')
                      else { toast.success('Deleted'); await load() }
                    }}
                    className="text-xs font-semibold px-3 py-1.5 border border-red-100 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
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
