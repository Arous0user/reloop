const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getUserProfileById,
  refreshToken,
  verifyEmail,
  validateReferral,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/:userId', getUserProfileById);
router.post('/refresh-token', refreshToken);
router.post('/verify-email', verifyEmail);
router.post('/validate-referral', validateReferral);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;