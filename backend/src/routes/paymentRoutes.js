// const express = require('express');
// const {
//   createPaymentIntent,
//   createRazorpayOrder,
//   handleWebhook
// } = require('../controllers/paymentController');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// // Protected routes
// router.post('/create', authMiddleware, createPaymentIntent);
// router.post('/razorpay/orders', authMiddleware, createRazorpayOrder);

// // Public webhook route (no auth middleware)
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// module.exports = router;

const express = require('express');
const router = express.Router();
module.exports = router;