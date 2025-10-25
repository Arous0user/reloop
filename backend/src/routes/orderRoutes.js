const express = require('express');
const {
  createOrder,
  getBuyerOrders,
  getSellerOrders
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getBuyerOrders);
router.get('/seller', authMiddleware, getSellerOrders);

module.exports = router;