const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new order
const createOrder = async (req, res) => {
  const { items, totalCents, currency, referredBy } = req.body;
  const buyerId = req.user.userId;

  try {
    const order = await prisma.$transaction(async (prisma) => {
      const orderItems = JSON.parse(items); // Assuming items is a JSON string

      for (const item of orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.title}. Only ${product.stock} left.`);
        }

        const newStock = product.stock - item.quantity;
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: newStock,
            soldOut: newStock === 0,
          },
        });
      }

      return prisma.order.create({
        data: {
          buyerId,
          items,
          totalCents,
          currency,
          referredBy,
          status: 'PAID', // Assuming payment is successful at this point
        },
      });
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(400).json({ message: error.message || 'Failed to create order.' });
  }
};

// Get buyer's orders
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders.' });
  }
};

// Get seller's orders
const getSellerOrders = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.user.id },
      select: { id: true },
    });
    const productIds = products.map(p => p.id);

    const orders = await prisma.order.findMany({
      where: {
        items: {
          path: '$[*].productId',
          array_contains: productIds,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders.' });
  }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await prisma.order.findMany({
            where: {
                buyerId: userId,
            },
            include: {
                buyer: true,
            },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getUserOrders
};