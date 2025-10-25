const express = require('express');
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All wishlist routes require authentication
router.use(authMiddleware);

router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/', getWishlist);

module.exports = router;