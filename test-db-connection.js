require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Missing ✗');
    console.log('Connection string preview:', process.env.DATABASE_URL?.substring(0, 50) + '...');

    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        console.log('\n✅ SUCCESS! Database connected successfully!');
        await prisma.$disconnect();
    } catch (error) {
        console.log('\n❌ CONNECTION FAILED!');
        console.log('Error:', error.message);
        console.log('\nThis means your password is incorrect or the database is paused.');
        process.exit(1);
    }
}

testConnection();
