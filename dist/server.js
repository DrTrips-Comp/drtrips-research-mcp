import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ResearchQuerySchema } from './models/research-models.js';
import { perplexityClient } from './services/perplexity-client.js';
export function createMcpServer() {
    const server = new Server({
        name: 'drtrips-research-mcp',
        version: '1.0.2'
    }, {
        capabilities: {
            tools: {}
        }
    });
    // Register tool listing with enhanced description and annotations
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            {
                name: 'drtrips_research',
                description: `Perform research queries using Perplexity AI with customizable system prompts and response formats.

This tool uses Perplexity AI models via OpenRouter to search the web and provide comprehensive, cited research answers. It supports custom system prompts to tailor research behavior for specific domains (travel, technical research, business analysis, etc.) and offers both human-readable and machine-readable output formats.

Args:
  - query (string, required): The research question or query to search for
    * Must be 2-500 characters
    * Examples: "What are the latest developments in quantum computing?", "Best travel destinations in Southeast Asia for families"

  - systemprompt (string, optional): Custom system prompt to guide research behavior
    * Maximum 2000 characters
    * Example: "You are a travel expert specializing in Southeast Asia. Provide detailed recommendations with practical tips."
    * If not provided, uses default research assistant prompt

  - response_format (string, optional): Output format preference
    * Options: "markdown" (default) or "json"
    * "markdown": Human-readable format with citations and metadata footer
    * "json": Machine-readable structured data suitable for programmatic processing

Returns:
  Object with content[0].text (string) and metadata (object):
  - For MARKDOWN: Main content + citations section + query summary footer
  - For JSON: {"answer": "...", "citations": [...], "model": "...", "usage": {...}, "total_sources": N}
  - metadata: Always includes {query, systemprompt, timestamp, model, finish_reason, usage, citations, total_sources}

Usage Examples:
  - Use when: "Find the latest research on climate change" -> Get current, cited information
  - Use when: Need web-sourced, up-to-date information with citations
  - Don't use when: You need calculations or data transformations
  - Don't use when: You need information from private/internal sources

Error Handling:
  - "Rate limit exceeded (429)": Wait before making another request
  - "Authentication failed (401/403)": Check OPENROUTER_API_KEY environment variable
  - "Request timed out": Try with a simpler, more focused query
  - "Query too short/long": Ensure query is between 2-500 characters

Performance Notes:
  - Responses limited to 25,000 characters to optimize context usage
  - If truncated, refine query to be more specific
  - Average response time: 5-15 seconds depending on query complexity`,
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            minLength: 2,
                            maxLength: 500,
                            description: "The research query or question to search for"
                        },
                        systemprompt: {
                            type: "string",
                            maxLength: 2000,
                            description: "Optional system prompt to customize the research behavior"
                        },
                        response_format: {
                            type: "string",
                            enum: ["markdown", "json"],
                            default: "markdown",
                            description: "Output format: 'markdown' for human-readable or 'json' for machine-readable"
                        }
                    },
                    required: ["query"]
                },
                annotations: {
                    readOnlyHint: true,
                    destructiveHint: false,
                    idempotentHint: true,
                    openWorldHint: true
                }
            }
        ]
    }));
    // Register tool execution handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        if (name !== 'drtrips_research') {
            throw new Error(`Unknown tool: ${name}`);
        }
        try {
            // Validate input using Zod schema
            const params = ResearchQuerySchema.parse(args);
            // Perform research
            const result = await perplexityClient.research(params);
            // Return formatted result with structured metadata (same as before!)
            return {
                content: [{
                        type: 'text',
                        text: result.text
                    }],
                metadata: {
                    query: params.query,
                    systemprompt: params.systemprompt || 'default',
                    timestamp: new Date().toISOString(),
                    model: result.metadata.model,
                    usage: result.metadata.usage,
                    citations: result.metadata.citations,
                    total_sources: result.metadata.total_sources,
                    finish_reason: result.metadata.finish_reason
                }
            };
        }
        catch (error) {
            // Enhanced error handling with actionable messages
            let errorMessage = 'Unknown error occurred';
            let suggestion = '';
            if (error instanceof Error) {
                const message = error.message.toLowerCase();
                if (message.includes('429') || message.includes('rate limit')) {
                    errorMessage = 'Rate limit exceeded';
                    suggestion = '⚠️ Please wait a few seconds before making another request. The API has usage limits to ensure fair access.';
                }
                else if (message.includes('401') || message.includes('403') || message.includes('unauthorized')) {
                    errorMessage = 'Authentication failed';
                    suggestion = '🔑 Please check your OPENROUTER_API_KEY environment variable is set correctly. Get your API key from https://openrouter.ai/keys';
                }
                else if (message.includes('timeout') || message.includes('econnaborted')) {
                    errorMessage = 'Request timed out';
                    suggestion = '⏱️ Try with a simpler, more focused query or try again later. Complex queries may take longer to process.';
                }
                else if (message.includes('network') || message.includes('econnrefused')) {
                    errorMessage = 'Network connection error';
                    suggestion = '🌐 Please check your internet connection and verify that https://openrouter.ai is accessible.';
                }
                else {
                    errorMessage = error.message;
                    suggestion = '💡 Please check your query and try again. If the problem persists, consult the tool documentation.';
                }
            }
            return {
                content: [{
                        type: 'text',
                        text: `❌ **Error: ${errorMessage}**\n\n${suggestion}`
                    }],
                isError: true
            };
        }
    });
    return server;
}
//# sourceMappingURL=server.js.map