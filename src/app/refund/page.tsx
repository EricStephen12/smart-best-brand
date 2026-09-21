'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function RefundPage() {
    return (
        <div className="pt-32 sm:pt-48 pb-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-sky-600 font-black tracking-[0.3em] text-[10px] uppercase mb-6 block font-sans">Return & Refund Policy</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-blue-950 mb-16 tracking-tight font-display uppercase leading-[0.9]">REFUND & <br /><span className="text-slate-200">RETURNS.</span></h1>

                    <div className="prose prose-xl prose-slate max-w-none prose-headings:text-blue-950 prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium font-inter">
                        <p className="text-2xl font-bold text-blue-950 mb-12 leading-relaxed">
                            We want you to be completely satisfied with your purchase. Here is how our returns and refunds work.
                        </p>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">1. Mattress Returns</h2>
                            <p>For health and hygiene reasons, mattresses cannot be returned or refunded once the original factory nylon seal has been opened. Please inspect the mattress through the clear nylon packaging upon delivery before opening.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">2. Furniture & Accessories</h2>
                            <p>Furniture, bed frames, and pillows can only be returned if defects or damages are noticed and reported at the point of delivery before our driver leaves.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">3. Refunds & Replacements</h2>
                            <p>Approved refunds are processed within 3–7 business days via bank transfer or your original payment method. For manufacturer defects covered under warranty, we assist in coordinating a direct replacement.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
