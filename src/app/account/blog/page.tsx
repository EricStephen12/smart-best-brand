import React from 'react';
import { getAllBlogPosts } from '@/actions/blog';
import BlogList from '@/components/admin/BlogList';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
    const res = await getAllBlogPosts();
    const posts = res.success && res.data ? res.data : [];

    return (
        <div className="space-y-8">
            <BlogList initialPosts={posts as any} />
        </div>
    );
}
