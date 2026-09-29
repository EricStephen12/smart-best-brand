const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "testCol" TEXT;`);
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  console.log('✅ findUnique worked perfectly with extra column! SiteName:', settings.siteName);
  await prisma.$executeRawUnsafe(`ALTER TABLE "SiteSettings" DROP COLUMN IF EXISTS "testCol";`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
