import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

/**
 * Service class for handling image resizing operations
 */
class ImageResizer {
  /**
   * Resize an image to the specified dimensions
   * @param {string} inputPath - Path to the input image
   * @param {string} outputPath - Path where the resized image should be saved
   * @param {number} width - Target width in pixels
   * @param {number} height - Target height in pixels
   * @param {Object} options - Additional options for resizing
   * @returns {Promise<string>} Path to the resized image
   */
  async resizeImage(inputPath, outputPath, width, height, options = {}) {
    try {
      // Validate input parameters
      if (!inputPath || !outputPath || !width || !height) {
        throw new Error('Missing required parameters for image resizing');
      }

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Perform the resize operation
      await sharp(inputPath)
        .resize(width, height, {
          fit: options.fit || 'cover',
          position: options.position || 'center',
          ...options
        })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      throw new Error(`Failed to resize image: ${error.message}`);
    }
  }

  /**
   * Get image metadata
   * @param {string} imagePath - Path to the image
   * @returns {Promise<Object>} Image metadata
   */
  async getImageMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return metadata;
    } catch (error) {
      throw new Error(`Failed to get image metadata: ${error.message}`);
    }
  }
}

export { ImageResizer }; 