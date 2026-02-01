import React from 'react';
import { getProductBySlug } from '@/actions/products';
import ProductDetailView from '@/components/ProductDetailView';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: PageProps) {
    const { slug } = await params;

    const result = await getProductBySlug(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    return <ProductDetailView product={result.data} />;
}
