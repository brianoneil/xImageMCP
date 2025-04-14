# Image Resizer CLI

A command-line tool for resizing images using the Model Context Protocol (MCP).

## Features

- Resize images to 2x and 3x sizes
- Retrieve image information
- Asynchronous processing
- Comprehensive logging
- Configuration management

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Running

```bash
npm start
```

## Development

```bash
npm run dev
```

## Project Structure

- `src/` - Source code
  - `services/` - Service modules
    - `ConfigManager.js` - Configuration management
    - `Logger.js` - Logging service
  - `index.ts` - Main application entry point

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK
- `sharp` - Image processing
- `zod` - Schema validation

## License

ISC 