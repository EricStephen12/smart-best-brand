'use client';

import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ArticleShareButtonsProps {
    title: string;
    slug: string;
}

export default function ArticleShareButtons({ title, slug }: ArticleShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://smartbestbrands.com/blog/${slug}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2500);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`Read "${title}" on Smart Best Brands: ${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                Share:
            </span>
            <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                title="Copy article link"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                title="Share to WhatsApp"
            >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
            </button>
        </div>
    );
}
