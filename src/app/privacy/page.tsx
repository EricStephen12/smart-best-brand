'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    return (
        <div className="pt-32 sm:pt-48 pb-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="text-sky-600 font-black tracking-[0.3em] text-[10px] uppercase mb-6 block font-sans">07 / Data Protocol</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-blue-950 mb-16 tracking-tight font-display uppercase leading-[0.9]">PRIVACY <br /><span className="text-slate-200">POLICY.</span></h1>

                    <div className="prose prose-xl prose-slate max-w-none prose-headings:text-blue-950 prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium font-inter">
                        <p className="text-2xl font-bold text-blue-950 mb-12 leading-relaxed">
                            Your trust is our most valuable asset. This policy outlines how we steward the information you share with Smart Best Brands.
                        </p>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">Information Curation</h2>
                            <p>We collect essential data—including your name, email, phone number, and delivery coordinates—to ensure the precise fulfillment of your orders and to enhance your personalized experience with our concierge services.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">Data Stewardship</h2>
                            <p>Your information is utilized exclusively for order logistics, elite customer support, and, should you opt-in, curated updates on our latest designer collections. We never trade or sell your personal data.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">Security Standards</h2>
                            <p>We employ industry-leading encryption and security protocols to safeguard your information from unauthorized access, ensuring that your digital interactions with us are as secure as our physical delivery.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
