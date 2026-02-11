'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrand } from '@/actions/brands';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { toast } from 'react-hot-toast';

export default function CreateBrandPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string[]>([]);
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (logoUrl.length > 0) {
                formData.append('logoUrl', logoUrl[0]);
            }

            const result = await createBrand(formData);
            if (result.success) {
                toast.success('Brand created successfully');
                router.push('/account/brands');
            } else {
                toast.error(result.error || 'Failed to create brand');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <div className="flex items-center gap-6">
                <Link
                    href="/account/brands"
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-slate-400 transition-all border border-transparent hover:border-gray-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-blue-950 dark:text-white tracking-tight leading-none mb-2">Add Elite Brand</h1>
                    <p className="text-sm font-medium text-slate-400">Establish a new brand partnership identity.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-700 shadow-2xl shadow-blue-900/5 space-y-10">
                {/* Brand Logo Upload */}
                <div className="space-y-4">
                    <CloudinaryUpload
                        value={logoUrl}
                        onChange={setLogoUrl}
                        maxFiles={1}
                        label="Identity Logo"
                    />
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Legal Brand Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-sky-600 rounded-2xl outline-none transition-all font-bold text-blue-950 dark:text-white placeholder:text-slate-300"
                            placeholder="e.g. Vitafoam Nigeria"
                        />
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-950/20 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Finalize Partnership
                    </button>
                </div>
            </form>
        </div>
    );
}
