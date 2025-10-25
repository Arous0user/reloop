const { PrismaClient } = require('@prisma/client');
const { categories } = require('../src/utils/categories'); // Corrected path

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a default seller user if not exists
  let seller = await prisma.user.findUnique({ where: { email: 'seller@example.com' } });
  if (!seller) {
    seller = await prisma.user.create({
      data: {
        name: 'Demo Seller',
        email: 'seller@example.com',
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvw.xyz', // Replace with a real hashed password
        isSeller: true,
        role: 'seller',
        emailVerified: true,
      },
    });
    console.log('Created demo seller user.');
  }

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('Cleared existing products.');

  const demoProducts = categories.map((category, index) => ({
    title: `${category.name} Demo Product`,
    description: `This is a demo product for the ${category.name} category. It showcases the features of ${category.name} products.`,
    priceCents: (index + 1) * 10000, // Example price
    discount: index * 5, // Example discount
    category: category.name,
    stock: 100,
    tags: [category.name.toLowerCase(), 'demo', 'new'],
    images: {
      create: [{ url: `https://via.placeholder.com/300?text=${category.name.replace(' ', '+')}` }],
    },
    sellerId: seller.id,
    slug: `${category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-demo-product`,
  }));

  for (const productData of demoProducts) {
    await prisma.product.create({ data: productData });
  }

  console.log(`Seeded ${demoProducts.length} demo products.`);
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