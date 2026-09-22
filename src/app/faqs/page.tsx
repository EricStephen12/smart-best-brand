'use client';

import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Do you sell original mattresses?",
        answer: "Absolutely. We are authorized distributors for all the brands listed on our site, including Vitafoam, Mouka Foam, and Royal Foam. Every mattress comes in its original factory packaging with a valid manufacturer warranty."
    },
    {
        question: "How long does delivery take?",
        answer: "For locations within Abuja and Benin, delivery typically takes 24-48 hours. For other locations, it may take 3-5 business days depending on the size of the order and the brand's availability."
    },
    {
        question: "How do I pay for my order?",
        answer: "You can pay securely online via our integrated payment gateway or opt for the 'Order on WhatsApp' method where we can arrange for bank transfers. We currently do not support Pay on Delivery for most large furniture items."
    },
    {
        question: "Can I return a mattress?",
        answer: "Due to hygiene reasons, mattresses cannot be returned once the nylon seal has been removed. However, if there is a factory defect, we will facilitate a replacement through the manufacturer's warranty process."
    },
    {
        question: "Do you offer bulk discounts?",
        answer: "Yes, we offer special pricing for hotels, hospitals, and large corporate orders. Please reach out to us via our contact page for a custom quote."
    },
    {
        question: "Can I order a custom size mattress?",
        answer: "Yes, we arrange custom mattress sizes. If you have a custom bed frame or special space requirements, we can place a custom order directly with Vitafoam, Mouka, or Royal Foam. Choose 'Custom size' on the product page or message us on WhatsApp with your measurements."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="pt-32 sm:pt-48 pb-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-16 sm:mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sky-600 font-black tracking-[0.3em] text-xs uppercase mb-4 block"
                    >
                        Help & FAQs
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl sm:text-7xl font-black text-blue-950 tracking-[-0.04em] leading-none font-display"
                    >
                        Frequently <br />
                        <span className="text-sky-600">Asked.</span>
                    </motion.h1>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className={`border transition-all duration-500 overflow-hidden ${openIndex === idx
                                ? 'bg-white border-blue-950/20 shadow-lg shadow-blue-950/5'
                                : 'bg-slate-50/50 border-slate-100 hover:border-blue-950/20'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-8 sm:p-10 text-left"
                            >
                                <span className={`text-xl sm:text-2xl font-black transition-colors duration-300 tracking-tight ${openIndex === idx ? 'text-blue-950' : 'text-slate-400 hover:text-blue-950'
                                    }`}>
                                    {faq.question}
                                </span>
                                <div className={`p-3 transition-all duration-300 border ${openIndex === idx ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-400 border-slate-200'
                                    }`}>
                                    {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "circOut" }}
                                    >
                                        <div className="px-8 sm:px-10 pb-10">
                                            <div className="h-[2px] w-12 bg-sky-600 mb-6"></div>
                                            <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl font-inter">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-10 sm:p-16 bg-blue-950 text-white relative overflow-hidden font-sans"
                >
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">Still have questions?</h2>
                            <p className="text-sky-200/80 font-medium text-base font-inter">Our team is on WhatsApp and phone during business hours.</p>
                        </div>
                        <div className="flex justify-start md:justify-end">
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-3 bg-white text-blue-950 px-8 py-4 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-sky-50 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Get in touch
                            </a>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </motion.div>
            </div>
        </div>
    );
}
