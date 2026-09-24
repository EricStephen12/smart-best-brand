'use client'

import { useState, useTransition, Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { forgotPasswordAction } from '@/actions/auth'

function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) { setError('Please enter your email address'); return }
    startTransition(async () => {
      const result = await forgotPasswordAction(email)
      if (result.success) {
        setSent(true)
      } else {
        setError(result.message || 'Something went wrong')
      }
    })
  }

  return (
    <div className="min-h-[85vh] bg-[var(--brand-bg)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black uppercase tracking-[-0.05em] text-[24vw] text-blue-950/[0.03] z-0 whitespace-nowrap"
      >
        Comfort
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
            Reset Password
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            Enter your email and we'll send a reset link.
          </p>
        </div>

        <div className="bg-white p-8 shadow-sm border border-stone-200">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-blue-950 mb-2">Check your inbox</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your spam folder if you don't see it.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 mt-6 text-xs font-black uppercase tracking-wider text-sky-700 hover:text-blue-950 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 text-sm text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 px-6 bg-blue-950 text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-sky-700 disabled:opacity-70 transition-colors"
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-stone-100 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-blue-950 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] bg-[var(--brand-bg)]" />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
