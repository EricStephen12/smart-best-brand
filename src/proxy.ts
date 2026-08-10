import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const clerkConfigured =
  Boolean(process.env.CLERK_SECRET_KEY?.trim()) &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim())

/**
 * Next.js 16 uses `proxy.ts` (middleware.ts is deprecated).
 * Never return NextResponse.next() from the Clerk callback — that breaks the
 * auth handshake and can surface as a blank Internal Server Error on Vercel.
 */
const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/account')) {
    await auth.protect()
  }
})

function passthroughProxy(_req: NextRequest) {
  return NextResponse.next()
}

export default clerkConfigured ? clerkProxy : passthroughProxy

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
