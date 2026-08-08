'use client'

import { useEffect, useState } from 'react'
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { getSession, updateProfile as serverUpdateProfile } from '@/actions/auth'

export interface User {
    id: string
    email: string
    role: 'ADMIN' | 'CUSTOMER'
    name?: string | null
}

export function useAuth() {
    const { isLoaded: clerkLoaded, isSignedIn } = useClerkAuth()
    const { user: clerkUser } = useUser()
    const { signOut } = useClerk()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const syncUser = async () => {
            if (!clerkLoaded) return

            if (!isSignedIn) {
                if (!cancelled) {
                    setUser(null)
                    setIsLoading(false)
                }
                return
            }

            try {
                const session = await getSession()
                if (!cancelled) {
                    setUser(
                        session
                            ? {
                                  id: session.id,
                                  email: session.email,
                                  role: session.role,
                                  name: session.name,
                              }
                            : null
                    )
                }
            } catch (error) {
                console.error('Failed to sync app user:', error)
                if (!cancelled) setUser(null)
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        void syncUser()
        return () => {
            cancelled = true
        }
    }, [clerkLoaded, isSignedIn, clerkUser?.id])

    const logout = async () => {
        await signOut({ redirectUrl: '/login' })
        setUser(null)
    }

    const updateUser = async (data: Partial<User>) => {
        if (!user) return { success: false, error: 'Not authenticated' }
        const result = await serverUpdateProfile({ name: data.name ?? undefined })
        if (result.success && result.user) {
            setUser(result.user as User)
            return { success: true }
        }
        return { success: false, error: result.error }
    }

    return {
        user,
        isLoading: !clerkLoaded || isLoading,
        isSignedIn: !!isSignedIn,
        logout,
        updateUser,
    }
}
