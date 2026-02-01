const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const url = "postgresql://postgres.icekkdpxbywgojfpgocf:Xayno5377946@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
    console.log('Attempting to connect to:', url.split('@')[1]);

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    });

    try {
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Success! Raw query result:', result);
        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        process.exit(1);
    }
}

testConnection();
