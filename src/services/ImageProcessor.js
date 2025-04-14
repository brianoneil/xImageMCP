const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');

/**
 * Service class for handling image processing operations
 */
class ImageProcessor {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.outputDirectory - Directory to save processed images
   * @param {string} config.defaultFormat - Default output format
   * @param {number} config.quality - Output quality (1-100)
   * @param {boolean} config.preserveMetadata - Whether to preserve image metadata
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Process an image file
   * @param {string} inputPath - Path to input image
   * @param {Object} options - Processing options
   * @param {string} [options.format] - Output format
   * @param {number} [options.quality] - Output quality
   * @param {number} [options.width] - Target width
   * @param {number} [options.height] - Target height
   * @returns {Promise<string>} Path to processed image
   */
  async processImage(inputPath, options = {}) {
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Apply transformations
      if (options.width || options.height) {
        image.resize(options.width, options.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Set output format and quality
      const format = options.format || this.config.defaultFormat;
      const quality = options.quality || this.config.quality;

      // Configure output based on format
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          image.jpeg({ quality });
          break;
        case 'png':
          image.png({ quality });
          break;
        case 'webp':
          image.webp({ quality });
          break;
        case 'avif':
          image.avif({ quality });
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Handle metadata
      if (!this.config.preserveMetadata) {
        image.withMetadata(false);
      }

      // Generate output path
      const outputPath = this.generateOutputPath(inputPath, format);

      // Ensure output directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Process and save the image
      await image.toFile(outputPath);

      return outputPath;
    } catch (error) {
      throw new Error(`Failed to process image ${inputPath}: ${error.message}`);
    }
  }

  /**
   * Generate output path for processed image
   * @param {string} inputPath - Path to input image
   * @param {string} format - Output format
   * @returns {string} Output path
   * @private
   */
  generateOutputPath(inputPath, format) {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const timestamp = new Date().getTime();
    return path.join(
      this.config.outputDirectory,
      `${filename}_${timestamp}.${format}`
    );
  }

  /**
   * Get image metadata
   * @param {string} inputPath - Path to image
   * @returns {Promise<Object>} Image metadata
   */
  async getMetadata(inputPath) {
    try {
      return await sharp(inputPath).metadata();
    } catch (error) {
      throw new Error(`Failed to get metadata for ${inputPath}: ${error.message}`);
    }
  }
}

module.exports = ImageProcessor; 