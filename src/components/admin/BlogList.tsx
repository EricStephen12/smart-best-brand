'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit3,
    BookOpen,
    Eye,
    Check,
    X,
    Loader2,
    Search,
    ExternalLink,
    Clock,
    User,
    Tag,
    FileText,
    Sparkles,
} from 'lucide-react';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '@/actions/blog';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { toast } from 'react-hot-toast';

export interface BlogPostItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    category: string;
    authorName: string;
    readTime: string;
    isPublished: boolean;
    publishedAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface BlogListProps {
    initialPosts: BlogPostItem[];
}

const CATEGORY_PRESETS = [
    'Mattress Guide',
    'Sleep Science',
    'Buying Guides',
    'Materials & Care',
    'Pillows & Bedding',
    'Company News',
];

function estimateReadTime(text: string): string {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const [posts, setPosts] = useState<BlogPostItem[]>(initialPosts);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [category, setCategory] = useState('Mattress Guide');
    const [authorName, setAuthorName] = useState('Smart Best Brands');
    const [readTime, setReadTime] = useState('4 min read');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isPublished, setIsPublished] = useState(true);
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Filtered posts
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch =
                !search ||
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.category.toLowerCase().includes(search.toLowerCase()) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()));

            const matchesCategory =
                selectedCategory === 'ALL' ||
                post.category.toLowerCase() === selectedCategory.toLowerCase();

            const matchesStatus =
                selectedStatus === 'ALL' ||
                (selectedStatus === 'PUBLISHED' ? post.isPublished : !post.isPublished);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [posts, search, selectedCategory, selectedStatus]);

    // Categories list for filtering
    const allCategories = useMemo(() => {
        const set = new Set<string>();
        posts.forEach(p => {
            if (p.category) set.add(p.category);
        });
        CATEGORY_PRESETS.forEach(c => set.add(c));
        return Array.from(set);
    }, [posts]);

    const openNewModal = () => {
        setEditingPost(null);
        setTitle('');
        setSlug('');
        setCategory('Mattress Guide');
        setAuthorName('Smart Best Brands');
        setReadTime('4 min read');
        setExcerpt('');
        setContent('');
        setCoverImage('');
        setIsPublished(true);
        setActiveTab('write');
        setIsModalOpen(true);
    };

    const openEditModal = (post: BlogPostItem) => {
        setEditingPost(post);
        setTitle(post.title);
        setSlug(post.slug);
        setCategory(post.category);
        setAuthorName(post.authorName);
        setReadTime(post.readTime);
        setExcerpt(post.excerpt || '');
        setContent(post.content);
        setCoverImage(post.coverImage || '');
        setIsPublished(post.isPublished);
        setActiveTab('write');
        setIsModalOpen(true);
    };

    const handleTitleChange = (val: string) => {
        setTitle(val);
        if (!editingPost) {
            setSlug(slugify(val));
        }
    };

    const handleContentChange = (val: string) => {
        setContent(val);
        setReadTime(estimateReadTime(val));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Article title is required');
            return;
        }
        if (!content.trim()) {
            toast.error('Article content is required');
            return;
        }

        setLoading(true);
        try {
            if (editingPost) {
                const res = await updateBlogPost(editingPost.id, {
                    title: title.trim(),
                    slug: slug.trim() ? slugify(slug) : undefined,
                    category: category.trim(),
                    authorName: authorName.trim(),
                    readTime: readTime.trim(),
                    excerpt: excerpt.trim() || undefined,
                    content: content.trim(),
                    coverImage: coverImage.trim() || undefined,
                    isPublished,
                });

                if (res.success && res.data) {
                    setPosts(prev => prev.map(p => (p.id === editingPost.id ? (res.data as any) : p)));
                    toast.success('Article updated successfully');
                    setIsModalOpen(false);
                } else {
                    toast.error(res.error || 'Failed to update article');
                }
            } else {
                const res = await createBlogPost({
                    title: title.trim(),
                    slug: slug.trim() ? slugify(slug) : undefined,
                    category: category.trim(),
                    authorName: authorName.trim(),
                    readTime: readTime.trim(),
                    excerpt: excerpt.trim() || undefined,
                    content: content.trim(),
                    coverImage: coverImage.trim() || undefined,
                    isPublished,
                });

                if (res.success && res.data) {
                    setPosts(prev => [res.data as any, ...prev]);
                    toast.success('Article created successfully');
                    setIsModalOpen(false);
                } else {
                    toast.error(res.error || 'Failed to create article');
                }
            }
        } catch {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, postTitle: string) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${postTitle}"?`)) {
            return;
        }
        setDeletingId(id);
        try {
            const res = await deleteBlogPost(id);
            if (res.success) {
                setPosts(prev => prev.filter(p => p.id !== id));
                toast.success('Article deleted successfully');
            } else {
                toast.error(res.error || 'Failed to delete article');
            }
        } catch {
            toast.error('An error occurred while deleting');
        } finally {
            setDeletingId(null);
        }
    };

    const togglePublishQuick = async (post: BlogPostItem) => {
        const nextState = !post.isPublished;
        try {
            const res = await updateBlogPost(post.id, { isPublished: nextState });
            if (res.success && res.data) {
                setPosts(prev => prev.map(p => (p.id === post.id ? { ...p, isPublished: nextState } : p)));
                toast.success(nextState ? 'Article published' : 'Article unpublished (Draft)');
            } else {
                toast.error(res.error || 'Failed to change publish status');
            }
        } catch {
            toast.error('An error occurred');
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
                        Blog &amp; Editorial Journal
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Publish mattress guides, sleep tips, and brand stories. Articles appear on the home page and in the public journal.
                    </p>
                </div>
                <button
                    onClick={openNewModal}
                    className="inline-flex items-center gap-2 bg-blue-950 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Write New Article
                </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-stone-200">
                    <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Total Articles</p>
                    <p className="text-2xl font-bold text-blue-950 mt-1">{posts.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-200">
                    <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Published</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                        {posts.filter(p => p.isPublished).length}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-200">
                    <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Drafts</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                        {posts.filter(p => !p.isPublished).length}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-200">
                    <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Live Catalog</p>
                    <Link
                        href="/blog"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 mt-2"
                    >
                        <span>View /blog</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search by title, excerpt or category…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto">
                        {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map(st => (
                            <button
                                key={st}
                                onClick={() => setSelectedStatus(st)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                                    selectedStatus === st
                                        ? 'bg-blue-950 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                            >
                                {st === 'ALL' ? 'All Status' : st === 'PUBLISHED' ? 'Published' : 'Drafts'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1 shrink-0">
                        Category:
                    </span>
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                            selectedCategory === 'ALL'
                                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                        All
                    </button>
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                selectedCategory === cat
                                    ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                                <th className="py-3.5 px-6">Article</th>
                                <th className="py-3.5 px-4">Category</th>
                                <th className="py-3.5 px-4">Author &amp; Read Time</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Date</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-xs">
                            {filteredPosts.map(post => (
                                <tr key={post.id} className="hover:bg-stone-50/60 transition-colors group">
                                    {/* Article Title & Cover */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative">
                                                {post.coverImage ? (
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 max-w-xs sm:max-w-md">
                                                <p className="font-bold text-blue-950 text-sm truncate group-hover:text-sky-700 transition-colors">
                                                    {post.title}
                                                </p>
                                                <p className="text-[11px] text-stone-400 font-mono truncate mt-0.5">
                                                    /blog/{post.slug}
                                                </p>
                                                {post.excerpt && (
                                                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-1 font-normal">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md font-semibold text-[11px]">
                                            {post.category}
                                        </span>
                                    </td>

                                    {/* Author & Read Time */}
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="space-y-0.5">
                                            <p className="font-medium text-blue-950">{post.authorName}</p>
                                            <p className="text-[11px] text-stone-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.readTime}</span>
                                            </p>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <button
                                            onClick={() => togglePublishQuick(post)}
                                            title="Click to toggle publish status"
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                                                post.isPublished
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    post.isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`}
                                            />
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </button>
                                    </td>

                                    {/* Date */}
                                    <td className="py-4 px-4 whitespace-nowrap text-stone-400">
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            timeZone: 'UTC',
                                        })}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-6 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-1">
                                            {post.isPublished && (
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-stone-100 rounded-lg text-slate-400 hover:text-blue-950 transition-all"
                                                    title="View live article"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => openEditModal(post)}
                                                className="p-2 hover:bg-stone-100 rounded-lg text-slate-400 hover:text-blue-950 transition-all"
                                                title="Edit article"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id, post.title)}
                                                disabled={deletingId === post.id}
                                                className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all disabled:opacity-40"
                                                title="Delete article"
                                            >
                                                {deletingId === post.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="max-w-sm mx-auto space-y-3">
                                            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold text-blue-950">No articles found</p>
                                            <p className="text-xs text-stone-500">
                                                {posts.length === 0
                                                    ? 'You haven’t created any blog posts yet. Click the button below to write your first article!'
                                                    : 'No articles match your current search or filter query.'}
                                            </p>
                                            {posts.length === 0 && (
                                                <button
                                                    onClick={openNewModal}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-950 text-white rounded-xl text-xs font-semibold hover:bg-sky-800 transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Write First Article
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !loading && setIsModalOpen(false)}
                            className="fixed inset-0 bg-blue-950/50 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-bold">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-blue-950">
                                            {editingPost ? 'Edit Blog Article' : 'Write New Blog Article'}
                                        </h2>
                                        <p className="text-xs text-stone-500">
                                            Create rich sleep guides, mattress buying advice, and brand announcements.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => !loading && setIsModalOpen(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body / Form */}
                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Title & Slug */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-blue-950 uppercase tracking-wider block mb-1.5">
                                            Article Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. How to Choose the Right Orthopedic Mattress for Back Pain"
                                            value={title}
                                            onChange={e => handleTitleChange(e.target.value)}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                                            URL Slug
                                        </label>
                                        <div className="flex items-center">
                                            <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-200 text-stone-500 text-xs rounded-l-xl select-none font-mono">
                                                /blog/
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="how-to-choose-orthopedic-mattress"
                                                value={slug}
                                                onChange={e => setSlug(e.target.value)}
                                                className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-r-xl text-xs font-mono text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Meta Grid: Category, Author, Read Time, Publish Status */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                                    {/* Category */}
                                    <div>
                                        <label className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block mb-1.5">
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            list="category-suggestions"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            placeholder="e.g. Mattress Guide"
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20"
                                        />
                                        <datalist id="category-suggestions">
                                            {allCategories.map(c => (
                                                <option key={c} value={c} />
                                            ))}
                                        </datalist>
                                    </div>

                                    {/* Author */}
                                    <div>
                                        <label className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block mb-1.5">
                                            Author Name
                                        </label>
                                        <input
                                            type="text"
                                            value={authorName}
                                            onChange={e => setAuthorName(e.target.value)}
                                            placeholder="Smart Best Brands"
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20"
                                        />
                                    </div>

                                    {/* Read Time */}
                                    <div>
                                        <label className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block mb-1.5">
                                            Estimated Read Time
                                        </label>
                                        <input
                                            type="text"
                                            value={readTime}
                                            onChange={e => setReadTime(e.target.value)}
                                            placeholder="4 min read"
                                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-950/20"
                                        />
                                    </div>

                                    {/* Publish Toggle */}
                                    <div>
                                        <label className="text-[11px] font-bold text-blue-950 uppercase tracking-wider block mb-1.5">
                                            Status
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                                            <input
                                                type="checkbox"
                                                checked={isPublished}
                                                onChange={e => setIsPublished(e.target.checked)}
                                                className="w-4 h-4 accent-blue-950 rounded cursor-pointer"
                                            />
                                            <span className="text-xs font-bold text-blue-950">
                                                {isPublished ? 'Published live' : 'Save as Draft'}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Cover Image Upload */}
                                <div>
                                    <label className="text-xs font-bold text-blue-950 uppercase tracking-wider block mb-1.5">
                                        Cover Image
                                    </label>
                                    <div className="space-y-3">
                                        <CloudinaryUpload
                                            value={coverImage ? [coverImage] : []}
                                            onChange={urls => setCoverImage(urls[0] || '')}
                                            maxFiles={1}
                                            label="Upload Cover Image"
                                        />
                                        {coverImage && (
                                            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                                                <Image
                                                    src={coverImage}
                                                    alt="Cover preview"
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setCoverImage('')}
                                                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="text-xs font-bold text-blue-950 uppercase tracking-wider block mb-1.5">
                                        Short Excerpt / Teaser
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={excerpt}
                                        onChange={e => setExcerpt(e.target.value)}
                                        placeholder="A brief 1-2 sentence preview shown on article cards and search results…"
                                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-blue-950 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950"
                                    />
                                </div>

                                {/* Article Body & Preview Tabs */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('write')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                    activeTab === 'write'
                                                        ? 'bg-blue-950 text-white'
                                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                                }`}
                                            >
                                                Write Content
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('preview')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                    activeTab === 'preview'
                                                        ? 'bg-blue-950 text-white'
                                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                                }`}
                                            >
                                                Live Preview
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-stone-400">
                                            {content.trim().split(/\s+/).filter(Boolean).length} words
                                        </span>
                                    </div>

                                    {activeTab === 'write' ? (
                                        <div>
                                            <textarea
                                                required
                                                rows={14}
                                                value={content}
                                                onChange={e => handleContentChange(e.target.value)}
                                                placeholder="Write your article here. Supports paragraphs, headings, bullet lists, and quotes. Use empty double lines between paragraphs for clean spacing."
                                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm leading-relaxed text-blue-950 placeholder-stone-400 font-sans focus:outline-none focus:ring-2 focus:ring-blue-950/20 focus:border-blue-950 font-normal"
                                            />
                                            <p className="text-[11px] text-stone-400 mt-1">
                                                Tip: Use clear headings and short paragraphs. You can also format text with bullet points (- item) or quotes (&gt; quote).
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 min-h-[300px] max-h-[450px] overflow-y-auto space-y-4">
                                            {content ? (
                                                <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-3">
                                                    {content.split('\n\n').map((paragraph, idx) => {
                                                        const p = paragraph.trim();
                                                        if (p.startsWith('# ')) {
                                                            return (
                                                                <h2 key={idx} className="text-xl font-bold text-blue-950 mt-4 mb-2">
                                                                    {p.replace('# ', '')}
                                                                </h2>
                                                            );
                                                        }
                                                        if (p.startsWith('## ')) {
                                                            return (
                                                                <h3 key={idx} className="text-lg font-bold text-blue-950 mt-3 mb-1.5">
                                                                    {p.replace('## ', '')}
                                                                </h3>
                                                            );
                                                        }
                                                        if (p.startsWith('> ')) {
                                                            return (
                                                                <blockquote key={idx} className="border-l-4 border-blue-950 pl-4 py-1 italic text-stone-700 bg-stone-100 rounded-r-lg">
                                                                    {p.replace('> ', '')}
                                                                </blockquote>
                                                            );
                                                        }
                                                        return (
                                                            <p key={idx} className="text-stone-700 leading-relaxed">
                                                                {p}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-stone-400 italic">No content written yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Modal Actions */}
                                <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-sky-700 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                                    >
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        <span>{editingPost ? 'Save Changes' : 'Publish Article'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
