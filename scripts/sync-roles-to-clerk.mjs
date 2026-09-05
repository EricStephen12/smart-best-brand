/**
 * One-time script: copies role from your Prisma DB → Clerk publicMetadata
 * so the new useAuth hook can read it without a DB call.
 *
 * Run once: node scripts/sync-roles-to-clerk.mjs
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const CLERK_SECRET = process.env.CLERK_SECRET_KEY

if (!CLERK_SECRET) {
  console.error('❌  CLERK_SECRET_KEY not set in .env')
  process.exit(1)
}

async function setClerkRole(clerkId, role) {
  const res = await fetch(`https://api.clerk.com/v1/users/${clerkId}/metadata`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${CLERK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ public_metadata: { role } }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Clerk API error for ${clerkId}: ${err}`)
  }
}

async function main() {
  const users = await prisma.user.findMany({
    where: { clerkId: { not: null } },
    select: { id: true, email: true, clerkId: true, role: true },
  })

  console.log(`Found ${users.length} users with Clerk IDs`)

  for (const u of users) {
    try {
      await setClerkRole(u.clerkId, u.role)
      console.log(`✅  ${u.email} → ${u.role}`)
    } catch (e) {
      console.error(`❌  ${u.email}: ${e.message}`)
    }
  }

  console.log('\nDone. Roles are now in Clerk publicMetadata.')
  await prisma.$disconnect()
}

main()
