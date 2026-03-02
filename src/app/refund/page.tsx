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
                    <span className="text-sky-600 font-black tracking-[0.3em] text-[10px] uppercase mb-6 block font-sans">08 / Satisfaction Guarantee</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-blue-950 mb-16 tracking-tight font-display uppercase leading-[0.9]">REFUND & <br /><span className="text-slate-200">RETURNS.</span></h1>

                    <div className="prose prose-xl prose-slate max-w-none prose-headings:text-blue-950 prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium font-inter">
                        <p className="text-2xl font-bold text-blue-950 mb-12 leading-relaxed">
                            We take pride in the quality of our collections. Our return policy is designed to maintain the highest standards of hygiene and excellence.
                        </p>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">1. Mattress Collections</h2>
                            <p>For critical hygiene reasons, mattresses cannot be returned or refunded once the original factory seal (nylon packaging) has been opened or tampered with. We encourage careful selection before unsealing.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">2. Furniture Assets</h2>
                            <p>Furniture items may only be returned if significant damage is identified during the delivery and inspection process. Our white-glove team will assist you in verifying the condition of every piece upon arrival.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">3. Concierge Resolution</h2>
                            <p>Eligible refunds are processed with priority within 7-14 business days via bank transfer or the original payment method, following a comprehensive quality review by our specialists.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
