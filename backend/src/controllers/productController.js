const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all products with filters
const getProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    
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
    
    if (minPrice || maxPrice) {
      where.priceCents = {};
      if (minPrice) where.priceCents.gte = parseInt(minPrice);
      if (maxPrice) where.priceCents.lte = parseInt(maxPrice);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    // Get products
    let products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc'
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

    // Convert priceCents to price (e.g., in rupees)
    products = products.map(product => ({
      ...product,
      price: product.priceCents / 100 // Convert cents to rupees
    }));
    
    // Get total count
    const total = await prisma.product.count({ where });
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get product by slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { slug },
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
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create product (seller only)
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
    
    const { title, description, priceCents, discount, category, stock, tags } = req.body;
    const imageUrls = req.files ? req.files.map(file => ({ url: `/uploads/${file.filename}` })) : [];

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });
    
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this title already exists' });
    }

    if (imageUrls.length < 5) {
      return res.status(400).json({ message: 'Please upload at least 5 images' });
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        title,
        slug,
        description,
        priceCents: parseInt(priceCents),
        discount: discount ? parseInt(discount) : 0,
        category,
        stock: stock ? parseInt(stock) : 0,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
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
    
    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update product (seller only)
const updateProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, description, priceCents, discount, category, stock, tags, imageUrls } = req.body;
    
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
        discount: discount !== undefined ? parseInt(discount) : undefined,
        category,
        stock: stock !== undefined ? parseInt(stock) : undefined,
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
  deleteProduct
};