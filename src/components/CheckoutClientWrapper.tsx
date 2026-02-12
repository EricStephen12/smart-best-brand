'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const CheckoutForm = dynamic(() => import('./CheckoutForm'), {
    ssr: false,
    loading: () => (
        <div className="animate-pulse space-y-12">
            <div className="h-64 bg-slate-100 rounded-[2.5rem]" />
            <div className="h-48 bg-slate-100 rounded-[2.5rem]" />
        </div>
    )
});

interface CheckoutClientWrapperProps {
    zones: any[];
}

export default function CheckoutClientWrapper({ zones }: CheckoutClientWrapperProps) {
    return <CheckoutForm zones={zones} />;
}
