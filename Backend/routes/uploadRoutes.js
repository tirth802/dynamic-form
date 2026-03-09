const express = require('express');
const multer = require('multer');
const { uploadToCloudinary } = require('../lib/cloudinary');

const router = express.Router();

/**
 * Configure multer to store files in memory
 * (We upload directly to Cloudinary, so no disk storage needed)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 104857600, // 100MB max
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }
  },
});

/**
 * POST /api/uploads
 * Upload a single file to Cloudinary
 *
 * @param {File} file - File from form data (multipart/form-data)
 * @returns {Object} { success: true, url: "https://...", publicId: "...", ... }
 *
 * @example
 * curl -X POST http://localhost:5000/api/uploads \
 *   -F "file=@/path/to/image.jpg"
 */
// Use custom wrapper so multer errors (file size, invalid mimetype) can be caught
router.post('/', (req, res) => {
  console.log('[UPLOAD] POST /api/uploads received');
  console.log('[UPLOAD] Cloudinary config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
  });
  
  // Accept any file field name to avoid "Field name missing" errors from clients
  upload.any()(req, res, async (err) => {
    if (err) {
      console.error('[UPLOAD] Multer error:', err && err.message ? err.message : err);
      // Handle specific "Field name missing" error with helpful message
      if (err && err.message && err.message.includes('Field name missing')) {
        return res.status(400).json({
          success: false,
          message: 'Field name missing - In Postman, set a KEY NAME (e.g., "file") in form-data, then choose File type, then select your PDF. Example: Key="file", Type="File", Value="Tirth_Savalita_Resume.pdf"'
        });
      }
      return res.status(400).json({ success: false, message: err && err.message ? err.message : 'File upload error' });
    }

    try {
      // multer puts single files on req.file when using .single, and on req.files when using .any()
      const file = req.file || (Array.isArray(req.files) && req.files.length ? req.files[0] : null);
      if (!file) {
        console.error('[UPLOAD] No file provided in request (form-data key missing or wrong)');
        return res.status(400).json({
          success: false,
          message: 'No file provided. Use form-data and set the file field (key) to "file" or any file field.',
        });
      }

      console.log('[UPLOAD] File received:', {
        name: file.originalname,
        mime: file.mimetype,
        size: file.size,
        encoding: file.encoding,
      });

      // Determine resource type based on file mimetype
      let resourceType = 'auto';
      if (file.mimetype && file.mimetype.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.mimetype && file.mimetype.startsWith('video/')) {
        resourceType = 'video';
      } else if (file.mimetype === 'application/pdf') {
        resourceType = 'raw';
      }

      console.log('[UPLOAD] Resource type determined:', resourceType);

      // Upload to Cloudinary
      console.log('[UPLOAD] Uploading to Cloudinary...');
      const result = await uploadToCloudinary(
        file.buffer,
        'dynamic-forms',
        resourceType
      );

      console.log('[UPLOAD] Upload successful:', { url: result.url, publicId: result.publicId });

      // Success response
      res.status(200).json({
        success: true,
        data: result,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('[UPLOAD] Error caught in try-catch:', {
        message: error && error.message,
        name: error && error.name,
        stack: error && error.stack,
      });
      res.status(500).json({
        success: false,
        message: error && error.message ? error.message : 'Upload failed',
        details: error && error.name,
      });
    }
  });
});

/**
 * Error handler for multer
 */
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 100MB limit',
      });
    }
  }
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
});

module.exports = router
