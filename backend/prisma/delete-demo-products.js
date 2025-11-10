const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start deleting demo products ...');
  const { count } = await prisma.product.deleteMany({
    where: {
      category: 'Demo',
    },
  });
  console.log(`Deleted ${count} demo products.`);
  console.log('Finished deleting demo products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
