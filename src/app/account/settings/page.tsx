'use client';

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const result = await updateUser({ name });
            if (result?.success === false) {
                toast.error(result.error || 'Could not update profile');
                return;
            }
            toast.success('Profile updated');
        } catch {
            toast.error('Could not update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-xl space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-blue-950 tracking-tight">
                    Settings
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    Update your name and manage login security.
                </p>
            </div>

            <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-5">
                <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600"
                    />
                </div>
                <div>
                    <label className="block text-xs text-stone-500 mb-1.5">Display name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3 py-2.5 bg-white border border-stone-200 focus:border-sky-500 rounded-lg text-sm text-blue-950 outline-none"
                    />
                </div>
                <div className="flex justify-end pt-1">
                    <button
                        onClick={handleSaveProfile}
                        disabled={isSaving || name === (user.name || '')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-950 hover:bg-sky-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                </div>
            </section>

            <section className="bg-white border border-stone-200 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-blue-950 mb-1">Password & security</h2>
                <p className="text-sm text-stone-500 mb-4">
                    Change your password in Clerk. We don’t store passwords in this app.
                </p>
                <a
                    href="https://accounts.clerk.com/user"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-sm font-medium text-sky-700 hover:underline"
                >
                    Open security settings
                </a>
            </section>
        </div>
    );
}
