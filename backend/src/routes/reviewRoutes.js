const express = require('express');
const {
  createClientReview,
  getUserReviews,
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all reviews for a user
router.get('/user/:userId', getUserReviews);

// Create a new review for a user
router.post('/user/:revieweeId', authMiddleware, createClientReview);

module.exports = router;