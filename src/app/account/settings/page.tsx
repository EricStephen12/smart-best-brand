'use client';

import React, { useState } from 'react';
import { Save, Loader2, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
    const { user, updateUser, isLoading } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Sync input fields when user loads from auth session
    React.useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setDeliveryAddress(user.deliveryAddress || '');
            setDeliveryLocation(user.deliveryLocation || '');
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="max-w-2xl py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-950" />
                <p className="text-sm font-medium text-slate-500">Loading your profile…</p>
            </div>
        );
    }

    if (!user) return null;

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const result = await updateUser({
                name: name.trim(),
                phone: phone.trim(),
                deliveryAddress: deliveryAddress.trim(),
                deliveryLocation: deliveryLocation.trim(),
            });
            if (result?.success === false) {
                toast.error(result.error || 'Failed to update profile');
                return;
            }
            toast.success('Profile and delivery details saved!');
        } catch (err) {
            console.error('Could not save profile:', err);
            toast.error('Could not update profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-8 font-sans pb-16">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
                    Account Settings
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Manage your personal details, delivery preferences, and security.
                </p>
            </div>

            {/* Profile Information Section */}
            <form onSubmit={handleSaveProfile} className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                    <User className="w-5 h-5 text-blue-950" />
                    <div>
                        <h2 className="text-base font-bold text-blue-950">Profile & Delivery Details</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Used to pre-fill your orders at checkout</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                                Verified
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full px-4 py-3 bg-stone-50/70 border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 rounded-xl text-sm font-medium text-blue-950 placeholder-stone-400 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 08012345678"
                                className="w-full px-4 py-3 bg-stone-50/70 border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 rounded-xl text-sm font-medium text-blue-950 placeholder-stone-400 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2">
                                Delivery State / City
                            </label>
                            <input
                                type="text"
                                value={deliveryLocation}
                                onChange={(e) => setDeliveryLocation(e.target.value)}
                                placeholder="e.g. Lagos, Abuja, Benin City"
                                className="w-full px-4 py-3 bg-stone-50/70 border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 rounded-xl text-sm font-medium text-blue-950 placeholder-stone-400 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
                                className="w-full px-4 py-3 bg-stone-50/70 border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 rounded-xl text-sm font-medium text-blue-950 placeholder-stone-400 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-950 hover:bg-sky-800 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Details
                    </button>
                </div>
            </form>
        </div>
    );
}
