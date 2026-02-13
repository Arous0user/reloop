const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let storage;

if (process.env.NODE_ENV === 'production') {
  // Configure S3 client
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Configure multer for S3 storage
  storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uuidv4() + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
  });
} else {
  // Configure multer for local storage
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uuidv4() + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });
}

const upload = multer({
  storage: storage,
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
    
    // Map through the uploaded files and return their URLs
    const imageUrls = req.files.map(file => {
      if (process.env.NODE_ENV === 'production') {
        return file.location;
      } else {
        // Construct the URL for the locally stored file
        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }
    });

    res.json({
      urls: imageUrls // Return an array of URLs
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = {
  upload,
  uploadImage,
};
