#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './server.js';
import { OPENROUTER_API_KEY, MODEL_USE } from './config/settings.js';
/**
 * Main entry point for DrTrips Research MCP server
 * Uses Perplexity API directly for research queries
 */
async function runServer() {
    try {
        // Validate API key
        if (!OPENROUTER_API_KEY) {
            console.error('❌ Fatal Error: OPENROUTER_API_KEY not set');
            console.error('Please set it in your .env file or environment variables');
            process.exit(1);
        }
        // Create the MCP server
        const server = createMcpServer();
        // Create stdio transport
        const transport = new StdioServerTransport();
        // Connect server to transport
        await server.connect(transport);
        console.error('✅ DrTrips Research MCP Server running on stdio');
        console.error(`🔍 Using Perplexity API directly (model: ${MODEL_USE})`);
        console.error('📚 Tool: drtrips_research');
    }
    catch (error) {
        console.error('❌ Fatal error running server:', error);
        process.exit(1);
    }
}
// Start the server
runServer().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map