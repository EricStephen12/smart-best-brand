'use server'

import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

// This is a simplified production-ready session implementation using cookies

export async function login(email: string, password?: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        // Specific Admin Override for the boss
        const isAdminEssence = email === 'smartbestbrands@gmail.com' && password === 'smart123@123';

        if (!isAdminEssence && password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { success: false, error: 'Invalid security key' }
            }
        } else if (!isAdminEssence && !password) {
            // For "tokenless" first-step login (if implemented) we might allow bypass, 
            // but for security we usually require password.
            return { success: false, error: 'Password required' }
        }

        // Set an HTTP-only cookie for session
        const sessionData = JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        })

        const cookieStore = await cookies()
        cookieStore.set('sbb_session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        revalidatePath('/')
        return { success: true, user: JSON.parse(sessionData) }
    } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: 'Authentication failed' }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('sbb_session')
    revalidatePath('/')
    return { success: true }
}

export async function getSession() {
    try {
        const cookieStore = await cookies()
        const session = cookieStore.get('sbb_session')
        if (!session) return null
        return JSON.parse(session.value)
    } catch (error) {
        return null
    }
}

export async function updateProfile(data: { name?: string, email?: string }) {
    try {
        const session = await getSession()
        if (!session) return { success: false, error: 'Not authenticated' }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: {
                name: data.name,
                email: data.email?.toLowerCase()
            }
        })

        // Update cookie
        const sessionData = JSON.stringify({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name
        })

        const cookieStore = await cookies()
        cookieStore.set('sbb_session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        })

        revalidatePath('/account')
        return { success: true, user: updatedUser }
    } catch (error) {
        console.error('Profile update error:', error)
        return { success: false, error: 'Update failed' }
    }
}

export async function register(data: { name: string, email: string, password?: string }) {
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email.toLowerCase() }
        })

        if (existingUser) {
            return { success: false, error: 'Email already in use' }
        }

        // Create user
        const hashedPassword = await bcrypt.hash(data.password || 'password', 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase(),
                password: hashedPassword,
                role: 'CUSTOMER'
            }
        })

        // Log them in immediately
        return login(user.email, data.password || 'password')
    } catch (error) {
        console.error('Registration error:', error)
        return { success: false, error: 'Registration failed' }
    }
}
