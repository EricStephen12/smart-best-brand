'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Clock, ArrowRight, BookOpen, Sparkles, Filter } from 'lucide-react';
import type { BlogPostItem } from '@/components/admin/BlogList';

interface BlogCatalogProps {
    initialPosts: BlogPostItem[];
}

export default function BlogCatalog({ initialPosts }: BlogCatalogProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const categories = useMemo(() => {
        const set = new Set<string>();
        initialPosts.forEach(p => {
            if (p.category) set.add(p.category);
        });
        return Array.from(set);
    }, [initialPosts]);

    const filteredPosts = useMemo(() => {
        return initialPosts.filter(post => {
            const matchesSearch =
                !search ||
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.category.toLowerCase().includes(search.toLowerCase()) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()));

            const matchesCategory =
                selectedCategory === 'ALL' ||
                post.category.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [initialPosts, search, selectedCategory]);

    // Featured post (first post) and remaining posts
    const featuredPost = filteredPosts.length > 0 && !search && selectedCategory === 'ALL' ? filteredPosts[0] : null;
    const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

    return (
        <div className="space-y-12">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-6 border-b border-stone-200">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search articles, guides & tips…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 shadow-sm transition-all"
                    />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            selectedCategory === 'ALL'
                                ? 'bg-blue-950 text-white shadow-sm'
                                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                    >
                        All Guides
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'bg-blue-950 text-white shadow-sm'
                                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Hero Article */}
            {featuredPost && (
                <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:h-[460px] bg-stone-100 overflow-hidden">
                            {featuredPost.coverImage ? (
                                <Image
                                    src={featuredPost.coverImage}
                                    alt={featuredPost.title}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                    <BookOpen className="w-16 h-16" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest rounded-full">
                                    <Sparkles className="w-3 h-3 text-sky-300" />
                                    Featured Read
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-5 p-8 sm:p-12 space-y-5">
                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-stone-400">
                                <span className="text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                                    {featuredPost.category}
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {featuredPost.readTime}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 leading-tight group-hover:text-sky-700 transition-colors">
                                <Link href={`/blog/${featuredPost.slug}`}>
                                    {featuredPost.title}
                                </Link>
                            </h2>

                            {featuredPost.excerpt && (
                                <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                                    {featuredPost.excerpt}
                                </p>
                            )}

                            <div className="pt-3 flex items-center justify-between">
                                <span className="text-xs text-stone-400 font-medium">
                                    By {featuredPost.authorName}
                                </span>
                                <Link
                                    href={`/blog/${featuredPost.slug}`}
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-950 group-hover:text-sky-700 transition-colors"
                                >
                                    <span>Read Full Guide</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Articles Grid */}
            {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridPosts.map((post, idx) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300"
                        >
                            {/* Card Image */}
                            <Link
                                href={`/blog/${post.slug}`}
                                className="block relative aspect-[16/10] bg-stone-100 overflow-hidden"
                            >
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                        <BookOpen className="w-10 h-10" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-blue-950 text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400">
                                        <span>{post.readTime}</span>
                                        <span>
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                timeZone: 'UTC',
                                            })}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-blue-950 leading-snug group-hover:text-sky-700 transition-colors line-clamp-2">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    {post.excerpt && (
                                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-stone-400">
                                        {post.authorName}
                                    </span>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-950 group-hover:text-sky-700 transition-colors"
                                    >
                                        <span>Read article</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredPosts.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 max-w-lg mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-950">No articles found</h3>
                    <p className="text-sm text-stone-500">
                        {initialPosts.length === 0
                            ? 'Our editorial team is currently crafting insightful guides on orthopedic comfort, mattress care, and bedroom wellness. Check back shortly!'
                            : 'No articles matched your search or category filter. Try clearing your search query.'}
                    </p>
                    {search && (
                        <button
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('ALL');
                            }}
                            className="px-5 py-2.5 bg-blue-950 text-white rounded-xl text-xs font-semibold hover:bg-sky-800 transition-colors"
                        >
                            Reset Search Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
