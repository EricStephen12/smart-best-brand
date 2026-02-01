'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <div className="pt-32 sm:pt-48 pb-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-sky-600 font-black tracking-[0.3em] text-xs uppercase mb-6 block">Service Agreement</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-blue-950 mb-16 tracking-tight">TERMS & <br /><span className="text-gray-300">CONDITIONS.</span></h1>

                    <div className="prose prose-xl prose-slate max-w-none prose-headings:text-blue-950 prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium">
                        <p className="text-2xl font-bold text-blue-950 mb-12 leading-relaxed">
                            By engaging with Smart Best Brands, you enter into a partnership defined by mutual respect, authenticity, and excellence.
                        </p>

                        <section className="mb-16">
                            <h2 className="text-3xl border-l-4 border-sky-500 pl-6 mb-8">1. Product Authenticity</h2>
                            <p>We guarantee that every item showcased on our platform is 100% authentic, sourced directly from manufacturers or specialized authorized distributors. We stand behind the heritage of our partner brands.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-3xl border-l-4 border-sky-500 pl-6 mb-8">2. Investment & Acquisition</h2>
                            <p>Prices are reflective of current market valuations and are subject to adjustment. Complete acquisition (payment in full) is required prior to the dispatch of large-scale furniture and premium mattress collections.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-3xl border-l-4 border-sky-500 pl-6 mb-8">3. Logistics Charter</h2>
                            <p>Our primary operational zones are Abuja and Benin. Logistics beyond these regions are managed as bespoke requests and may involve unique timelines and coordination fees.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-3xl border-l-4 border-sky-500 pl-6 mb-8">4. Heritage Warranty</h2>
                            <p>Warranty claims are stewarded in accordance with the specific manufacturer's protocols. Our concierge team will provide diligent assistance in facilitating these claims on your behalf.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
