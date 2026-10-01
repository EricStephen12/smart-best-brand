'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { submitReview } from '@/actions/reviews'
import toast from 'react-hot-toast'
import Link from 'next/link'

export type ReviewItem = {
  id: string
  authorName: string
  rating: number
  title: string | null
  body: string
  createdAt: string | Date
}

interface ProductReviewsProps {
  productId: string
  productSlug: string
  reviews: ReviewItem[]
  averageRating: number
  count: number
}

export default function ProductReviews({
  productId,
  productSlug,
  reviews = [],
  averageRating = 0,
  count = 0,
}: ProductReviewsProps) {
  const { user, isLoading } = useAuth()
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const hasReviews = count > 0 && reviews.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await submitReview({ productId, rating, title, body })
      if (!result.success) {
        toast.error(result.error || 'Could not submit review')
        return
      }
      toast.success('Review submitted — it will show after approval.')
      setTitle('')
      setBody('')
      setRating(5)
      setShowForm(false)
    } catch {
      toast.error('Could not submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate real distribution from actual database reviews
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const starCount = reviews.filter((r) => Math.round(r.rating) === stars).length
    const percent = count > 0 ? Math.round((starCount / count) * 100) : 0
    return { stars, percent }
  })

  return (
    <section id="reviews" className="py-20 sm:py-24 bg-white border-t border-neutral-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-serif text-neutral-900 tracking-tight">
              Customer reviews
            </h2>
          </div>

          <div>
            {isLoading ? null : !user ? (
              <Link
                href={`/login?redirect_url=/products/${productSlug}`}
                className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-900 pb-1 border-b border-neutral-900 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
              >
                Sign in to review →
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setShowForm((v) => !v)}
                className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-900 pb-1 border-b border-neutral-900 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
              >
                {showForm ? 'Cancel review' : 'Write a review →'}
              </button>
            )}
          </div>
        </div>

        {/* Rating Breakdown Row (Only rendered when real reviews exist) */}
        {hasReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 pb-14 border-b border-neutral-100 items-center">
            {/* Left: Overall Score */}
            <div className="md:col-span-4 flex items-center gap-6">
              <div>
                <p className="text-5xl sm:text-6xl font-light font-serif text-neutral-900 leading-none">
                  {averageRating.toFixed(1)}
                </p>
                <div className="flex items-center gap-1 text-amber-500 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating) ? 'fill-current' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-neutral-400 mt-1 font-sans">
                  Based on {count} verified review{count === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {/* Right: Star Distribution Bars */}
            <div className="md:col-span-8 max-w-md space-y-2 font-sans">
              {distribution.map((d) => (
                <div key={d.stars} className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="w-3 text-right">{d.stars}</span>
                  <span className="text-amber-500 text-xs">★</span>
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${d.percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-neutral-400 tabular-nums">
                    {d.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Review Submission Form (Collapsible) */}
        {user && showForm ? (
          <form
            onSubmit={handleSubmit}
            className="my-10 p-6 sm:p-8 bg-[#F5F3EF] rounded-2xl max-w-2xl mx-auto space-y-5"
          >
            <h3 className="text-lg font-bold font-sans text-neutral-900">
              Share your experience
            </h3>

            <div>
              <p className="text-xs text-neutral-500 mb-2 font-medium">Your Rating</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        value <= rating
                          ? 'text-amber-500 fill-current'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-500 mb-1.5 font-medium">Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Incredibly comfortable, exceeded expectations"
                required
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-500 mb-1.5 font-medium">Review</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="How does the comfort, finish, and delivery feel?"
                required
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : null}

        {/* Real Reviews Grid or Zero State */}
        {hasReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-12">
            {reviews.map((r) => (
              <div key={r.id} className="space-y-3 font-sans">
                {/* Stars */}
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-current' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Title */}
                {r.title ? (
                  <h4 className="text-sm sm:text-[15px] font-bold text-neutral-900 leading-snug">
                    {r.title}
                  </h4>
                ) : null}

                {/* Body */}
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                  {r.body}
                </p>

                {/* Author & Date */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#E5DCCE] text-neutral-800 text-[10px] font-bold flex items-center justify-center uppercase">
                      {r.authorName ? r.authorName.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-medium text-neutral-700">
                      {r.authorName}
                    </span>
                  </div>
                  {r.createdAt ? (
                    <span className="text-[11px] text-neutral-400">
                      {new Date(r.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-t border-neutral-100 mt-6">
            <p className="text-sm font-medium text-neutral-800">
              No customer reviews yet.
            </p>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Be the first to share how this piece feels and fits in your home.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
