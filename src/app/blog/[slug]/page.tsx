import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Clock,
    ChevronRight,
    ArrowLeft,
    BookOpen,
    ShoppingBag,
    Sparkles,
} from 'lucide-react';
import { getBlogPostBySlug } from '@/actions/blog';
import ArticleShareButtons from '@/components/blog/ArticleShareButtons';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const res = await getBlogPostBySlug(slug);
    if (!res.success || !res.data) {
        return {
            title: 'Article Not Found | Smart Best Brands',
        };
    }

    const post = res.data;
    return {
        title: `${post.title} | Smart Best Brands`,
        description: post.excerpt || post.content.slice(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.slice(0, 160),
            type: 'article',
            ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
        },
    };
}

function renderContent(rawContent: string) {
    const blocks = rawContent.split(/\n\n+/);

    return blocks.map((block, idx) => {
        const text = block.trim();
        if (!text) return null;

        // Level 1 heading
        if (text.startsWith('# ')) {
            return (
                <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-blue-950 mt-10 mb-4 tracking-tight">
                    {text.replace(/^#\s+/, '')}
                </h2>
            );
        }

        // Level 2 heading
        if (text.startsWith('## ')) {
            return (
                <h3 key={idx} className="text-xl sm:text-2xl font-bold text-blue-950 mt-8 mb-3 tracking-tight">
                    {text.replace(/^##\s+/, '')}
                </h3>
            );
        }

        // Level 3 heading
        if (text.startsWith('### ')) {
            return (
                <h4 key={idx} className="text-lg font-bold text-blue-950 mt-6 mb-2">
                    {text.replace(/^###\s+/, '')}
                </h4>
            );
        }

        // Blockquote
        if (text.startsWith('> ')) {
            return (
                <blockquote
                    key={idx}
                    className="border-l-4 border-blue-950 bg-stone-50 pl-5 py-3.5 my-6 text-stone-700 italic font-medium rounded-r-xl"
                >
                    {text.replace(/^>\s+/, '')}
                </blockquote>
            );
        }

        // Bullet list
        if (text.split('\n').every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
            const items = text.split('\n').map(line => line.replace(/^[-*]\s+/, '').trim());
            return (
                <ul key={idx} className="list-disc pl-6 space-y-2 my-5 text-stone-700 leading-relaxed">
                    {items.map((it, i) => (
                        <li key={i}>{it}</li>
                    ))}
                </ul>
            );
        }

        // Numbered list
        if (text.split('\n').every(line => /^\d+\.\s+/.test(line.trim()))) {
            const items = text.split('\n').map(line => line.replace(/^\d+\.\s+/, '').trim());
            return (
                <ol key={idx} className="list-decimal pl-6 space-y-2 my-5 text-stone-700 leading-relaxed">
                    {items.map((it, i) => (
                        <li key={i}>{it}</li>
                    ))}
                </ol>
            );
        }

        // Standard paragraph
        return (
            <p key={idx} className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal my-4">
                {text}
            </p>
        );
    });
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const res = await getBlogPostBySlug(slug);
    if (!res.success || !res.data) {
        notFound();
    }

    const post = res.data;
    const related = res.related || [];

    return (
        <article className="bg-[#fcfbf9] min-h-screen font-sans pb-28">
            {/* Header / Breadcrumb navigation */}
            <div className="bg-white border-b border-stone-200 py-4">
                <div className="max-w-4xl mx-auto px-6 sm:px-8">
                    <nav className="flex items-center gap-2 text-xs font-medium text-stone-400 overflow-x-auto">
                        <Link href="/" className="hover:text-blue-950 transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        <Link href="/blog" className="hover:text-blue-950 transition-colors">
                            Journal
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-stone-600 truncate">{post.category}</span>
                    </nav>
                </div>
            </div>

            {/* Article Hero */}
            <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14 pb-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-stone-400">
                    <span className="px-3 py-1 bg-sky-50 text-sky-800 rounded-md border border-sky-100">
                        {post.category}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                    </span>
                    <span>·</span>
                    <span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC',
                        })}
                    </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-blue-950 tracking-tight leading-[1.15]">
                    {post.title}
                </h1>

                {post.excerpt && (
                    <p className="text-lg sm:text-xl text-stone-600 leading-relaxed font-normal">
                        {post.excerpt}
                    </p>
                )}

                {/* Author row & Share actions */}
                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-950 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {post.authorName[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-blue-950">{post.authorName}</p>
                            <p className="text-xs text-stone-400">Smart Best Brands Editorial</p>
                        </div>
                    </div>

                    <ArticleShareButtons title={post.title} slug={post.slug} />
                </div>
            </header>

            {/* Cover Image Container */}
            {post.coverImage && (
                <div className="max-w-5xl mx-auto px-6 sm:px-8 my-6">
                    <div className="relative aspect-[16/9] sm:aspect-[21/10] rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            unoptimized
                            priority
                            className="object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Article Body Content */}
            <main className="max-w-3xl mx-auto px-6 sm:px-8 mt-10">
                <div className="prose prose-stone max-w-none text-stone-800">
                    {renderContent(post.content)}
                </div>

                {/* Post Footer Share & Back */}
                <div className="mt-14 pt-8 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950 hover:text-sky-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Articles</span>
                    </Link>

                    <ArticleShareButtons title={post.title} slug={post.slug} />
                </div>
            </main>

            {/* Call to action commercial banner */}
            <section className="max-w-4xl mx-auto px-6 sm:px-8 mt-16">
                <div className="bg-blue-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-blue-900">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-xl space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-sky-300">
                            <Sparkles className="w-3.5 h-3.5" />
                            Original Nigerian Sleep Comfort
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                            Ready for Truly Restorative Sleep?
                        </h3>
                        <p className="text-sm text-blue-200/80 leading-relaxed font-normal">
                            Explore authentic Mouka, Vitafoam, and Royal Foam mattresses with verified factory warranties. Fast door-to-door delivery across Abuja, Benin City, and surrounding states.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-blue-950 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-sky-50 transition-colors shadow-md"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Shop Mattresses &amp; Furniture</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles Section */}
            {related.length > 0 && (
                <section className="max-w-5xl mx-auto px-6 sm:px-8 mt-20 pt-12 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Keep Reading</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-blue-950 mt-1">Related Guides</h3>
                        </div>
                        <Link
                            href="/blog"
                            className="text-xs font-bold uppercase tracking-wider text-sky-700 hover:text-sky-900"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {related.map((item: any) => (
                            <Link
                                key={item.id}
                                href={`/blog/${item.slug}`}
                                className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 block group hover:shadow-md transition-shadow"
                            >
                                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100">
                                    {item.coverImage ? (
                                        <Image
                                            src={item.coverImage}
                                            alt={item.title}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                                            <BookOpen className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-[11px] font-semibold text-stone-400 flex items-center justify-between">
                                    <span className="text-sky-700">{item.category}</span>
                                    <span>{item.readTime}</span>
                                </div>
                                <h4 className="font-bold text-blue-950 text-sm leading-snug group-hover:text-sky-700 transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
}
