const express = require('express');
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  redisClient
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const sellerMiddleware = require('../middleware/sellerMiddleware');
const { upload } = require('../controllers/uploadController');

const router = express.Router();

// Custom middleware to handle multer errors
const uploadWithErrorHandler = (req, res, next) => {
  const uploadMiddleware = upload.fields([{ name: 'images', maxCount: 10 }]);

  uploadMiddleware(req, res, (err) => {
    if (err) {
      // Log the full error for debugging
      console.error('Multer error:', err);

      // Send a more specific error message to the client
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
      }
      if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ message: err.message });
      }
      // For other errors, send a generic 500 error
      return res.status(500).json({ message: 'An error occurred during file upload.', error: err.message });
    }
    next();
  });
};


// Public routes
router.get('/', getProducts);

router.get('/:slug', getProductBySlug);

// Protected routes (authentication required)
router.post('/', authMiddleware, sellerMiddleware, uploadWithErrorHandler, createProduct);
router.put('/:id', authMiddleware, sellerMiddleware, updateProduct);
router.delete('/:id', authMiddleware, sellerMiddleware, deleteProduct);

// Clear cache route (for development)
router.get('/clearcache', (req, res) => {
  console.log('Clearing Redis cache...');
  if (redisClient && redisClient.isOpen) {
    redisClient.flushall('ASYNC', () => {
      console.log('Redis cache cleared');
      res.json({ message: 'Redis cache cleared' });
    });
  } else {
    res.status(500).json({ message: 'Redis client not available' });
  }
});

module.exports = router;
