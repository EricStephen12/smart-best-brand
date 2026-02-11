const { PrismaClient } = require('@prisma/client');

async function testVariant(name, url) {
    console.log(`\nTesting Variant: ${name}`);
    const prisma = new PrismaClient({
        datasources: { db: { url } },
        log: ['error']
    });

    try {
        const start = Date.now();
        await prisma.$connect();
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log(`✅ SUCCESS [${Date.now() - start}ms]`);
        await prisma.$disconnect();
        return true;
    } catch (error) {
        console.log(`❌ FAILED: ${error.message.split('\n')[0]}`);
        return false;
    }
}

async function runTests() {
    const host = "aws-1-eu-west-2.pooler.supabase.com";
    const user = "postgres.icekkdpxbywgojfpgocf";
    const passUpper = "Xayno5377946";
    const passLower = "xayno5377946";

    const variants = [
        { name: "6543 (Pooled) + Capital X", url: `postgresql://${user}:${passUpper}@${host}:6543/postgres?pgbouncer=true&connect_timeout=10` },
        { name: "6543 (Pooled) + Lowercase x", url: `postgresql://${user}:${passLower}@${host}:6543/postgres?pgbouncer=true&connect_timeout=10` },
        { name: "5432 (Direct) + Capital X", url: `postgresql://${user}:${passUpper}@${host}:5432/postgres?connect_timeout=10` },
        { name: "5432 (Direct) + Lowercase x", url: `postgresql://${user}:${passLower}@${host}:5432/postgres?connect_timeout=10` }
    ];

    for (const v of variants) {
        if (await testVariant(v.name, v.url)) {
            console.log(`\nFound working configuration! Use ${v.name}`);
            process.exit(0);
        }
    }

    console.log('\nAll variants failed. Please double check the Supabase dashboard for the correct password and host.');
    process.exit(1);
}

runTests();
