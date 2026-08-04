'use server'

import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'sbb_session'
const SESSION_SECRET = process.env.SESSION_SECRET || ''
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 1 week

if (!SESSION_SECRET) {
    console.warn('SESSION_SECRET is not set. Session cookies will be unsigned.')
}

function signSession(value: string) {
    return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex')
}

function encodeSession(value: string) {
    const encoded = Buffer.from(value, 'utf8').toString('base64')
    return `${encoded}.${signSession(value)}`
}

function decodeSession(value: string) {
    const [encoded, signature] = value.split('.')
    if (!encoded || !signature) return null
    const sessionText = Buffer.from(encoded, 'base64').toString('utf8')
    const expected = signSession(sessionText)
    if (signature.length !== expected.length) return null
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(expected, 'utf8'))) {
        return null
    }
    return sessionText
}

// This is a simplified production-ready session implementation using cookies

export async function login(email: string, password?: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        if (!password) {
            return { success: false, error: 'Password required' }
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return { success: false, error: 'Invalid credentials' }
        }

        const sessionData = JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        })

        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE_NAME, encodeSession(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_MAX_AGE
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
    cookieStore.delete(SESSION_COOKIE_NAME)
    revalidatePath('/')
    return { success: true }
}

export async function getSession() {
    try {
        const cookieStore = await cookies()
        const session = cookieStore.get(SESSION_COOKIE_NAME)
        if (!session) return null

        const decoded = decodeSession(session.value)
        if (!decoded) return null

        return JSON.parse(decoded)
    } catch (error) {
        return null
    }
}

export async function updateProfile(data: { name?: string, email?: string }) {
    try {
        const session = await getSession()
        if (!session) return { success: false, error: 'Not authenticated' }

        if (data.email && data.email.toLowerCase() !== session.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email.toLowerCase() }
            })
            if (existingUser && existingUser.id !== session.id) {
                return { success: false, error: 'Email already in use' }
            }
        }

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
        cookieStore.set(SESSION_COOKIE_NAME, encodeSession(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_MAX_AGE
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
        if (!data.password || data.password.length < 8) {
            return { success: false, error: 'Password must be at least 8 characters' }
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email.toLowerCase() }
        })

        if (existingUser) {
            return { success: false, error: 'Email already in use' }
        }

        // Create user
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase(),
                password: hashedPassword,
                role: 'CUSTOMER'
            }
        })

        // Log them in immediately
        return login(user.email, data.password)
    } catch (error) {
        console.error('Registration error:', error)
        return { success: false, error: 'Registration failed' }
    }
}
