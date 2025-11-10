const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get user's wallet balance
const getWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        walletBalance: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ balance: user.walletBalance });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getWallet
};