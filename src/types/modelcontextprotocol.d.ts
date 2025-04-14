declare module '@modelcontextprotocol/sdk' {
  export class MCPServer {
    constructor(options: { name: string; version: string; description: string });

    registerTool(tool: Tool): void;
    registerResource(resource: Resource): void;
    start(): Promise<void>;
  }

  export class Tool {
    constructor(options: {
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<
          string,
          {
            type: string;
            description: string;
          }
        >;
        required: string[];
      };
      handler: (params: Record<string, any>) => Promise<any>;
    });
  }

  export class Resource {
    constructor(options: {
      name: string;
      description: string;
      uriPattern: string;
      handler: (params: Record<string, any>) => Promise<any>;
    });
  }
}
