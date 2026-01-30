const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const { PrismaClient } = require('@prisma/client');
const { createRedisClient } = require('./config/redis');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined. Please create a .env file and add a JWT_SECRET.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5002; // Changed to 5002 to avoid conflicts

// Initialize Prisma client with optimized connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['warn', 'error'],
});

// Initialize Redis client
let redisClient;
try {
  redisClient = createRedisClient();
  if (redisClient) {
    redisClient.connect().catch(err => {
      console.warn('Redis connection failed (continuing without caching):', err.message);
    });
  } else {
    console.log('Redis is not configured or disabled');
  }
} catch (error) {
  console.warn('Redis initialization failed (continuing without caching):', error.message);
}

// Compression middleware
app.use(compression());

const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:5002', 
  'https://innovative-motivation-hb-kvhjmh.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Increase payload limit for product data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads', { maxAge: '1y' })); // Serve static uploaded files with caching
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'build'), { maxAge: '1y' }));


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce Marketplace API' });
});

// Import route files
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const walletRoutes = require('./routes/walletRoutes'); // Add wallet routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/wallet', walletRoutes); // Add wallet routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check endpoint with database and cache status
app.get('/health/full', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'OK',
    cache: 'DISABLED'
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    healthCheck.database = 'ERROR';
    healthCheck.status = 'ERROR';
  }

  // Check cache connection
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.ping();
      healthCheck.cache = 'CONNECTED';
    } else if (redisClient) {
      healthCheck.cache = 'NOT_CONNECTED';
      healthCheck.status = 'WARNING';
    }
    // If redisClient is null, cache remains 'DISABLED'
  } catch (error) {
    healthCheck.cache = 'ERROR';
    healthCheck.status = 'ERROR';
  }

  const statusCode = healthCheck.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Catch-all route to serve frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html'));
});


// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Full health check: http://localhost:${PORT}/health/full`);
});