
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('Attempting to import PrismaClient...');
    try {
        const prisma = new PrismaClient();
        console.log('PrismaClient instantiated successfully.');
        await prisma.$disconnect();
        console.log('PrismaClient disconnected.');
    } catch (e) {
        console.error('Error instantiating PrismaClient:', e);
        process.exit(1);
    }
}

main();
