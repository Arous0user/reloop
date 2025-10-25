const express = require('express');
const {
  upload,
  uploadImage
} = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware'); // Fixed typo

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, upload.any(), uploadImage);

module.exports = router;