import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'sbb_session'

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    'smart-best-brands-secret-key-production-change-this'
  return new TextEncoder().encode(secret)
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)
  if (!cookie?.value) return false

  try {
    const { payload } = await jwtVerify(cookie.value, getJwtSecret())
    return Boolean(payload?.sub)
  } catch {
    return false
  }
}

export default async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const authenticated = await isAuthenticated(req)

  // Protect /account routes
  if (pathname.startsWith('/account')) {
    if (!authenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect_url', `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect authenticated users away from /login and /register
  if (pathname === '/login' || pathname === '/register') {
    if (authenticated) {
      const redirectParam = req.nextUrl.searchParams.get('redirect_url')
      const target = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/account'
      return NextResponse.redirect(new URL(target, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
