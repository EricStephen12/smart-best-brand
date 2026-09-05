'use server'

import { revalidatePath } from 'next/cache'
import { decodeJwt } from 'jose'
import prisma from '@/lib/prisma'
import { ensureAppUser, type AppUser } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/auth-crypto'
import {
  setSessionCookie,
  deleteSessionCookie,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from '@/lib/auth-session'
import { sendPasswordResetEmail } from '@/lib/sms'

export async function getSession(): Promise<AppUser | null> {
  try {
    return await ensureAppUser()
  } catch (error) {
    console.error('getSession error:', error)
    return null
  }
}

export async function loginAction(formData: {
  email: string
  password: string
}): Promise<{ success: boolean; error?: string; user?: AppUser }> {
  try {
    const email = formData.email?.trim().toLowerCase()
    const password = formData.password

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }

    if (!user.passwordHash) {
      return {
        success: false,
        error: 'This account does not have a password set yet. Please reset your password or sign up.',
      }
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' }
    }

    await setSessionCookie({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    revalidatePath('/account')
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        deliveryAddress: user.deliveryAddress,
        deliveryLocation: user.deliveryLocation,
      },
    }
  } catch (error) {
    console.error('Login action error:', error)
    return { success: false, error: 'An unexpected error occurred during sign in' }
  }
}

export async function registerAction(formData: {
  name?: string
  email: string
  password: string
  phone?: string
}): Promise<{ success: boolean; error?: string; user?: AppUser }> {
  try {
    const email = formData.email?.trim().toLowerCase()
    const name = formData.name?.trim() || null
    const phone = formData.phone?.trim() || null
    const password = formData.password

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // If user exists without password (e.g. created previously via Clerk), set password
      if (!existingUser.passwordHash) {
        const passwordHash = await hashPassword(password)
        const updated = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            passwordHash,
            name: name || existingUser.name,
            phone: phone || existingUser.phone,
          },
        })

        await setSessionCookie({
          id: updated.id,
          email: updated.email,
          role: updated.role,
          name: updated.name,
        })

        revalidatePath('/account')
        return {
          success: true,
          user: {
            id: updated.id,
            email: updated.email,
            role: updated.role,
            name: updated.name,
            phone: updated.phone,
            deliveryAddress: updated.deliveryAddress,
            deliveryLocation: updated.deliveryLocation,
          },
        }
      }

      return { success: false, error: 'An account with this email already exists' }
    }

    const passwordHash = await hashPassword(password)
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        passwordHash,
        role: 'CUSTOMER',
      },
    })

    await setSessionCookie({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    })

    revalidatePath('/account')
    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        phone: newUser.phone,
        deliveryAddress: newUser.deliveryAddress,
        deliveryLocation: newUser.deliveryLocation,
      },
    }
  } catch (error) {
    console.error('Register action error:', error)
    return { success: false, error: 'Failed to create account. Please try again.' }
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  await deleteSessionCookie()
  revalidatePath('/')
  revalidatePath('/account')
  return { success: true }
}

export async function updateProfile(data: {
  name?: string
  phone?: string
  deliveryAddress?: string
  deliveryLocation?: string
}) {
  try {
    const session = await getSession()
    if (!session) {
      console.warn('[AUTH] updateProfile called without session')
      return { success: false, error: 'Not authenticated. Please sign in again.' }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: data.name !== undefined ? (data.name?.trim() || null) : undefined,
        phone: data.phone !== undefined ? (data.phone?.trim() || null) : undefined,
        deliveryAddress: data.deliveryAddress !== undefined ? (data.deliveryAddress?.trim() || null) : undefined,
        deliveryLocation: data.deliveryLocation !== undefined ? (data.deliveryLocation?.trim() || null) : undefined,
      },
    })

    await setSessionCookie({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name,
    })

    revalidatePath('/account')
    revalidatePath('/account/settings')
    return {
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name,
        phone: updatedUser.phone,
        deliveryAddress: updatedUser.deliveryAddress,
        deliveryLocation: updatedUser.deliveryLocation,
      },
    }
  } catch (error) {
    console.error('Profile update error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Update failed'
    return { success: false, error: errorMsg }
  }
}

export async function updatePasswordAction(data: {
  currentPassword?: string
  newPassword: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!data.newPassword || data.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long' }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // If user already has a password, verify current password
    if (user.passwordHash) {
      if (!data.currentPassword) {
        return { success: false, error: 'Current password is required' }
      }
      const isMatch = await verifyPassword(data.currentPassword, user.passwordHash)
      if (!isMatch) {
        return { success: false, error: 'Incorrect current password' }
      }
    }

    const newHash = await hashPassword(data.newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    })

    return { success: true }
  } catch (error) {
    console.error('Password update error:', error)
    return { success: false, error: 'Failed to update password' }
  }
}

/**
 * Initiates password recovery.
 * Generates a signed token and sends an email. Always returns a generic success
 * message to prevent email enumeration attacks.
 */
export async function forgotPasswordAction(email: string): Promise<{ success: boolean; message: string }> {
  const genericMessage = 'If an account exists with this email address, a password reset link has been sent.'
  try {
    const trimmedEmail = email?.trim().toLowerCase()
    if (!trimmedEmail) {
      return { success: false, message: 'Please provide a valid email address' }
    }

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    })

    if (!user) {
      // Return success to avoid email probing
      return { success: true, message: genericMessage }
    }

    const token = await signPasswordResetToken(
      user.id,
      user.email,
      user.passwordHash || 'no-prior-password'
    )

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const resetUrl = `${siteUrl}/reset-password?token=${encodeURIComponent(token)}`

    await sendPasswordResetEmail(user.email, resetUrl)

    return { success: true, message: genericMessage }
  } catch (error) {
    console.error('Forgot password error:', error)
    return { success: true, message: genericMessage }
  }
}

/**
 * Resets the password using a valid reset token.
 */
export async function resetPasswordAction(data: {
  token: string
  newPassword: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.token) {
      return { success: false, error: 'Invalid or missing reset token' }
    }

    if (!data.newPassword || data.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long' }
    }

    // Decode token payload to get userId
    let userId: string | null = null
    try {
      const decoded = decodeJwt(data.token)
      userId = (decoded.sub as string) || null
    } catch {
      return { success: false, error: 'Invalid reset token format' }
    }

    if (!userId) {
      return { success: false, error: 'Invalid reset token' }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const verified = await verifyPasswordResetToken(
      data.token,
      user.passwordHash || 'no-prior-password'
    )

    if (!verified) {
      return {
        success: false,
        error: 'This password reset link has expired or has already been used.',
      }
    }

    const newHash = await hashPassword(data.newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    })

    return { success: true }
  } catch (error) {
    console.error('Reset password action error:', error)
    return { success: false, error: 'Failed to reset password. Please try again.' }
  }
}
