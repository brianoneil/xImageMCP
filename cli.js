#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import server from "./server.js";

// Ensure the script is executable
try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (error) {
  console.error('Error starting MCP server:', error.message);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const yargs = require('yargs');

const argv = yargs
    .usage('Usage: $0 --input <inputPath> --output <outputDir>')
    .demandOption(['input', 'output'])
    .describe('input', 'Path to the original image')
    .describe('output', 'Directory to save resized images')
    .help('h')
    .alias('h', 'help')
    .argv;

const inputPath = path.resolve(argv.input);
const outputDir = path.resolve(argv.output);
const baseName = path.basename(inputPath, path.extname(inputPath));

sharp(inputPath)
    .metadata()
    .then(metadata => {
        const width = metadata.width;
        const resizeAndSave = (scale) => {
            const newWidth = Math.round(width * scale);
            const outputPath = path.join(outputDir, `${baseName}@${scale}x.png`);
            return sharp(inputPath)
                .resize({ width: newWidth })
                .toFile(outputPath)
                .then(() => {
                    console.log(`Created: ${outputPath}`);
                });
        };

        return Promise.all([resizeAndSave(2), resizeAndSave(3)]);
    })
    .catch(err => {
        console.error('Error processing image:', err);
    });