#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import server from "./server.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Verification script for Cursor MCP integration
 * 
 * This script helps verify that the MCP server is working correctly with Cursor.
 * It starts the server and keeps it running for a short period to allow Cursor to connect.
 */
async function main() {
  try {
    console.log("Starting xImageMCP verification for Cursor...");
    console.log("This script will run for 30 seconds to allow Cursor to connect.");
    console.log("Please add this server to Cursor in a separate terminal window.");
    console.log("Command to use in Cursor: node " + path.resolve(__dirname, "index.js"));
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('xImageMCP server started successfully');
    console.log('Waiting for Cursor to connect...');
    
    // Keep the server running for 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    console.log('Verification complete. If Cursor shows the server as connected, everything is working correctly.');
    process.exit(0);
  } catch (error) {
    console.error('Error starting MCP server:', error.message);
    process.exit(1);
  }
}

main(); 