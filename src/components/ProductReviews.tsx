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
  reviews,
  averageRating,
  count,
}: ProductReviewsProps) {
  const { user, isLoading } = useAuth()
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

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

  return (
    <section id="reviews" className="mt-20 sm:mt-28 border-t border-blue-950/5 pt-14 sm:pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Score summary */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-5 rounded-full bg-sky-600 shrink-0" />
            <p className="text-[11px] font-black tracking-[0.35em] uppercase text-sky-600">
              Reviews
            </p>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-blue-950 tracking-tight mb-6">
            What buyers say
          </h2>

          {count > 0 ? (
            <div className="flex items-end gap-4 mb-6">
              <p className="font-playfair text-6xl sm:text-7xl font-semibold text-blue-950 leading-none tracking-tight">
                {averageRating.toFixed(1)}
              </p>
              <div className="pb-1">
                <span className="inline-flex text-amber-500 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating) ? 'fill-current' : 'text-stone-200'
                      }`}
                    />
                  ))}
                </span>
                <p className="text-sm text-stone-500">
                  {count} review{count === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              No reviews yet — be the first to share how this product feels at home.
            </p>
          )}

          {isLoading ? null : !user ? (
            <Link
              href={`/login?redirect_url=/products/${productSlug}`}
              className="inline-flex border border-blue-950 text-blue-950 px-8 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
            >
              Sign in to review
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex border border-blue-950 text-blue-950 px-8 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
            >
              {showForm ? 'Cancel' : 'Write a review'}
            </button>
          )}
        </div>

        {/* List + form */}
        <div className="lg:col-span-8">
          {user && showForm ? (
            <form
              onSubmit={handleSubmit}
              className="mb-12 pb-12 border-b border-blue-950/8 space-y-5"
            >
              <p className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400">
                Your review
              </p>

              <div>
                <p className="text-sm text-stone-500 mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="p-0.5"
                      aria-label={`${value} stars`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          value <= rating
                            ? 'text-amber-500 fill-current'
                            : 'text-stone-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Headline (optional)"
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-blue-950/15 text-sm text-blue-950 placeholder:text-stone-400 outline-none focus:border-blue-950/50 transition-colors"
              />
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your experience with this product…"
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-blue-950/15 text-sm text-blue-950 placeholder:text-stone-400 outline-none focus:border-blue-950/50 resize-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex bg-blue-950 text-white px-10 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase hover:bg-sky-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Submitting…' : 'Submit review'}
              </button>
            </form>
          ) : null}

          {reviews.length === 0 ? (
            <p className="text-sm text-stone-500 leading-relaxed py-4">
              Reviews from verified buyers will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-blue-950/8">
              {reviews.map((review) => (
                <li key={review.id} className="py-8 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-medium text-blue-950">{review.authorName}</p>
                      <p className="text-[10px] font-black tracking-[0.18em] uppercase text-stone-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="inline-flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating ? 'fill-current' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </span>
                  </div>
                  {review.title ? (
                    <p className="font-playfair text-lg font-semibold text-blue-950 mb-2">
                      {review.title}
                    </p>
                  ) : null}
                  <p className="text-sm text-stone-500 leading-relaxed max-w-2xl">
                    {review.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
