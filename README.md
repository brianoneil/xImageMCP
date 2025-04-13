# ximagemcp

An MCP server for resizing images to 2x and 3x their original size.

## Installation

You can run this package directly using npx:

```bash
npx ximagemcp
```

Or install it globally:

```bash
npm install -g ximagemcp
```

## Usage

This package provides an MCP server with the following capabilities:

### Tools

1. `resize2x`: Resizes an image to 2x its original size
   - Input: `imagePath` (string) - Path to the input image file
   - Output: Path to the resized image

2. `resize3x`: Resizes an image to 3x its original size
   - Input: `imagePath` (string) - Path to the input image file
   - Output: Path to the resized image

### Resources

1. `image-info`: Get metadata about an image
   - URI format: `image://{path}`
   - Returns: Image metadata (width, height, format, size)

## Example

Using an MCP client:

```javascript
// Resize an image to 2x
const result = await client.callTool({
  name: "resize2x",
  arguments: {
    imagePath: "/path/to/image.jpg"
  }
});

// Get image information
const info = await client.readResource({
  uri: "image:///path/to/image.jpg"
});
```

## Requirements

- Node.js >= 14.0.0
- An MCP client to interact with the server

## License

ISC 