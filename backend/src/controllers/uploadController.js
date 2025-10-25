const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configure multer for S3 storage
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:\\Users\\flyin\\Desktop\\WEBSITE\\backend\\uploads'); // Absolute path for uploads
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uuidv4() + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload image endpoint
const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) { // Check for req.files (array)
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    // Map through the uploaded files and return their local paths
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

    res.json({
      urls: imageUrls // Return an array of local paths
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};



module.exports = {
  upload, // Export the multer instance directly
  uploadImage,
  uploadImage
};