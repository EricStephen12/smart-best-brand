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
                    <span className="text-sky-600 font-black tracking-[0.3em] text-[10px] uppercase mb-6 block font-sans">Privacy Policy</span>
                    <h1 className="text-5xl sm:text-7xl font-black text-blue-950 mb-16 tracking-tight font-display uppercase leading-[0.9]">PRIVACY <br /><span className="text-slate-200">POLICY.</span></h1>

                    <div className="prose prose-xl prose-slate max-w-none prose-headings:text-blue-950 prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium font-inter">
                        <p className="text-2xl font-bold text-blue-950 mb-12 leading-relaxed">
                            We respect your privacy. This policy explains what information we collect and how we use it to fulfill your orders.
                        </p>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">Information We Collect</h2>
                            <p>We only collect the details needed to process and deliver your order: your full name, phone number, email address, and delivery address.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">How We Use Your Information</h2>
                            <p>We use your information strictly to coordinate delivery, send receipts, and provide customer support. We never sell, rent, or trade your personal information with third parties.</p>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl border-l-4 border-sky-600 pl-6 mb-8 uppercase tracking-wide">Payment Security</h2>
                            <p>All online payments are securely processed through certified gateways like Paystack. We never store or have access to your full debit/credit card details.</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
