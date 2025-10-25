const express = require('express');
const {
  getAllUsers,
  getAllProducts,
  getAllOrders
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../controllers/adminController');

const router = express.Router();

// Protected admin routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/products', authMiddleware, adminMiddleware, getAllProducts);
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);

module.exports = router;