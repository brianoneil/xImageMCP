#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Example script demonstrating how to use the xImageMCP server programmatically
 * 
 * Usage: node example.js <image-path>
 */
async function main() {
  try {
    // Get image path from command line arguments
    const imagePath = process.argv[2];
    if (!imagePath) {
      console.error("Please provide an image path as an argument");
      console.error("Usage: node example.js <image-path>");
      process.exit(1);
    }

    // Resolve the absolute path
    const absolutePath = path.resolve(imagePath);
    console.log(`Processing image: ${absolutePath}`);

    // Check if the MCP SDK is installed
    let Client, StdioClientTransport;
    try {
      const clientModule = await import("@modelcontextprotocol/sdk/client/index.js");
      const transportModule = await import("@modelcontextprotocol/sdk/client/stdio.js");
      Client = clientModule.Client;
      StdioClientTransport = transportModule.StdioClientTransport;
      console.log("MCP SDK is installed");
    } catch (error) {
      console.error("MCP SDK is not installed or there's an issue with it:", error.message);
      console.error("Please run 'npm install' to install all dependencies");
      process.exit(1);
    }

    // Connect to the MCP server
    const transport = new StdioClientTransport({
      command: "node",
      args: [path.join(__dirname, "index.js")]
    });
    
    const client = new Client({
      name: "ximagemcp-example",
      version: "1.0.0"
    });
    
    await client.connect(transport);
    console.log("Connected to MCP server");

    // Get image information
    console.log("Getting image information...");
    const info = await client.readResource({
      uri: `image://${absolutePath}`
    });
    
    console.log("Image info:", info.contents[0].text);

    // Resize to 2x
    console.log("Resizing image to 2x...");
    const result2x = await client.callTool({
      name: "resize2x",
      arguments: {
        imagePath: absolutePath
      }
    });
    
    console.log("2x resize result:", result2x.content[0].text);

    // Resize to 3x
    console.log("Resizing image to 3x...");
    const result3x = await client.callTool({
      name: "resize3x",
      arguments: {
        imagePath: absolutePath
      }
    });
    
    console.log("3x resize result:", result3x.content[0].text);

    console.log("Example completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Example failed:", error);
    process.exit(1);
  }
}

main(); 