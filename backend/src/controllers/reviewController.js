const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new client review
const createClientReview = async (req, res) => {
  try {
    const { revieweeId } = req.params;
    const { rating, comment } = req.body;
    const reviewerId = req.user.userId;

    const review = await prisma.clientReview.create({
      data: {
        rating: parseInt(rating),
        comment,
        reviewerId,
        revieweeId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update the average rating for the reviewee
    const isSeller = (await prisma.user.findUnique({ where: { id: revieweeId } })).isSeller;
    const ratingType = isSeller ? 'sellerRating' : 'buyerRating';

    const avgRating = await prisma.clientReview.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        revieweeId,
      },
    });

    await prisma.user.update({
      where: { id: revieweeId },
      data: {
        [ratingType]: avgRating._avg.rating,
      },
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('Create client review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all reviews for a user
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.clientReview.findMany({
      where: {
        revieweeId: userId,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createClientReview,
  getUserReviews,
};