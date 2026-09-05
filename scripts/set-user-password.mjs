/**
 * Set or reset password for any user in the database.
 * Usage: node scripts/set-user-password.mjs <email> <newPassword>
 * Example: node scripts/set-user-password.mjs kiddiesbackup@gmail.com MyPassword123
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)
const prisma = new PrismaClient()

async function hash(password) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scryptAsync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

async function main() {
  const [emailArg, passwordArg] = process.argv.slice(2)

  if (!emailArg || !passwordArg) {
    console.log('Usage: node scripts/set-user-password.mjs <email> <password>')
    process.exit(1)
  }

  const email = emailArg.trim().toLowerCase()
  const password = passwordArg.trim()

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.error(`❌ User with email "${email}" not found.`)
    process.exit(1)
  }

  const passwordHash = await hash(password)

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  })

  console.log(`✅ Successfully updated password for: ${email} (${user.role})`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
