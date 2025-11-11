const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start adding demo product...');

  let seller = await prisma.user.findFirst({
    where: { isSeller: true },
  });

  if (!seller) {
    console.log('No seller found, creating a new one...');
    seller = await prisma.user.create({
      data: {
        name: 'Demo Seller',
        email: 'demoseller@example.com',
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvw.xyz', // Placeholder password
        isSeller: true,
        role: 'seller',
        emailVerified: true,
      },
    });
    console.log(`Created new seller: ${seller.name} (ID: ${seller.id})`);
  } else {
    console.log(`Using existing seller: ${seller.name} (ID: ${seller.id})`);
  }

  const productData = {
    title: 'Demo Product',
    slug: `demo-product-${Date.now()}`,
    description: 'This is a demo product added from a script.',
    priceCents: 1999, // 19.99
    category: 'Demo',
    stock: 100,
    sellerId: seller.id,
    images: {
      create: [
        { url: 'https://picsum.photos/seed/demoproduct/300/300' },
      ],
    },
  };

  const product = await prisma.product.create({
    data: productData,
  });

  console.log(`Created new product: ${product.title} (ID: ${product.id})`);
  console.log('Finished adding demo product.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
