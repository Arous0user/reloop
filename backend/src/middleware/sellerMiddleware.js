const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sellerMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    // Check if user is seller
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || !user.isSeller) {
      return res.status(403).json({ message: 'Access denied. Sellers only.' });
    }
    
    next();
  } catch (error) {
    console.error('Seller middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = sellerMiddleware;