import React from 'react';
import type { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/actions/blog';
import BlogCatalog from '@/components/blog/BlogCatalog';

export const metadata: Metadata = {
    title: 'The Sleep & Living Journal | Smart Best Brands',
    description:
        'Expert mattress buying guides, orthopedic sleep advice, pillow reviews, and luxury furniture styling from Smart Best Brands Nigeria.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const res = await getPublishedBlogPosts();
    const posts = res.success && res.data ? res.data : [];

    return (
        <div className="bg-[#fcfbf9] min-h-screen font-sans pb-24">
            {/* Header Hero Banner */}
            <div className="bg-blue-950 text-white py-16 sm:py-24 border-b border-blue-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_50%)] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400 mb-3">
                        Editorial &amp; Guides
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white max-w-3xl">
                        The Sleep &amp; Living Journal
                    </h1>
                    <p className="text-sm sm:text-base text-blue-200/80 max-w-2xl mt-4 leading-relaxed font-normal">
                        Expert advice on choosing original mattresses, orthopedic spinal alignment, bedding care, and bedroom aesthetics designed for restorative sleep in Nigeria.
                    </p>
                </div>
            </div>

            {/* Catalog Content */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-6">
                <BlogCatalog initialPosts={posts as any} />
            </div>
        </div>
    );
}
