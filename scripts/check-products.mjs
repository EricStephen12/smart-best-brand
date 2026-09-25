import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, isActive: true, updatedAt: true }
  })
  console.log('Total products count:', products.length)
  console.log(JSON.stringify(products, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
