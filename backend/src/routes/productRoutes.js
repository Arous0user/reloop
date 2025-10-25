const express = require('express');
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const sellerMiddleware = require('../middleware/sellerMiddleware');
const { upload } = require('../controllers/uploadController'); // Removed uploadToGCS

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Protected routes (authentication required)
router.post('/', authMiddleware, sellerMiddleware, upload.array('images', 5), createProduct); // Removed uploadToGCS middleware
router.put('/:id', authMiddleware, sellerMiddleware, updateProduct);
router.delete('/:id', authMiddleware, sellerMiddleware, deleteProduct);

module.exports = router;