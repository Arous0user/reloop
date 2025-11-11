const { PrismaClient } = require('@prisma/client');
const { createRedisClient } = require('../config/redis');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Initialize Redis client for caching
let redisClient;
try {
  redisClient = createRedisClient();
  
  if (redisClient) {
    redisClient.connect().catch(err => {
      console.warn('Redis connection failed in product controller:', err.message);
    });
  }
} catch (error) {
  console.warn('Redis initialization failed in product controller:', error.message);
}

// Get all products with filters and optimized pagination
const getProducts = async (req, res) => {
  try {
    const { 
      q, 
      category, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 24, // Increased default limit for better UX
      sortBy = 'createdAt',
      sortOrder = 'desc',
      sellerId // Add sellerId parameter
    } = req.query;
    
    // Validate and sanitize inputs
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100 items per page
    
    // Build cache key
    const cacheKey = `products:${pageNum}:${limitNum}:${category || 'all'}:${q || 'none'}:${minPrice || 0}:${maxPrice || 'inf'}:${sortBy}:${sortOrder}:${sellerId || 'all'}`;
    
    // Try to get from cache first (if Redis is available)
    if (redisClient && redisClient.isOpen) {
      try {
        const cachedResult = await redisClient.get(cacheKey);
        if (cachedResult) {
          console.log(`Cache HIT for key: ${cacheKey}`);
          return res.json(JSON.parse(cachedResult));
        } else {
          console.log(`Cache MISS for key: ${cacheKey}`);
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError.message);
      }
    }
    
    // Build where clause
    const where = {};
    
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } }
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (sellerId) {
      where.sellerId = sellerId;
    }
    
    if (minPrice || maxPrice) {
      where.priceCents = {};
      if (minPrice) where.priceCents.gte = parseInt(minPrice);
      if (maxPrice) where.priceCents.lte = parseInt(maxPrice);
    }
    
    // Validate sort parameters
    const validSortFields = ['createdAt', 'priceCents', 'title', 'sellerRating'];
    const validSortOrders = ['asc', 'desc'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrderValue = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

    let orderBy;
    if (sortField === 'sellerRating') {
      orderBy = { seller: { sellerRating: 'desc' } };
    } else {
      orderBy = { [sortField]: sortOrderValue };
    }
    
    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Get products with optimized query
    let products = await prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      include: {
        seller: {
          select: {
            id: true,
            name: true
          }
        },
        images: {
          take: 1 // Only get the first image for listing pages
        }
      }
    });

    // Convert priceCents to price
    products = products.map(product => ({
      ...product,
      price: product.priceCents / 100
    }));
    
    // Get total count
    const total = await prisma.product.count({ where });
    
    const result = {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
    
    // Cache the result for 5 minutes (if Redis is available)
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
        console.log(`Cached result for key: ${cacheKey}`);
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError.message);
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get product by slug with caching
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Build cache key
    const cacheKey = `product:${slug}`;
    
    // Try to get from cache first (if Redis is available)
    if (redisClient && redisClient.isOpen) {
      try {
        const cachedProduct = await redisClient.get(cacheKey);
        if (cachedProduct) {
          console.log(`Cache HIT for product: ${slug}`);
          return res.json(JSON.parse(cachedProduct));
        } else {
          console.log(`Cache MISS for product: ${slug}`);
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError.message);
      }
    }
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            sellerRating: true
          }
        },
        images: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Convert priceCents to price
    const productWithPrice = {
      ...product,
      price: product.priceCents / 100
    };
    
    // Cache the result for 10 minutes (if Redis is available)
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify({ product: productWithPrice }));
        console.log(`Cached product: ${slug}`);
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError.message);
      }
    }
    
    res.json({ product: productWithPrice });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create product with optimizations
const createProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if user is seller
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || !user.isSeller) {
      return res.status(403).json({ message: 'Only sellers can create products' });
    }
    
    const { title, description, priceCents, category, tags, stock } = req.body;
    const imageUrls = req.files && req.files.images ? req.files.images.map(file => ({ url: `/uploads/${file.filename}` })) : [];

    const parsedPrice = parseInt(priceCents);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: 'Invalid price' });
    }
    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: 'Invalid stock quantity' });
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug already exists (with retry logic)
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: uniqueSlug }
      });
      
      if (!existingProduct) {
        break;
      }
      
      uniqueSlug = `${slug}-${counter}`;
      counter++;
      
      // Prevent infinite loop
      if (counter > 100) {
        return res.status(400).json({ message: 'Unable to generate unique slug for product' });
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        title,
        slug: uniqueSlug,
        description,
        priceCents: parsedPrice,
        category,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
        stock: parsedStock,
        soldOut: false,
        images: {
          create: imageUrls
        }
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true
      }
    });
    
    // Invalidate cache for products list (if Redis is available)
    if (redisClient && redisClient.isOpen) {
      try {
        // Delete cache keys for product listings (pattern-based invalidation would be better in production)
        const keys = await redisClient.keys('products:*');
        if (keys.length > 0) {
          await redisClient.del(keys);
          console.log(`Invalidated ${keys.length} product listing cache entries`);
        }
      } catch (cacheError) {
        console.warn('Cache invalidation error:', cacheError.message);
      }
    }
    
    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update product (seller only)
const updateProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, description, priceCents, category, tags, imageUrls } = req.body;
    
    // Check if product exists and belongs to user
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.sellerId !== userId) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }
    
    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        priceCents: priceCents ? parseInt(priceCents) : undefined,
        category,
        tags,
        images: imageUrls ? {
          deleteMany: {},
          create: imageUrls.map(url => ({ url }))
        } : undefined
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true
      }
    });
    
    // Invalidate caches (if Redis is available)
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.del(`product:${updatedProduct.slug}`);
        const keys = await redisClient.keys('products:*');
        if (keys.length > 0) {
          await redisClient.del(keys);
          console.log(`Invalidated ${keys.length} product listing cache entries`);
        }
      } catch (cacheError) {
        console.warn('Cache invalidation error:', cacheError.message);
      }
    }
    
    res.json({ product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete product (seller only)
const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    // Check if product exists and belongs to user
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.sellerId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }
    
    // Delete product
    await prisma.product.delete({
      where: { id }
    });
    
    // Invalidate caches (if Redis is available)
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.del(`product:${product.slug}`);
        const keys = await redisClient.keys('products:*');
        if (keys.length > 0) {
          await redisClient.del(keys);
          console.log(`Invalidated ${keys.length} product listing cache entries`);
        }
      } catch (cacheError) {
        console.warn('Cache invalidation error:', cacheError.message);
      }
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  redisClient
};