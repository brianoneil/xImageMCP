import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import sharp from "sharp";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";

const server = new McpServer({
  name: "xImageMCP",
  version: "1.0.0"
});

// Helper function to resize image
async function resizeImage(inputPath, scale) {
  const metadata = await sharp(inputPath).metadata();
  const outputPath = path.join(
    path.dirname(inputPath),
    `${path.basename(inputPath, path.extname(inputPath))}_${scale}x${path.extname(inputPath)}`
  );

  await sharp(inputPath)
    .resize({
      width: Math.round(metadata.width * scale),
      height: Math.round(metadata.height * scale),
      fit: 'fill'
    })
    .toFile(outputPath);

  return outputPath;
}

// Tool to resize image to 2x
server.tool(
  "resize2x",
  { 
    imagePath: z.string().describe("Path to the input image file")
  },
  async ({ imagePath }) => {
    try {
      const outputPath = await resizeImage(imagePath, 2);
      return {
        content: [{
          type: "text",
          text: `Image successfully resized to 2x and saved as: ${outputPath}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error resizing image: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Tool to resize image to 3x
server.tool(
  "resize3x",
  { 
    imagePath: z.string().describe("Path to the input image file")
  },
  async ({ imagePath }) => {
    try {
      const outputPath = await resizeImage(imagePath, 3);
      return {
        content: [{
          type: "text",
          text: `Image successfully resized to 3x and saved as: ${outputPath}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error resizing image: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// Resource to get image information
server.resource(
  "image-info",
  new ResourceTemplate("image://{path}", { list: undefined }),
  async (uri, { path }) => {
    try {
      const metadata = await sharp(path).metadata();
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: metadata.size
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Error getting image info: ${error.message}`
        }]
      };
    }
  }
);

export default server; 