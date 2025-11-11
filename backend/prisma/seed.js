const { PrismaClient } = require('@prisma/client');
const { categories } = require('../src/utils/categories');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.image.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Cleared existing users, products, and images.');

  // Generate 20000 sellers and 20000 products
  const batchSize = 50;
  for (let i = 0; i < 20000; i++) {
    // Create a unique seller
    const seller = await prisma.user.create({
      data: {
        name: `Seller ${i + 1}`,
        email: `seller${i + 1}@example.com`,
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvw.xyz', // Replace with a real hashed password
        isSeller: true,
        role: 'seller',
        emailVerified: true,
      },
    });

    // Create a product for the seller
    const categoryIndex = i % categories.length;
    const category = categories[categoryIndex];
    const productNumber = Math.floor(i / categories.length) + 1;

    const productData = {
      title: `${category.name} Product ${productNumber} by Seller ${i + 1}`,
      description: `This is a unique product from seller ${i + 1}.`,
      priceCents: Math.floor(Math.random() * 100000) + 5000,
      discount: Math.floor(Math.random() * 30),
      category: category.name,
      stock: Math.floor(Math.random() * 100) + 1,
      tags: [category.name.toLowerCase(), 'demo', `seller-${i+1}`],
      images: {
        create: [
          { url: `https://picsum.photos/seed/product-${i+1}/300/300` },
        ],
      },
      sellerId: seller.id,
      slug: `${category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-product-${productNumber}-seller-${i+1}`,
    };

    await prisma.product.create({ data: productData });

    if ((i + 1) % batchSize === 0) {
      console.log(`Created batch of ${batchSize} sellers and products (${i + 1}/20000)`);
    }
  }

  console.log(`Seeded 20000 sellers and 20000 products.`);
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