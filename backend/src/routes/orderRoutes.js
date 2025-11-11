const express = require('express');
const {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  getUserOrders
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getBuyerOrders);
router.get('/seller', authMiddleware, getSellerOrders);
router.get('/user/:userId', authMiddleware, getUserOrders);

module.exports = router;