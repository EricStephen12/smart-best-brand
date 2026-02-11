'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Ruler, ShieldCheck, Clock } from 'lucide-react';

interface CustomRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
}

export default function CustomRequestModal({ isOpen, onClose, productName }: CustomRequestModalProps) {
    const handleWhatsApp = () => {
        const text = `Hello Smart Best Brands, I am interested in a custom size specification for the ${productName}. Please let me know the process for bespoke measurements.`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/2349033333333?text=${encodedText}`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-[60]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-start sm:items-center justify-center pointer-events-none z-[70] p-4 pt-10 sm:pt-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl pointer-events-auto relative my-auto mb-10 sm:mb-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-blue-950 hover:bg-slate-100 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 sm:p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1 h-8 bg-sky-600 rounded-full" />
                                    <span className="text-xs sm:text-sm font-black text-sky-600 uppercase tracking-[0.4em]">
                                        Bespoke Specification
                                    </span>
                                </div>

                                <h2 className="text-4xl sm:text-5xl font-black text-blue-950 tracking-tight leading-none mb-4">
                                    Custom Request <br />
                                    <span className="text-sky-600 font-display italic">Protocol.</span>
                                </h2>

                                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12">
                                    At Smart Best Brands, we offer custom-fit solutions for unique bed frames and spatial requirements.
                                </p>

                                {/* Steps Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                                    <StepCard
                                        icon={Ruler}
                                        title="Measure"
                                        desc="Provide your exact length, width, and height."
                                    />
                                    <StepCard
                                        icon={ShieldCheck}
                                        title="Validate"
                                        desc="We verify technical feasibility with the brand."
                                    />
                                    <StepCard
                                        icon={Clock}
                                        title="Produce"
                                        desc="Factory delivery usually takes 5-10 business days."
                                    />
                                </div>

                                {/* Action */}
                                <button
                                    onClick={handleWhatsApp}
                                    className="w-full bg-blue-950 text-white py-6 rounded-3xl font-black text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-4 hover:bg-sky-600 transition-all shadow-xl shadow-blue-950/20 active:scale-98"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Request Custom Quote via Concierge
                                </button>

                                <p className="text-center mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    Direct connection to a dedicated procurement manager
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </ >
            )}
        </AnimatePresence>
    );
}

function StepCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-sky-600 mb-4 shadow-sm">
                <Icon className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-1">{title}</h4>
            <p className="text-[11px] font-medium text-slate-400 leading-tight">{desc}</p>
        </div>
    );
}
