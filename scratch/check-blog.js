const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.blogPost.findMany();
    console.log('Count:', posts.length);
    for (const p of posts) {
        console.log({ id: p.id, title: p.title, isPublished: p.isPublished, category: p.category });
    }
}

main().finally(() => prisma.$disconnect());
