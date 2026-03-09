const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

/**
 * Configure Cloudinary with credentials from environment variables
 * @requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {Object} fileBuffer - Buffer object from multer (req.file)
 * @param {string} folder - Cloudinary folder name (default: 'dynamic-forms')
 * @param {string} resourceType - Type of resource: 'auto', 'image', 'video', 'raw' (default: 'auto')
 * @returns {Promise<Object>} Upload result with secure_url and public_id
 * @example
 * const result = await uploadToCloudinary(req.file.buffer, 'forms', 'image');
 * console.log(result.secure_url); // https://res.cloudinary.com/...
 */
const uploadToCloudinary = (fileBuffer, folder = 'dynamic-forms', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    // Validate input
    if (!fileBuffer) {
      reject(new Error('File buffer is required'));
      return;
    }

    // Create upload stream to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder, // Organize uploads into folders
        resource_type: resourceType, // auto-detect or specify type
        max_file_size: 104857600, // 100MB limit
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Upload failed: ${error.message}`));
          return;
        }
        resolve({
          success: true,
          url: result.secure_url, // HTTPS URL
          publicId: result.public_id, // For deletion later
          fileType: result.resource_type,
          size: result.bytes,
        });
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @param {string} resourceType - Type of resource: 'image', 'video', 'raw' (default: 'image')
 * @returns {Promise<Object>} Deletion result
 * @example
 * await deleteFromCloudinary('dynamic-forms/abc123', 'image');
 */
const deleteFromCloudinary = (publicId, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      reject(new Error('Public ID is required for deletion'));
      return;
    }

    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) {
        console.error('Cloudinary deletion error:', error);
        reject(new Error(`Deletion failed: ${error.message}`));
        return;
      }
      resolve({
        success: true,
        message: 'File deleted successfully',
        result: result,
      });
    });
  });
};

/**
 * Get resource info from Cloudinary
 * @param {string} publicId - Public ID of the resource
 * @returns {Promise<Object>} Resource metadata
 * @example
 * const info = await getResourceInfo('dynamic-forms/abc123');
 */
const getResourceInfo = (publicId) => {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      reject(new Error('Public ID is required'));
      return;
    }

    cloudinary.api.resource(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary resource error:', error);
        reject(new Error(`Failed to get resource info: ${error.message}`));
        return;
      }
      resolve(result);
    });
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getResourceInfo,
  cloudinary, // Export cloudinary instance for advanced usage
};
