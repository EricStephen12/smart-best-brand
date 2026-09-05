import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const role = (process.argv[3] || 'ADMIN').toUpperCase()

  if (!email) {
    console.error('Usage: node scripts/set-role.mjs <email> [ADMIN|CUSTOMER]')
    process.exit(1)
  }

  if (role !== 'ADMIN' && role !== 'CUSTOMER') {
    console.error('Role must be either ADMIN or CUSTOMER')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  })

  if (!user) {
    console.error(`User with email "${email}" not found.`)
    process.exit(1)
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role },
  })

  console.log(`Successfully updated ${updated.email} (${updated.name || 'User'}) to role: ${updated.role}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
