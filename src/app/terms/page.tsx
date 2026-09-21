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
                    <span className="text-sky-600 font-black tracking-[0.3em] text-[10px] uppercase mb-6 block font-sans">Terms of Service</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-blue-950 mb-16 tracking-tight font-display uppercase leading-[0.9]">TERMS & <br /><span className="text-slate-200">CONDITIONS.</span></h1>

                    <div className="prose prose-xl prose-slate max-w-none prose-headings:text-blue-950 prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium font-inter">
                        <p className="text-2xl font-bold text-blue-950 mb-12 leading-relaxed">
                            Welcome to Smart Best Brands. These terms explain how orders, deliveries, and warranties work when you shop with us.
                        </p>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">1. 100% Genuine Products</h2>
                            <p>We guarantee that all mattresses, pillows, and furniture on our store are 100% original, sourced directly from authorized manufacturers (including Mouka, Vitafoam, and Royal Foam).</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">2. Pricing & Payment</h2>
                            <p>All prices are listed in Nigerian Naira (₦). Complete payment is required before your items are dispatched for delivery. We accept online card payments and bank transfers.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">3. Delivery & Shipping</h2>
                            <p>We deliver directly within Abuja and Benin City typically within 24–48 hours. Deliveries to Lagos and other states are handled via trusted transport partners with delivery fees confirmed before dispatch.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">4. Manufacturer Warranty</h2>
                            <p>All mattresses come with official manufacturer warranties. If your product has a factory fault covered by the warranty, our team will gladly help you process the warranty claim with the manufacturer.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
