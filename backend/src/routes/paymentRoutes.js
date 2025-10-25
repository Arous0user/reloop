const express = require('express');
const {
  createPaymentIntent,
  handleWebhook
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/create', authMiddleware, createPaymentIntent);

// Public webhook route (no auth middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;