const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = Array.from({ length: 200000 }).map((_, i) => ({
  title: `Demo Product ${i + 1}`,
  slug: `demo-product-${i + 1}`,
  description: `This is a demo product for testing purposes. Product number ${i + 1}`,
  priceCents: Math.floor(Math.random() * 100000) + 1000, // Random price between 10 and 1000
  category: 'Demo',
  stock: Math.floor(Math.random() * 100) + 1,
  sellerId: '578a8ca1-28b5-4de0-9972-1ece29039771', // Replace with a valid seller ID
}));

async function main() {
  console.log('Start seeding ...');
  for (const p of products) {
    await prisma.product.create({
      data: p,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
