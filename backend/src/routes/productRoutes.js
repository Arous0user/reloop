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
const handleMulterError = require('../middleware/errorMiddleware');
const { upload } = require('../controllers/uploadController'); // Removed uploadToGCS

const router = express.Router();

// Public routes
router.get('/', getProducts);

router.get('/:slug', getProductBySlug);

// Protected routes (authentication required)
router.post('/', authMiddleware, sellerMiddleware, upload.fields([{
  name: 'images',
  maxCount: 10
}]), createProduct); // Removed uploadToGCS middleware
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