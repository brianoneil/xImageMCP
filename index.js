#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import server from "./server.js";

/**
 * Main function to start the MCP server
 * This connects to the server using StdioServerTransport
 */
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('xImageMCP server started successfully');
  } catch (error) {
    console.error('Error starting MCP server:', error.message);
    process.exit(1);
  }
}

main(); 