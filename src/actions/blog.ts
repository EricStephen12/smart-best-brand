'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getSession } from '@/actions/auth'

export interface CreateBlogPostInput {
    title: string
    slug?: string
    excerpt?: string
    content: string
    coverImage?: string
    category?: string
    authorName?: string
    readTime?: string
    isPublished?: boolean
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

async function ensureUniqueSlug(baseSlug: string, currentId?: string): Promise<string> {
    let candidate = baseSlug || 'article'
    let counter = 1
    while (true) {
        const existing = await prisma.blogPost.findUnique({
            where: { slug: candidate }
        })
        if (!existing || existing.id === currentId) {
            return candidate
        }
        candidate = `${baseSlug}-${counter}`
        counter++
    }
}

// ─────────────────────────────────────────────────────────────
// READ OPERATIONS
// ─────────────────────────────────────────────────────────────

// Get all posts for admin management
export async function getAllBlogPosts() {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: posts }
    } catch (error: any) {
        console.error('Error fetching all blog posts:', error)
        return { success: false, error: error?.message || 'Failed to fetch blog posts' }
    }
}

// Get published posts for public catalog & homepage
export async function getPublishedBlogPosts(options?: { limit?: number; category?: string }) {
    try {
        const where: any = { isPublished: true }
        if (options?.category && options.category !== 'All') {
            where.category = { equals: options.category, mode: 'insensitive' }
        }

        const posts = await prisma.blogPost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: options?.limit
        })
        return { success: true, data: posts }
    } catch (error: any) {
        console.error('Error fetching published blog posts:', error)
        return { success: false, error: error?.message || 'Failed to fetch published posts', data: [] }
    }
}

// Get post by slug
export async function getBlogPostBySlug(slug: string) {
    try {
        if (!slug || typeof slug !== 'string') {
            return { success: false, error: 'Invalid article slug' }
        }

        const post = await prisma.blogPost.findUnique({
            where: { slug }
        })

        if (!post) {
            return { success: false, error: 'Article not found' }
        }

        // Fetch related posts in same category
        const related = await prisma.blogPost.findMany({
            where: {
                isPublished: true,
                id: { not: post.id },
                category: post.category
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, data: post, related }
    } catch (error: any) {
        console.error('Error fetching blog post by slug:', error)
        return { success: false, error: error?.message || 'Failed to load article' }
    }
}

// ─────────────────────────────────────────────────────────────
// ADMIN MUTATIONS
// ─────────────────────────────────────────────────────────────

// Create blog post
export async function createBlogPost(input: CreateBlogPostInput) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Admin access required' }
        }

        if (!input.title?.trim()) {
            return { success: false, error: 'Article title is required' }
        }

        if (!input.content?.trim()) {
            return { success: false, error: 'Article content cannot be empty' }
        }

        const rawSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title)
        const uniqueSlug = await ensureUniqueSlug(rawSlug)

        const post = await prisma.blogPost.create({
            data: {
                title: input.title.trim(),
                slug: uniqueSlug,
                excerpt: input.excerpt?.trim() || null,
                content: input.content.trim(),
                coverImage: input.coverImage?.trim() || null,
                category: input.category?.trim() || 'Mattress Guide',
                authorName: input.authorName?.trim() || 'Smart Best Brands',
                readTime: input.readTime?.trim() || '4 min read',
                isPublished: input.isPublished ?? true,
                publishedAt: (input.isPublished ?? true) ? new Date() : null,
            }
        })

        revalidatePath('/')
        revalidatePath('/blog')
        revalidatePath(`/blog/${post.slug}`)
        revalidatePath('/account/blog')

        return { success: true, data: post }
    } catch (error: any) {
        console.error('Error creating blog post:', error)
        return { success: false, error: error?.message || 'Failed to create blog post' }
    }
}

// Update blog post
export async function updateBlogPost(id: string, input: UpdateBlogPostInput) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Admin access required' }
        }

        const existing = await prisma.blogPost.findUnique({ where: { id } })
        if (!existing) {
            return { success: false, error: 'Article not found' }
        }

        let newSlug = existing.slug
        if (input.slug && input.slug !== existing.slug) {
            newSlug = await ensureUniqueSlug(slugify(input.slug), id)
        } else if (input.title && !input.slug && input.title !== existing.title) {
            // keep old slug unless specifically edited, to avoid broken backlinks
        }

        const isPublishedNow = input.isPublished ?? existing.isPublished
        const publishedAt = isPublishedNow && !existing.publishedAt ? new Date() : existing.publishedAt

        const updated = await prisma.blogPost.update({
            where: { id },
            data: {
                ...(input.title !== undefined && { title: input.title.trim() }),
                slug: newSlug,
                ...(input.excerpt !== undefined && { excerpt: input.excerpt?.trim() || null }),
                ...(input.content !== undefined && { content: input.content.trim() }),
                ...(input.coverImage !== undefined && { coverImage: input.coverImage?.trim() || null }),
                ...(input.category !== undefined && { category: input.category?.trim() || 'Mattress Guide' }),
                ...(input.authorName !== undefined && { authorName: input.authorName?.trim() || 'Smart Best Brands' }),
                ...(input.readTime !== undefined && { readTime: input.readTime?.trim() || '4 min read' }),
                ...(input.isPublished !== undefined && { isPublished: input.isPublished, publishedAt }),
            }
        })

        revalidatePath('/')
        revalidatePath('/blog')
        revalidatePath(`/blog/${existing.slug}`)
        revalidatePath(`/blog/${updated.slug}`)
        revalidatePath('/account/blog')

        return { success: true, data: updated }
    } catch (error: any) {
        console.error('Error updating blog post:', error)
        return { success: false, error: error?.message || 'Failed to update blog post' }
    }
}

// Delete blog post
export async function deleteBlogPost(id: string) {
    try {
        const session = await getSession()
        if (!session || session.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Admin access required' }
        }

        const existing = await prisma.blogPost.findUnique({ where: { id } })
        if (!existing) {
            return { success: false, error: 'Article not found' }
        }

        await prisma.blogPost.delete({ where: { id } })

        revalidatePath('/')
        revalidatePath('/blog')
        revalidatePath(`/blog/${existing.slug}`)
        revalidatePath('/account/blog')

        return { success: true }
    } catch (error: any) {
        console.error('Error deleting blog post:', error)
        return { success: false, error: error?.message || 'Failed to delete blog post' }
    }
}
