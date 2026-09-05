'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { forgotPasswordAction } from '@/actions/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    startTransition(async () => {
      const res = await forgotPasswordAction(email)
      setMessage(res.message)
      setSubmitted(true)
    })
  }

  return (
    <div className="min-h-[85vh] bg-[#f7f6f3] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <h1 className="font-playfair text-3xl font-black text-blue-950 tracking-tight">
            Reset Password
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-normal">
            Enter your email and we’ll send you a recovery link
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-950/5 border border-stone-200/80">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {message}
              </p>
              <p className="text-xs text-slate-400">
                Check your inbox and spam folder. The link will expire in 1 hour.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-blue-950 hover:text-sky-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
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
                    className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 bg-blue-950 hover:bg-sky-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-950/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-950 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
