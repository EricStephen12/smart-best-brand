import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const updated = await prisma.product.updateMany({
    where: { isActive: false },
    data: { isActive: true },
  })
  console.log('Re-activated products:', updated.count)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
