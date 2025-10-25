const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, totalCents, currency = 'INR' } = req.body;
    
    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        items,
        totalCents: parseInt(totalCents),
        currency
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get buyer's orders
const getBuyerOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.json({ orders });
  } catch (error) {
    console.error('Get buyer orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get seller's orders
const getSellerOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // First get products sold by this seller
    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      select: { id: true }
    });
    
    const productIds = products.map(product => product.id);
    
    // Then get orders that contain these products
    // Note: This is a simplified approach. In a real application, you'd have a more complex relationship
    const orders = await prisma.order.findMany({
      where: {
        items: {
          path: '$[*].productId',
          in: productIds
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.json({ orders });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getSellerOrders
};