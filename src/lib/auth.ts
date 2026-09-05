import prisma from '@/lib/prisma'
import type { Role, User } from '@prisma/client'
import { getSessionUser } from '@/lib/auth-session'

export interface AppUser {
  id: string
  clerkId?: string | null
  email: string
  role: Role
  name: string | null
  phone?: string | null
  deliveryAddress?: string | null
  deliveryLocation?: string | null
}

function toAppUser(user: User): AppUser {
  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    role: user.role,
    name: user.name,
    phone: user.phone,
    deliveryAddress: user.deliveryAddress,
    deliveryLocation: user.deliveryLocation,
  }
}

/**
 * Returns the current authenticated AppUser from the active session cookie.
 */
export async function ensureAppUser(): Promise<AppUser | null> {
  const sessionUser = await getSessionUser()
  if (!sessionUser?.id) return null

  // Fetch current user details from DB
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  })

  if (!user) return null
  return toAppUser(user)
}

/**
 * Throws an error if no active authenticated session exists.
 */
export async function requireSession(): Promise<AppUser> {
  const session = await ensureAppUser()
  if (!session) {
    throw new Error('Not authenticated')
  }
  return session
}

/**
 * Throws an error if the authenticated user is not an ADMIN.
 */
export async function requireAdmin(): Promise<AppUser> {
  const session = await requireSession()
  if (session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  return session
}
