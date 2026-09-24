'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import type { Role } from '@prisma/client'

export interface UserListItem {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: Role
  createdAt: Date
  _count: {
    orders: number
  }
}

export async function getUsersList(query?: string): Promise<{
  success: boolean
  error?: string
  data?: UserListItem[]
}> {
  try {
    await requireAdmin()

    const trimmedQuery = query?.trim().toLowerCase()

    const users = await prisma.user.findMany({
      where: trimmedQuery
        ? {
            OR: [
              { name: { contains: trimmedQuery, mode: 'insensitive' } },
              { email: { contains: trimmedQuery, mode: 'insensitive' } },
              { phone: { contains: trimmedQuery, mode: 'insensitive' } },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: users }
  } catch (error) {
    console.error('getUsersList error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
    }
  }
}

export async function updateUserRole(
  targetUserId: string,
  newRole: 'ADMIN' | 'CUSTOMER'
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminSession = await requireAdmin()

    if (adminSession.id === targetUserId && newRole !== 'ADMIN') {
      return {
        success: false,
        error: 'You cannot remove your own admin privileges to avoid account lockout.',
      }
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) {
      return { success: false, error: 'User not found' }
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole as Role },
    })

    revalidatePath('/account/customers')
    return { success: true }
  } catch (error) {
    console.error('updateUserRole error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user role',
    }
  }
}

export async function deleteUser(
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminSession = await requireAdmin()

    if (adminSession.id === targetUserId) {
      return {
        success: false,
        error: 'You cannot delete your own account.',
      }
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true, email: true },
    })

    if (!targetUser) {
      return { success: false, error: 'User not found' }
    }

    if (targetUser.role === 'ADMIN') {
      return {
        success: false,
        error: 'Admin accounts cannot be deleted. Revoke admin privileges first.',
      }
    }

    await prisma.user.delete({ where: { id: targetUserId } })

    revalidatePath('/account/customers')
    return { success: true }
  } catch (error) {
    console.error('deleteUser error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
}
