import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const SESSION_COOKIE_NAME = 'sbb_session'

export interface SessionUser {
  id: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  name: string | null
}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    'smart-best-brands-secret-key-production-change-this'
  return new TextEncoder().encode(secret)
}

/**
 * Signs a JWT session token valid for 30 days.
 */
export async function signSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getJwtSecret())
}

/**
 * Verifies a JWT session token and returns the user payload, or null if invalid/expired.
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    if (!payload.sub || !payload.email || !payload.role) {
      return null
    }
    return {
      id: payload.sub as string,
      email: payload.email as string,
      role: payload.role as 'ADMIN' | 'CUSTOMER',
      name: (payload.name as string) || null,
    }
  } catch {
    return null
  }
}

/**
 * Sets the httpOnly session cookie in the current response.
 */
export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await signSessionToken(user)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

/**
 * Reads and verifies the current session user from the incoming request cookies.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    if (!sessionCookie?.value) return null
    return await verifySessionToken(sessionCookie.value)
  } catch {
    return null
  }
}

/**
 * Clears the session cookie to log out.
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Signs a password reset token valid for 1 hour.
 * Uses the user's current passwordHash as part of the signing key,
 * which ensures the token is automatically revoked as soon as the password is reset.
 */
export async function signPasswordResetToken(
  userId: string,
  email: string,
  currentPasswordHash: string
): Promise<string> {
  const resetSecret = new TextEncoder().encode(
    (process.env.AUTH_SECRET || 'sbb-reset-secret') + ':' + currentPasswordHash
  )
  return new SignJWT({
    sub: userId,
    email: email.toLowerCase(),
    purpose: 'password-reset',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(resetSecret)
}

/**
 * Verifies a password reset token against the user's passwordHash.
 */
export async function verifyPasswordResetToken(
  token: string,
  currentPasswordHash: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const resetSecret = new TextEncoder().encode(
      (process.env.AUTH_SECRET || 'sbb-reset-secret') + ':' + currentPasswordHash
    )
    const { payload } = await jwtVerify(token, resetSecret)
    if (payload.purpose !== 'password-reset' || !payload.sub || !payload.email) {
      return null
    }
    return {
      userId: payload.sub as string,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}
