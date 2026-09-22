'use client';

import React, { useState } from 'react';
import { Save, Loader2, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { updatePasswordAction } from '@/actions/auth';
import { toast } from 'react-hot-toast';

const fieldClass =
  'w-full px-4 py-3 bg-stone-50/70 border border-stone-200 focus:border-blue-950 focus:ring-2 focus:ring-blue-950/20 rounded-xl text-sm font-medium text-blue-950 placeholder-stone-400 outline-none transition-all';
const labelClass =
  'block text-xs font-semibold text-blue-950 uppercase tracking-wider mb-2';

export default function SettingsPage() {
  const { user, updateUser, isLoading } = useAuth();

  // Profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

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
      <div className="max-w-2xl py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-950" />
        <p className="text-sm text-stone-500">Loading your profile…</p>
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
      toast.success('Profile saved.');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsSavingPassword(true);
    try {
      const result = await updatePasswordAction({
        currentPassword: currentPassword || undefined,
        newPassword,
      });
      if (!result.success) {
        toast.error(result.error || 'Failed to update password');
        return;
      }
      toast.success('Password updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Could not update password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 font-sans pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
          Account Settings
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Manage your personal details, delivery preferences, and password.
        </p>
      </div>

      {/* ── Profile & Delivery ── */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <User className="w-5 h-5 text-blue-950 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-blue-950">Profile &amp; Delivery Details</h2>
            <p className="text-xs text-stone-500 mt-0.5">Pre-filled at checkout — keep this up to date.</p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Email address</label>
          <div className="relative">
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm font-medium text-stone-500 cursor-not-allowed"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Verified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Phone number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08012345678" className={fieldClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Delivery city / state</label>
            <input type="text" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="e.g. Abuja, Lagos, Benin City" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Street address</label>
            <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="e.g. 15 Admiralty Way, Lekki" className={fieldClass} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSavingProfile}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-950 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed">
            {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save details
          </button>
        </div>
      </form>

      {/* ── Password ── */}
      <form onSubmit={handleSavePassword} className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <Lock className="w-5 h-5 text-blue-950 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-blue-950">Change Password</h2>
            <p className="text-xs text-stone-500 mt-0.5">Leave current password blank if you have never set one.</p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Current password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className={fieldClass}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-blue-950 transition-colors"
              tabIndex={-1}>
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>New password</label>
            <div className="relative">
              <input
                required
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={fieldClass}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-blue-950 transition-colors"
                tabIndex={-1}>
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Confirm new password</label>
            <div className="relative">
              <input
                required
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className={fieldClass}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-blue-950 transition-colors"
                tabIndex={-1}>
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Password strength hint */}
        {newPassword.length > 0 && (
          <p className={`text-xs font-medium ${newPassword.length < 6 ? 'text-rose-500' : newPassword.length < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {newPassword.length < 6 ? 'Too short — minimum 6 characters'
              : newPassword.length < 10 ? 'Acceptable — consider making it longer'
              : 'Strong password'}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSavingPassword || !newPassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-950 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed">
            {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}
