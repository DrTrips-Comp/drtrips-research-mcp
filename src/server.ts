import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ResearchQuerySchema } from './models/research-models.js';
import { perplexityClient } from './services/perplexity-client.js';

export function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'drtrips-research-mcp',
      version: '1.0.1'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // Register tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'drtrips_research',
        description: 'Perform research queries using Perplexity AI. Provides comprehensive answers with citations and up-to-date information.',
        inputSchema: zodToJsonSchema(ResearchQuerySchema) as any
      }
    ]
  }));

  // Register tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name !== 'drtrips_research') {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      // Validate input
      const validated = ResearchQuerySchema.parse(args);

      // Perform research
      const result = await perplexityClient.research(validated);

      // Return formatted result with structured metadata
      return {
        content: [{
          type: 'text',
          text: result.text
        }],
        metadata: {
          query: validated.query,
          systemprompt: validated.systemprompt || 'default',
          timestamp: new Date().toISOString(),
          model: result.metadata.model,
          usage: result.metadata.usage,
          citations: result.metadata.citations,
          total_sources: result.metadata.total_sources,
          finish_reason: result.metadata.finish_reason
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{
          type: 'text',
          text: `❌ **Error performing research:**\n${errorMessage}`
        }],
        isError: true
      };
    }
  });

  return server;
}
