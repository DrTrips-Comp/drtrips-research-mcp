# DrTrips Research MCP

A TypeScript-based MCP (Model Context Protocol) server for research using Perplexity AI API directly.

## Features

- **Direct Perplexity API Integration** - Uses `api.perplexity.ai` (not OpenRouter)
- **Customizable System Prompts** - Control research behavior with custom prompts
- **Model Configuration via Environment** - Set model in `.env` file
- **Citations Support** - Automatic citation extraction and formatting
- **Token Usage Tracking** - Monitor API usage with detailed metrics

## Installation

```bash
cd drtrips_research_mcp
npm install
```

## Configuration

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Configure your settings:
```env
PERPLEXITY_API_KEY=your_perplexity_api_key_here
MODEL_USE=sonar-pro
```

### Available Models

- `sonar-pro` (default) - Fast, accurate responses
- `sonar-deep-research` - Deep research with comprehensive analysis
- `sonar-reasoning-pro` - Advanced reasoning capabilities

Get your API key from: https://www.perplexity.ai/settings/api

## Usage

### Development

```bash
# Run in development mode
npm run dev

# Watch mode
npm run watch
```

### Production

```bash
# Build the project
npm run build

# Run the server
npm start
```

### With Claude Desktop

Add to your `claude_desktop_config.json`:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "drtrips-research": {
      "command": "node",
      "args": ["D:/lanflow-reccomendation/app/mcp/research_mcp/drtrips_research_mcp/dist/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your_api_key_here",
        "MODEL_USE": "sonar-pro"
      }
    }
  }
}
```

## Tool: drtrips_research

Perform research queries using Perplexity AI with customizable system prompts.

### Parameters

- **query** (required): The research question or query
- **systemprompt** (optional): Custom system prompt to guide the research

### Example Usage

**Basic Query:**
```json
{
  "query": "What are the latest developments in quantum computing?"
}
```

**With Custom System Prompt:**
```json
{
  "query": "What are the best travel destinations in Southeast Asia?",
  "systemprompt": "You are a travel expert specializing in Southeast Asia. Provide detailed recommendations with practical travel tips, budget considerations, and cultural insights."
}
```

### Response Format

The tool returns:
- Main research content
- Citations (if available)
- Metadata:
  - Query used
  - System prompt (default or custom)
  - Model name
  - Token usage
  - Finish reason

Example response:
```
[Research content here...]

📚 **Citations:**
[1] https://example.com/source1
[2] https://example.com/source2

---
🔍 **Query:** What are the latest developments in quantum computing?
🤖 **Model:** sonar-pro
📊 **Tokens:** 150 (prompt: 25, completion: 125)
✅ **Finish Reason:** stop
```

## Project Structure

```
drtrips_research_mcp/
├── src/
│   ├── config/
│   │   └── settings.ts          # Environment configuration
│   ├── models/
│   │   └── research-models.ts   # Zod schemas and types
│   ├── services/
│   │   └── perplexity-client.ts # Perplexity API client
│   ├── server.ts                # MCP server implementation
│   └── index.ts                 # Entry point
├── dist/                        # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Migration from Python

This TypeScript implementation replaces the Python version with:

**Changes from Python:**
- ✅ Uses Perplexity API directly (`api.perplexity.ai`) instead of OpenRouter
- ✅ Model configured via `MODEL_USE` environment variable
- ✅ Simplified input: only `query` and `systemprompt` fields
- ✅ Better type safety with TypeScript + Zod
- ✅ Improved error handling
- ✅ Structured response formatting

**Python (`apis/perplexity_api.py`):**
```python
PERPLEXITY_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
model = "perplexity/sonar"
```

**TypeScript (`src/config/settings.ts`):**
```typescript
PERPLEXITY_BASE_URL = 'https://api.perplexity.ai/chat/completions'
MODEL_USE = process.env.MODEL_USE || 'sonar-pro'
```

## API Costs & Limits

Perplexity API pricing (as of 2024):
- Sonar models: Pay per request
- Check current pricing: https://docs.perplexity.ai/guides/pricing

Monitor your usage in the response metadata to track token consumption.

## Troubleshooting

### API Key Issues
```bash
# Verify API key is loaded
node -e "require('dotenv').config(); console.log(process.env.PERPLEXITY_API_KEY)"
```

### Build Errors
```bash
# Clean rebuild
rm -rf dist/
npm run build
```

### Model Configuration
```bash
# Check available models in Perplexity docs
# https://docs.perplexity.ai/guides/model-cards
```

## Development

Built following the migration guide at:
`../docs/MIGRATION_GUIDE_PYTHON_TO_TYPESCRIPT.md`

Key patterns:
- Zod for runtime validation
- Native `fetch` for HTTP requests
- Structured error handling
- Metadata in all responses

## License

MIT
