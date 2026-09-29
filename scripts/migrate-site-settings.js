const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding new customization columns to SiteSettings table...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "SiteSettings" 
      ADD COLUMN IF NOT EXISTS "styleComfortJson" TEXT,
      ADD COLUMN IF NOT EXISTS "editorialJournalJson" TEXT,
      ADD COLUMN IF NOT EXISTS "tickerLabelsJson" TEXT,
      ADD COLUMN IF NOT EXISTS "newsletterJson" TEXT,
      ADD COLUMN IF NOT EXISTS "trustBadgesJson" TEXT,
      ADD COLUMN IF NOT EXISTS "navLinksJson" TEXT,
      ADD COLUMN IF NOT EXISTS "footerLinksJson" TEXT;
  `);
  console.log('✅ Columns added successfully to SiteSettings!');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});
