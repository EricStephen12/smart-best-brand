'use client'

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { resetPasswordAction } from '@/actions/auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Invalid or missing password reset token. Please request a new link.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    startTransition(async () => {
      const res = await resetPasswordAction({ token, newPassword: password })
      if (res.success) {
        setSuccess(true)
      } else {
        setError(res.error || 'Failed to reset password')
      }
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
            Create New Password
          </h1>
          <p className="text-slate-500 text-sm mt-1.5 font-normal">
            Choose a new, secure password for your account
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-950/5 border border-stone-200/80">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-blue-950">Password Changed!</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-3.5 bg-blue-950 hover:bg-sky-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  Sign In Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200/70 text-red-700 text-xs font-medium leading-relaxed">
                  {error}
                </div>
              )}

              {!token ? (
                <div className="text-center py-4 space-y-4">
                  <p className="text-sm text-slate-600">
                    No reset token was provided. Please request a new link.
                  </p>
                  <Link
                    href="/forgot-password"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-950 text-white text-xs font-semibold rounded-xl"
                  >
                    Request Reset Link
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-11 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-blue-950 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 py-3.5 bg-blue-950 hover:bg-sky-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-950/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      'Save New Password'
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
