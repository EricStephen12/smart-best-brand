import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'sbb_session'

interface SessionPayload {
  sub?: string
  email?: string
  role?: 'ADMIN' | 'CUSTOMER'
  name?: string | null
}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    'smart-best-brands-secret-key-production-change-this'
  return new TextEncoder().encode(secret)
}

async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)
  if (!cookie?.value) return null

  try {
    const { payload } = await jwtVerify(cookie.value, getJwtSecret())
    if (!payload?.sub) return null
    return payload as SessionPayload
  } catch {
    return null
  }
}

const ADMIN_MANAGEMENT_ROUTES = [
  '/account/products',
  '/account/brands',
  '/account/categories',
  '/account/sizes',
  '/account/promotions',
  '/account/delivery-locations',
  '/account/customers',
  '/account/banners',
  '/account/reviews',
  '/account/site',
]

export default async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const session = await getSession(req)
  const authenticated = Boolean(session?.sub)

  // Protect /account routes
  if (pathname.startsWith('/account')) {
    if (!authenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect_url', `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }

    // Protect Admin routes from regular customers
    const isAdminRoute = ADMIN_MANAGEMENT_ROUTES.some((route) => pathname.startsWith(route))
    if (isAdminRoute && session?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/account', req.url))
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
