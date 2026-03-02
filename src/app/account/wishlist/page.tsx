'use client';

import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
    return (
        <div className="space-y-12 pb-24 font-sans">
            <div>
                <h1 className="text-4xl font-black text-blue-950 tracking-tight uppercase leading-none mb-1">Favorites Dossier</h1>
                <p className="text-slate-400 font-medium font-inter">Curate your elite selection of future acquisitions.</p>
            </div>

            <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-950/5 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-600/20 to-transparent" />

                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 relative">
                    <Heart className="w-10 h-10 italic relative z-10" />
                    <div className="absolute inset-0 bg-sky-50 rounded-full scale-150 animate-pulse opacity-50" />
                </div>

                <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight mb-4">Awaiting Inspiration</h2>
                <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10 leading-relaxed font-inter">
                    Your collection of desired essences is currently a clean slate. Discover something extraordinary in our catalog.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-4 px-10 py-5 bg-blue-950 hover:bg-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 group shadow-xl shadow-blue-950/20"
                >
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Initialize Discovery
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
