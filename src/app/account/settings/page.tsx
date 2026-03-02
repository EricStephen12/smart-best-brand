'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Smartphone, ArrowRight, Save, Loader2 } from 'lucide-react';
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
            await updateUser({ name });
            toast.success('Identity protocols updated');
        } catch (error) {
            toast.error('Failed to update protocol');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-24 font-sans max-w-5xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-blue-950 tracking-tight uppercase leading-none mb-1">Account Protocol</h1>
                    <p className="text-slate-400 font-medium font-inter">Configure your elite preferences and security keys.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <SettingsSection
                        icon={User}
                        title="Profile Identity"
                        description="Manage your public-facing essence and contact details."
                    >
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputGroup label="Email Identity" value={user.email} disabled />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Display Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Adebayo Johnson"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl text-sm font-bold text-blue-950 outline-none transition-all duration-300 shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex justify-end">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving || name === user.name}
                                    className="flex items-center gap-3 px-8 py-4 bg-blue-950 hover:bg-sky-600 disabled:opacity-30 disabled:hover:bg-blue-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl shadow-blue-950/10"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Save className="w-4 h-4" />}
                                    Commit Changes
                                </button>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        icon={Shield}
                        title="Security Architecture"
                        description="Re-authenticate or update your protective security keys."
                    >
                        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <p className="text-xs font-bold text-blue-950 mb-1">Standard Encryption</p>
                                <p className="text-[10px] text-slate-400 font-medium">Your password is encrypted using high-level protocols.</p>
                            </div>
                            <button className="px-6 py-3 bg-white border border-slate-200 text-blue-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-sky-200 hover:text-sky-600 transition-all shadow-sm">
                                Rotate Security Key
                            </button>
                        </div>
                    </SettingsSection>
                </div>

                <div className="space-y-8">
                    <div className="bg-blue-950 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl shadow-blue-950/20 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <Bell className="w-8 h-8 text-sky-400 mb-8 relative z-10" />
                        <h3 className="text-xl font-black uppercase tracking-widest mb-4 relative z-10">Elite Dispatch</h3>
                        <p className="text-sky-100/60 text-sm font-medium mb-8 leading-relaxed font-inter relative z-10">
                            Receive real-time updates on your essence trajectory via WhatsApp or Global SMS.
                        </p>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-6 bg-sky-600 rounded-full relative shadow-inner">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Protocol Active</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200/50">
                        <Smartphone className="w-8 h-8 text-blue-950 mb-8" />
                        <h3 className="text-lg font-black text-blue-950 uppercase tracking-widest mb-4">Device Sync</h3>
                        <p className="text-xs text-slate-400 font-medium mb-8 font-inter">Your account is synchronized across 1 active session in Lagos, Nigeria.</p>
                        <button className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-200 hover:border-red-500 transition-all">
                            Revoke sessions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsSection({ icon: Icon, title, description, children }: { icon: React.ElementType, title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-950/5">
            <div className="flex items-center gap-6 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-950">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-blue-950 uppercase tracking-widest">{title}</h2>
                    <p className="text-xs text-slate-400 font-medium">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function InputGroup({ label, value, placeholder, disabled }: { label: string, value?: string, placeholder?: string, disabled?: boolean }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{label}</label>
            <input
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl text-sm font-bold text-blue-950 outline-none transition-all duration-300 disabled:opacity-50 shadow-inner"
            />
        </div>
    );
}
