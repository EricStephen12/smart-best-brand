'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  getSession,
  loginAction,
  registerAction,
  logoutAction,
  updateProfile,
} from '@/actions/auth'

export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  name?: string | null
  phone?: string | null
  deliveryAddress?: string | null
  deliveryLocation?: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const session = await getSession()
      setUser(
        session
          ? {
              id: session.id,
              email: session.email,
              role: session.role,
              name: session.name,
              phone: session.phone,
              deliveryAddress: session.deliveryAddress,
              deliveryLocation: session.deliveryLocation,
            }
          : null
      )
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    const result = await loginAction(data)
    if (result.success && result.user) {
      setUser({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name,
        phone: result.user.phone,
        deliveryAddress: result.user.deliveryAddress,
        deliveryLocation: result.user.deliveryLocation,
      })
      setIsLoading(false)
      return { success: true }
    }
    setIsLoading(false)
    return { success: false, error: result.error || 'Failed to sign in' }
  }

  const register = async (data: {
    name?: string
    email: string
    password: string
    phone?: string
  }) => {
    setIsLoading(true)
    const result = await registerAction(data)
    if (result.success && result.user) {
      setUser({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name,
        phone: result.user.phone,
        deliveryAddress: result.user.deliveryAddress,
        deliveryLocation: result.user.deliveryLocation,
      })
      setIsLoading(false)
      return { success: true }
    }
    setIsLoading(false)
    return { success: false, error: result.error || 'Failed to create account' }
  }

  const logout = async (redirectUrl?: unknown) => {
    await logoutAction()
    setUser(null)
    const target = typeof redirectUrl === 'string' ? redirectUrl : '/login'
    router.push(target)
    router.refresh()
  }

  const updateUser = async (data: {
    name?: string
    phone?: string
    deliveryAddress?: string
    deliveryLocation?: string
  }) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    const result = await updateProfile(data)
    if (result.success && result.user) {
      setUser({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name,
        phone: result.user.phone,
        deliveryAddress: result.user.deliveryAddress,
        deliveryLocation: result.user.deliveryLocation,
      })
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  return {
    user,
    isLoading,
    isSignedIn: Boolean(user),
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  }
}
