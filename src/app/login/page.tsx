'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ArrowRight, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

function getSafeRedirectUrl(param: string | null): string {
  if (!param) return '/account'
  try {
    if (param.startsWith('/')) return param
    const url = new URL(param)
    return `${url.pathname}${url.search}` || '/account'
  } catch {
    return '/account'
  }
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const targetUrl = getSafeRedirectUrl(searchParams.get('redirect_url'))

  const { user, isLoading: authLoading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // If already logged in, redirect immediately
  useEffect(() => {
    if (!authLoading && user) {
      window.location.href = targetUrl
    }
  }, [user, authLoading, targetUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Please enter your email and password')
      return
    }

    startTransition(async () => {
      const res = await login({ email, password })
      if (res.success) {
        window.location.href = targetUrl
      } else {
        setError(res.error || 'Invalid email or password')
      }
    })
  }

  return (
    <div className="min-h-[85vh] bg-[#f7f6f3] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* ── Editorial background watermark ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-playfair font-black uppercase tracking-[-0.05em] text-[24vw] text-blue-950/[0.03] z-0 whitespace-nowrap"
      >
        Comfort
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-playfair text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
            Sign In
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-950/5 border border-stone-200/80">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200/70 text-red-700 text-xs font-medium leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-sky-700 hover:text-sky-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-blue-950 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-blue-950 text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-blue-900 active:scale-[0.99] transition-all disabled:opacity-70 shadow-lg shadow-blue-950/15"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-slate-500">
              Don’t have an account?{' '}
              <Link
                href={`/register${targetUrl !== '/account' ? `?redirect_url=${encodeURIComponent(targetUrl)}` : ''}`}
                className="font-bold text-sky-700 hover:text-sky-800 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
