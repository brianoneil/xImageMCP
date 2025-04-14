#!/usr/bin/env node

/**
 * xImageMCP CLI Entry Point
 * This script serves as the main entry point for the xImageMCP CLI tool.
 * It handles starting the server and proper error handling.
 */

const { startServer } = require('../server');

async function main() {
  try {
    await startServer();
  } catch (error) {
    console.error('Error starting xImageMCP server:', error.message);
    process.exit(1);
  }
}

main(); 