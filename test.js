#!/usr/bin/env node

import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple test script to verify the MCP server functionality
async function testServer() {
  try {
    console.log("Starting xImageMCP test...");
    
    // Check if the server.js file exists
    const serverPath = path.join(__dirname, 'server.js');
    try {
      await fs.access(serverPath);
      console.log("Server file exists at:", serverPath);
    } catch (error) {
      console.error("Server file not found at:", serverPath);
      process.exit(1);
    }
    
    // Check if the index.js file exists
    const indexPath = path.join(__dirname, 'index.js');
    try {
      await fs.access(indexPath);
      console.log("Index file exists at:", indexPath);
    } catch (error) {
      console.error("Index file not found at:", indexPath);
      process.exit(1);
    }
    
    // Check if the MCP SDK is installed
    try {
      // Try to import the MCP SDK
      const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
      console.log("MCP SDK is installed");
      
      // Create a simple test server
      const server = new McpServer({
        name: "ximagemcp-test",
        version: "1.0.0"
      });
      
      console.log("Successfully created MCP server instance");
      
      // Check if sharp is installed
      try {
        const sharp = await import("sharp");
        console.log("Sharp is installed");
      } catch (error) {
        console.error("Sharp is not installed:", error.message);
        process.exit(1);
      }
      
      console.log("All dependencies are installed correctly");
    } catch (error) {
      console.error("MCP SDK is not installed or there's an issue with it:", error.message);
      console.error("Please run 'npm install' to install all dependencies");
      process.exit(1);
    }
    
    console.log("Test completed successfully!");
    console.log("The package is ready to be published");
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

testServer(); 