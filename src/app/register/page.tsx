'use client'

import Link from 'next/link'
import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10 flex flex-col items-center"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-950/20">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-2">Create Account</h1>
                    <p className="text-slate-400 font-medium text-sm">Join Smart Best Brands — passwords stay with Clerk</p>
                </div>

                <SignUp
                    routing="hash"
                    signInUrl="/login"
                    forceRedirectUrl="/account"
                    fallbackRedirectUrl="/account"
                    appearance={{
                        elements: {
                            rootBox: 'w-full',
                            card: 'shadow-2xl shadow-blue-900/10 border border-slate-100 rounded-[2rem]',
                        },
                    }}
                />

                <p className="mt-8 text-sm text-slate-400 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-sky-600 font-black uppercase tracking-widest text-xs hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
