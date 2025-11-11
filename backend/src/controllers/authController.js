const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Generate a unique referral code
const generateReferralCode = async () => {
  let code;
  let isUnique = false;
  while (!isUnique) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const existingUser = await prisma.user.findFirst({ where: { referralCode: code } });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return code;
};

// Generate JWT tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
  
  return { accessToken, refreshToken };
};

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, isSeller } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate referral code
    const referralCode = await generateReferralCode();
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isSeller: isSeller || false,
        role: isSeller ? 'seller' : 'buyer',
        emailVerified: true, // Temporarily set to true
        referralCode,
      }
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    
    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify email with OTP (this function will not be used for now)
const verifyEmail = async (req, res) => {
  res.status(501).json({ message: 'Email verification is temporarily disabled.' });
};


// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // if (!user.emailVerified) { // Temporarily removed
    //   return res.status(401).json({ message: 'Email not verified' });
    // }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    
    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isSeller: true,
        role: true,
        createdAt: true,
        sellerRating: true,
        referralCode: true,
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        isSeller: true,
        role: true,
        createdAt: true
      }
    });
    
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user profile by ID (publicly accessible)
const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: {
          include: {
            images: true,
          },
        },
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert priceCents to price for products
    user.products = user.products.map(product => ({
      ...product,
      price: product.priceCents / 100, // Convert cents to rupees
    }));

    // Remove sensitive info
    const { passwordHash, ...userWithoutSensitiveInfo } = user;

    res.json({ user: userWithoutSensitiveInfo });
  } catch (error) {
    console.error('Get user profile by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
      decoded.role
    );
    
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Validate referral code
const validateReferral = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const user = await prisma.user.findFirst({ where: { referralCode } });
    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Validate referral error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUserProfileById,
  refreshToken,
  verifyEmail,
  validateReferral,
};