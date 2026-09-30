require('dotenv').config({ path: '.env.local' });
if (!process.env.DATABASE_URL) {
    require('dotenv').config({ path: '.env' });
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log('Connecting...');
        await prisma.$connect();
        
        console.log('Checking columns of SiteSettings:');
        const cols = await prisma.$queryRawUnsafe(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'SiteSettings'
            ORDER BY ordinal_position
        `);
        console.log('Found columns:', cols.map(c => c.column_name).join(', '));

        console.log('Testing line 254 executeRawUnsafe...');
        await prisma.$executeRawUnsafe(
            `INSERT INTO "SiteSettings" (id) VALUES ('default') ON CONFLICT (id) DO NOTHING`
        );
        console.log('Insert/upsert check OK!');

        console.log('Checking if styleComfortJson column exists:');
        const hasStyleComfort = cols.some(c => c.column_name === 'styleComfortJson');
        console.log('has styleComfortJson?', hasStyleComfort);
        const hasEditorial = cols.some(c => c.column_name === 'editorialJournalJson');
        console.log('has editorialJournalJson?', hasEditorial);
        const hasTicker = cols.some(c => c.column_name === 'tickerLabelsJson');
        console.log('has tickerLabelsJson?', hasTicker);

    } catch (e) {
        console.error('ERROR OCCURRED:', e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
