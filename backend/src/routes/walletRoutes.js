const express = require('express');
const { getWallet } = require('../controllers/walletController');

const router = express.Router();

// Public routes
router.get('/:userId', getWallet);

module.exports = router;