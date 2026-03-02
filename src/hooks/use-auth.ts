'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { login as serverLogin, logout as serverLogout, getSession, updateProfile as serverUpdateProfile, register as serverRegister } from '@/actions/auth';

export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER';
    name?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            if (session) {
                setUser(session);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const isAccountRoute = pathname.startsWith('/account');

            if (isAccountRoute && !user) {
                router.push('/login');
            }
        }
    }, [isLoading, user, pathname, router]);

    const login = async (role: 'ADMIN' | 'CUSTOMER', email: string, password?: string) => {
        const result = await serverLogin(email, password);
        if (result.success) {
            setUser(result.user as User);
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const logout = async () => {
        await serverLogout();
        setUser(null);
        router.push('/login');
    };

    const updateUser = async (data: Partial<User>) => {
        if (!user) return;
        const result = await serverUpdateProfile({ name: data.name, email: data.email });
        if (result.success) {
            setUser(result.user as User);
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const register = async (name: string, email: string, password?: string) => {
        const result = await serverRegister({ name, email, password });
        if (result.success) {
            setUser(result.user as User);
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    return { user, isLoading, login, logout, updateUser, register };
}
