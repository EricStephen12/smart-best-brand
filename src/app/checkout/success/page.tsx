'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
            <div className="max-w-xl w-full px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-blue-950/10 text-center border border-slate-100 dark:border-gray-800"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-blue-950 dark:text-white uppercase tracking-tight mb-4">
                        Payment Secured
                    </h1>

                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                        Your consignment has been established. Our fulfillment officers will dispatch your curated selection shortly.
                    </p>

                    <div className="space-y-4">
                        <Link href="/account">
                            <button className="w-full bg-blue-950 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-600 transition-colors uppercase text-xs tracking-widest">
                                <span>View Order Status</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>

                        <Link href="/products">
                            <button className="w-full bg-slate-100 text-blue-950 font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors uppercase text-xs tracking-widest">
                                <span>Continue Shopping</span>
                                <ShoppingBag className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">
                        Authored by Smart Best Brands &copy; 2026
                    </p>
                </div>
            </div>
        </div>
    )
}
