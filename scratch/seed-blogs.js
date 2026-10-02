const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.blogPost.count();
    if (existing > 0) {
        console.log(`Database already has ${existing} blog posts.`);
        return;
    }

    const posts = [
        {
            title: 'How to Choose the Right Orthopedic Mattress for Back Pain in Nigeria',
            slug: 'how-to-choose-orthopedic-mattress-back-pain',
            category: 'Mattress Guide',
            readTime: '5 min read',
            authorName: 'Smart Best Brands Editorial',
            isPublished: true,
            coverImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop',
            excerpt: 'Understanding the difference between high-density, semi-orthopedic, and full orthopedic foam to eliminate morning back stiffness and guarantee proper spinal alignment.',
            content: `# The Secret to Waking Up Pain-Free Every Morning

Back discomfort and morning spinal stiffness are among the most frequent complaints we hear from bedroom owners across Nigeria. Often, the issue isn't posture during the day—it is sleeping on a worn-out, unsupportive, or improperly density-rated mattress at night.

When your mattress sags even by two inches, your spine is forced into an unnatural curved alignment for six to eight hours continuous. Over months, this causes muscular compensation, lower back soreness, and restless sleep cycles.

## 1. High Density vs. Semi-Orthopedic vs. Full Orthopedic

Many buyers are confused by mattress terminology. Here is how they actually differ:

- **Semi-Orthopedic Foam**: Engineered with balanced resilience. It offers firm support beneath your heavier pressure zones (hips and shoulders) while providing enough surface give for side and back sleepers. Ideal for adults up to 85kg seeking firmer support without feeling rigid.
- **Full Orthopedic Core**: Constructed with ultra-high compression ratings. Recommended by orthopedic physiotherapists for individuals managing chronic lower lumbar distress or those requiring zero sinkage.
- **High-Density Rebonded Foam**: Built for maximum longevity and heavier body weights (90kg+). It resists permanent body impressions and maintains structural firmness year after year.

## 2. The Weight Factor in Choosing Mattress Firmness

Never purchase a mattress solely based on how it feels when pressing it with your hand. Body weight dynamically compresses foam cells:

- Under 70kg: Medium to Medium-Firm support is optimal.
- 70kg to 95kg: Firm or Semi-Orthopedic provides balanced spinal neutralization.
- Above 95kg: Heavy-duty Orthopedic or Rebonded core ensures your pelvis does not sink below shoulder level.

## 3. How to Verify Authenticity

Counterfeit foams are widespread in open markets. Genuine Mouka, Vitafoam, and Royal Foam mattresses carry verified warranty seals, embossed brand tape, and certified factory batch codes. At Smart Best Brands, every single piece is direct from authorized manufacturers with guaranteed warranties.

> "A mattress is an investment in your waking productivity, physical wellness, and mental clarity. Never compromise on spinal support."`,
        },
        {
            title: '5 Proven Habits to Extend Your Mattress Lifespan in Nigerian Climate',
            slug: 'extend-mattress-lifespan-nigerian-climate',
            category: 'Materials & Care',
            readTime: '4 min read',
            authorName: 'Smart Best Brands Editorial',
            isPublished: true,
            coverImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?q=80&w=1200&auto=format&fit=crop',
            excerpt: 'Simple maintenance rituals, rotation schedules, and moisture control habits to protect your mattress warranty and prevent premature sagging.',
            content: `# Protecting Your Sleep Investment in Tropical Conditions

A premium mattress is built to last 7 to 10 years, but tropical humidity, dust accumulation, and improper bed bases can reduce that lifespan by half if basic maintenance is neglected.

Here are five essential care habits recommended by our sleep experts:

## 1. Rotate 180 Degrees Every 3 Months

Your body naturally puts pressure on the exact same zones every night. Rotating your mattress head-to-toe four times a year distributes wear evenly across the foam structure, preventing depressions and indentations from forming.

## 2. Invest in a Waterproof, Breathable Mattress Protector

Spills, natural perspiration, and dust mites degrade polyurethane foam cells over time. A fitted waterproof yet breathable terry-cotton or bamboo protector stops moisture before it penetrates the core, protecting both hygiene and manufacturer warranty validity.

## 3. Check Your Bed Frame Base Slat Spacing

A sagging bed base causes a sagging mattress. If you use a wooden slatted frame:

- Slats should be spaced no more than 2.5 to 3 inches apart.
- A center support beam is mandatory for Queen and King sizes (6x6 and 6x7).
- Avoid placing mattresses on uneven or broken wooden planks.

## 4. Let Your Bed Breathe Weekly

Every time you change your bedsheets, leave the bare mattress exposed to ambient room air with the windows open or ceiling fan running for 30 to 60 minutes. This evaporates trapped humidity and keeps fabric fibers fresh.

> "Proper ventilation and a solid base ensure your mattress feels as supportive on year five as it did on day one."`,
        },
    ];

    for (const post of posts) {
        await prisma.blogPost.create({ data: post });
        console.log(`Created article: ${post.title}`);
    }

    console.log('Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
