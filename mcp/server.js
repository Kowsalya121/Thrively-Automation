#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "playwright-mcp",
    version: "1.0.0",
  },
  {
    tools: {
      open_browser: {
        description: "Dummy test tool",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: async () => {
          return {
            content: [{ type: "text", text: "MCP server is working!" }],
          };
        },
      },
    },
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

