const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  verifyEmail,
  getUserProfileById
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/verify-email', verifyEmail);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Public user profile by ID
router.get('/:userId', getUserProfileById);

module.exports = router;