import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import type { Role, User } from '@prisma/client'

export interface AppUser {
    id: string
    clerkId: string
    email: string
    role: Role
    name: string | null
}

function toAppUser(user: User, clerkId: string): AppUser {
    return {
        id: user.id,
        clerkId: user.clerkId ?? clerkId,
        email: user.email,
        role: user.role,
        name: user.name,
    }
}

/**
 * Resolve the signed-in Clerk user to our Prisma User row.
 * Passwords live in Clerk only — we only store app profile + role.
 */
export async function ensureAppUser(): Promise<AppUser | null> {
    const { userId } = await auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    if (!clerkUser) return null

    const email =
        clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
            ?.emailAddress ||
        clerkUser.emailAddresses[0]?.emailAddress

    if (!email) {
        console.error('Clerk user has no email address', userId)
        return null
    }

    const name =
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() ||
        clerkUser.username ||
        null

    const existingByClerk = await prisma.user.findUnique({
        where: { clerkId: userId },
    })

    if (existingByClerk) {
        const needsUpdate =
            existingByClerk.email !== email.toLowerCase() ||
            (name && existingByClerk.name !== name)

        if (needsUpdate) {
            const updated = await prisma.user.update({
                where: { id: existingByClerk.id },
                data: {
                    email: email.toLowerCase(),
                    ...(name ? { name } : {}),
                },
            })
            return toAppUser(updated, userId)
        }

        return toAppUser(existingByClerk, userId)
    }

    // Link legacy row that already has this email (pre-Clerk users)
    const existingByEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    })

    if (existingByEmail) {
        const linked = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: {
                clerkId: userId,
                ...(name ? { name } : {}),
            },
        })
        return toAppUser(linked, userId)
    }

    const created = await prisma.user.create({
        data: {
            clerkId: userId,
            email: email.toLowerCase(),
            name,
            role: 'CUSTOMER',
        },
    })
    return toAppUser(created, userId)
}

export async function requireSession(): Promise<AppUser> {
    const session = await ensureAppUser()
    if (!session) {
        throw new Error('Not authenticated')
    }
    return session
}

export async function requireAdmin(): Promise<AppUser> {
    const session = await requireSession()
    if (session.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }
    return session
}
