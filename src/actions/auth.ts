'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { ensureAppUser, type AppUser } from '@/lib/auth'

export async function getSession(): Promise<AppUser | null> {
    try {
        return await ensureAppUser()
    } catch (error) {
        console.error('getSession error:', error)
        return null
    }
}

export async function updateProfile(data: { name?: string }) {
    try {
        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Not authenticated' }
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.id },
            data: {
                name: data.name?.trim() || null,
            },
        })

        revalidatePath('/account')
        return {
            success: true,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                role: updatedUser.role,
                name: updatedUser.name,
            },
        }
    } catch (error) {
        console.error('Profile update error:', error)
        return { success: false, error: 'Update failed' }
    }
}
