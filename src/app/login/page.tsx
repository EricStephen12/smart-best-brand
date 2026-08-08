'use client'

import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 flex flex-col items-center"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-950/20">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-slate-400 font-medium text-sm">Sign in securely to your Smart Best Brands account</p>
                </div>

                <SignIn
                    routing="hash"
                    signUpUrl="/register"
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
                    New here?{' '}
                    <Link href="/register" className="text-sky-600 font-black uppercase tracking-widest text-xs hover:underline">
                        Create account
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
