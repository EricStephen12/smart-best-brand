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
        answer: "Yes, we specialize in bespoke mattress requests. If you have a custom bed frame or unique space requirements, we can facilitate special orders through our brand partners like Vitafoam and Mouka Foam. Please select 'Custom Dimensions' on the product page or message our concierge directly to discuss your specific measurements."
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
                        Assistance & Logistics
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl sm:text-7xl font-black text-blue-950 tracking-tight leading-none"
                    >
                        FREQUENTLY <br />
                        <span className="text-gray-300">ASKED.</span>
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
                            className={`rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${openIndex === idx
                                ? 'bg-white border-sky-100 shadow-2xl shadow-sky-600/5'
                                : 'bg-gray-50/50 border-transparent hover:border-gray-100'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-8 sm:p-10 text-left"
                            >
                                <span className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${openIndex === idx ? 'text-blue-950' : 'text-gray-500 hover:text-blue-950'
                                    }`}>
                                    {faq.question}
                                </span>
                                <div className={`p-3 rounded-2xl transition-all duration-300 ${openIndex === idx ? 'bg-blue-950 text-white rotate-0' : 'bg-white text-gray-400 rotate-90 shadow-sm'
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
                                            <div className="h-[2px] w-12 bg-sky-500 mb-6"></div>
                                            <p className="text-lg text-gray-600 leading-relaxed font-medium max-w-2xl">
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
                    className="mt-24 p-10 sm:p-16 bg-blue-950 rounded-[3rem] text-white relative overflow-hidden"
                >
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black mb-4">Still have <br /> questions?</h2>
                            <p className="text-sky-200/80 font-medium text-lg">Our elite concierge team is ready to assist you personally.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/contact"
                                className="flex items-center justify-center gap-2 bg-white text-blue-950 font-black py-5 px-8 rounded-2xl hover:bg-sky-50 transition-all"
                            >
                                Contact Support
                            </a>
                            <a
                                href="https://wa.me/your-number"
                                className="flex items-center justify-center gap-2 bg-sky-600 text-white font-black py-5 px-8 rounded-2xl hover:bg-sky-500 transition-all shadow-xl shadow-sky-600/20"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Live
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
