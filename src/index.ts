import { MCPServer, Tool, Resource } from '@modelcontextprotocol/sdk';
import { ConfigManager } from './services/ConfigManager.js';
import { Logger, LogLevel } from './services/Logger.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Initialize services
const configManager = new ConfigManager();
const logger = new Logger(configManager.getLogPath(), configManager.getLogLevel() as LogLevel);

// Create MCP server
const server = new MCPServer({
  name: 'image-resizer-cli',
  version: '1.0.0',
  description: 'A CLI tool for resizing images using MCP',
});

// Register tools
server.registerTool(
  new Tool({
    name: 'resize2x',
    description: 'Resize an image to 2x its original size',
    parameters: {
      type: 'object',
      properties: {
        imagePath: {
          type: 'string',
          description: 'Path to the input image file',
        },
      },
      required: ['imagePath'],
    },
    handler: async (params: Record<string, any>) => {
      const { imagePath } = params;
      try {
        logger.info('Resizing image to 2x', { imagePath });
        
        const metadata = await sharp(imagePath).metadata();
        const outputPath = path.join(
          path.dirname(imagePath),
          `${path.basename(imagePath, path.extname(imagePath))}_2x${path.extname(imagePath)}`
        );
        
        await sharp(imagePath)
          .resize({
            width: Math.round(metadata.width! * 2),
            height: Math.round(metadata.height! * 2),
          })
          .toFile(outputPath);
        
        logger.info('Image resized successfully', { outputPath });
        return outputPath;
      } catch (error) {
        logger.error('Error resizing image', { error, imagePath });
        throw error;
      }
    },
  })
);

server.registerTool(
  new Tool({
    name: 'resize3x',
    description: 'Resize an image to 3x its original size',
    parameters: {
      type: 'object',
      properties: {
        imagePath: {
          type: 'string',
          description: 'Path to the input image file',
        },
      },
      required: ['imagePath'],
    },
    handler: async (params: Record<string, any>) => {
      const { imagePath } = params;
      try {
        logger.info('Resizing image to 3x', { imagePath });
        
        const metadata = await sharp(imagePath).metadata();
        const outputPath = path.join(
          path.dirname(imagePath),
          `${path.basename(imagePath, path.extname(imagePath))}_3x${path.extname(imagePath)}`
        );
        
        await sharp(imagePath)
          .resize({
            width: Math.round(metadata.width! * 3),
            height: Math.round(metadata.height! * 3),
          })
          .toFile(outputPath);
        
        logger.info('Image resized successfully', { outputPath });
        return outputPath;
      } catch (error) {
        logger.error('Error resizing image', { error, imagePath });
        throw error;
      }
    },
  })
);

// Register resources
server.registerResource(
  new Resource({
    name: 'image-info',
    description: 'Get metadata about an image',
    uriPattern: 'image://{path}',
    handler: async (params: Record<string, any>) => {
      const { path: imagePath } = params;
      try {
        logger.info('Getting image info', { imagePath });
        
        const metadata = await sharp(imagePath).metadata();
        const stats = await fs.stat(imagePath);
        
        const info = {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: stats.size,
        };
        
        logger.info('Image info retrieved successfully', { info });
        return info;
      } catch (error) {
        logger.error('Error getting image info', { error, path: imagePath });
        throw error;
      }
    },
  })
);

// Start the server
server.start().then(() => {
  logger.info('MCP server started successfully');
}).catch((error: Error) => {
  logger.error('Failed to start MCP server', { error });
  process.exit(1);
});