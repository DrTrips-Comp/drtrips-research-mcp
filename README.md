# DrTrips Research MCP

[![npm version](https://img.shields.io/npm/v/drtrips-research-mcp.svg)](https://www.npmjs.com/package/drtrips-research-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional Model Context Protocol (MCP) server for research capabilities using Perplexity AI via OpenRouter API. Provides intelligent research with automatic citation extraction, customizable system prompts, and dual response formats (Markdown/JSON).

## Overview

DrTrips Research MCP enables LLMs to perform comprehensive web research through Perplexity AI models. It offers:

- **Up-to-date Information**: Access current web information through Perplexity's search capabilities
- **Automatic Citations**: Every response includes source URLs for verification
- **Customizable Behavior**: Control research focus with custom system prompts
- **Dual Output Formats**: Choose between human-readable Markdown or machine-readable JSON
- **Professional Error Handling**: Actionable error messages guide users to solutions
- **Token Tracking**: Monitor API usage with detailed token consumption metrics
- **Response Limits**: Automatic truncation at 25,000 characters for optimal context usage

---

## Features

### 🔍 **Intelligent Research**
- Web search powered by Perplexity AI models (Sonar, Sonar Pro, Sonar Reasoning)
- Comprehensive answers with context and explanations
- Automatic citation extraction and formatting
- Support for complex, multi-faceted queries

### 🎯 **Customizable System Prompts**
- Tailor research behavior for specific domains
- Examples: Travel expert, Technical researcher, Business analyst
- Up to 2,000 characters for detailed prompt engineering
- Default research assistant prompt when not specified

### 📊 **Dual Response Formats**

**Markdown Format** (Human-readable, default):
```markdown
# Research Content Here...

📚 **Citations:**
[1] https://source1.com
[2] https://source2.com

---
🔍 **Query:** Your question here
🤖 **Model:** perplexity/sonar
✅ **Finish Reason:** stop
```

**JSON Format** (Machine-readable):
```json
{
  "answer": "Research content here...",
  "citations": ["https://source1.com", "https://source2.com"],
  "model": "perplexity/sonar",
  "finish_reason": "stop",
  "usage": {
    "input_tokens": 40,
    "output_tokens": 521,
    "total_tokens": 561
  },
  "total_sources": 13
}
```

### 🛡️ **Robust Error Handling**
- Rate limit detection with retry guidance
- Authentication failure diagnostics
- Timeout handling with optimization suggestions
- Network error troubleshooting
- Input validation with clear error messages

### 📈 **Performance Optimization**
- 25,000 character response limit for context efficiency
- Automatic truncation with user guidance
- Query validation (2-500 characters)
- Token usage tracking and reporting

---

## Installation

### Prerequisites

- Node.js 18 or higher
- OpenRouter API key (get from [OpenRouter](https://openrouter.ai/keys))

### Via npm

```bash
npm install drtrips-research-mcp
```

### From Source

```bash
git clone https://github.com/drtrips/research-mcp.git
cd drtrips-research-mcp
npm install
npm run build
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required: Your OpenRouter API key
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Optional: Perplexity model to use (default: perplexity/sonar)
MODEL_USE=perplexity/sonar
```

### Available Models

Choose from these Perplexity models on OpenRouter:

| Model | Description | Best For |
|-------|-------------|----------|
| `perplexity/sonar` | Balanced quality and speed | General research (default) |
| `perplexity/sonar-pro` | Higher quality responses | Complex topics requiring depth |
| `perplexity/sonar-reasoning` | Extended reasoning | Multi-step analysis |

See all models at [OpenRouter Models](https://openrouter.ai/models?provider=perplexity)

---

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "drtrips-research": {
      "command": "npx",
      "args": ["drtrips-research-mcp"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-your-api-key-here",
        "MODEL_USE": "perplexity/sonar"
      }
    }
  }
}
```

**Or with local installation:**

```json
{
  "mcpServers": {
    "drtrips-research": {
      "command": "node",
      "args": ["/absolute/path/to/drtrips-research-mcp/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-your-api-key-here",
        "MODEL_USE": "perplexity/sonar"
      }
    }
  }
}
```

After configuration, restart Claude Desktop to activate the server.

### With MCP Inspector

For testing and debugging:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## Tool: `drtrips_research`

Perform research queries using Perplexity AI with customizable system prompts and response formats.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | - | Research question (2-500 characters) |
| `systemprompt` | string | ❌ No | Default assistant | Custom system prompt (max 2000 chars) |
| `response_format` | string | ❌ No | `"markdown"` | Output format: `"markdown"` or `"json"` |

### Examples

#### Example 1: Basic Query (Markdown)

```json
{
  "query": "What are the latest developments in quantum computing?"
}
```

**Response:**
```markdown
Quantum computing has seen significant breakthroughs in 2024...

📚 **Citations:**
[1] https://example.com/quantum-news
[2] https://example.com/research-paper

---
🔍 **Query:** What are the latest developments in quantum computing?
🤖 **Model:** perplexity/sonar
✅ **Finish Reason:** stop
```

#### Example 2: Travel Research with Custom Prompt

```json
{
  "query": "Best travel destinations in Southeast Asia for families",
  "systemprompt": "You are a travel expert specializing in Southeast Asia. Provide detailed recommendations with practical tips, budget considerations, and cultural insights."
}
```

**Response includes:**
- Family-friendly destinations
- Budget breakdowns
- Cultural tips
- Practical travel advice
- Source citations

#### Example 3: Technical Research in JSON Format

```json
{
  "query": "Current trends in artificial intelligence regulation",
  "systemprompt": "You are a technical researcher. Focus on recent academic papers and technical specifications.",
  "response_format": "json"
}
```

**Response:**
```json
{
  "answer": "AI regulation has evolved significantly in 2024...",
  "citations": [
    "https://example.com/ai-regulation-2024",
    "https://example.com/policy-paper"
  ],
  "model": "perplexity/sonar",
  "finish_reason": "stop",
  "usage": {
    "input_tokens": 45,
    "output_tokens": 623,
    "total_tokens": 668
  },
  "total_sources": 8
}
```

#### Example 4: Business Analysis

```json
{
  "query": "Electric vehicle market analysis 2024",
  "systemprompt": "You are a business analyst. Emphasize market data, financial implications, and competitive analysis.",
  "response_format": "markdown"
}
```

---

## Response Structure

### Content Field

The `content[0].text` field contains the formatted research response:

- **Markdown format**: Research content + citations section + metadata footer
- **JSON format**: Stringified JSON object with structured data

### Metadata Field

Always included regardless of `response_format`:

```typescript
{
  query: string;              // Original query
  systemprompt: string;       // System prompt used (or "default")
  timestamp: string;          // ISO 8601 timestamp
  model: string;              // Model identifier (e.g., "perplexity/sonar")
  finish_reason: string;      // Completion status (e.g., "stop")
  usage: {
    input_tokens: number;     // Tokens in request
    output_tokens: number;    // Tokens in response
    total_tokens: number;     // Total tokens consumed
  };
  citations: string[];        // Array of source URLs
  total_sources: number;      // Count of citation sources
}
```

---

## Error Handling

The server provides actionable error messages for common issues:

### Rate Limit Exceeded (429)

```
❌ **Error: Rate limit exceeded**

⚠️ Please wait a few seconds before making another request.
The API has usage limits to ensure fair access.
```

### Authentication Failed (401/403)

```
❌ **Error: Authentication failed**

🔑 Please check your OPENROUTER_API_KEY environment variable is set correctly.
Get your API key from https://openrouter.ai/keys
```

### Request Timed Out

```
❌ **Error: Request timed out**

⏱️ Try with a simpler, more focused query or try again later.
Complex queries may take longer to process.
```

### Invalid Query Length

```
❌ **Error: Validation Error**

Query must be at least 2 characters
Query must not exceed 500 characters
```

### Network Connection Error

```
❌ **Error: Network connection error**

🌐 Please check your internet connection and verify that
https://openrouter.ai is accessible.
```

---

## Performance & Limits

### Character Limits

- **Query**: 2-500 characters
- **System Prompt**: Up to 2,000 characters
- **Response**: Limited to 25,000 characters (automatically truncated with guidance)

### Response Times

- **Average**: 5-15 seconds depending on query complexity
- **Timeout**: 30 seconds (configurable in code)

### Token Usage

Monitor token consumption in the response metadata:
- `input_tokens`: Your query and system prompt
- `output_tokens`: Generated research content
- `total_tokens`: Combined usage for billing

**Pricing**: See [OpenRouter Pricing](https://openrouter.ai/pricing) for current rates.

---

## Security Considerations

### API Key Protection

- ✅ Store API keys in environment variables, never in code
- ✅ Use `.env` files excluded from version control (`.gitignore`)
- ✅ Validate API key on server startup
- ✅ Clear error messages when authentication fails

### Input Validation

- ✅ Zod schema validation for all inputs
- ✅ String length constraints (query: 2-500, systemprompt: ≤2000)
- ✅ Strict mode prevents extra fields
- ✅ Enum validation for `response_format`

### Error Exposure

- ✅ Error messages are user-friendly, not revealing internal details
- ✅ Server-side logging for debugging (stderr, not stdout)
- ✅ Actionable guidance in error messages

---

## Development

### Project Structure

```
drtrips-research-mcp/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── server.ts                   # MCP server setup & tool registration
│   ├── config/
│   │   └── settings.ts             # Environment configuration
│   ├── models/
│   │   └── research-models.ts      # Zod schemas & TypeScript types
│   └── services/
│       └── perplexity-client.ts    # Perplexity API integration
├── dist/                           # Compiled JavaScript
├── evaluations/
│   └── research_eval.xml           # Evaluation test cases
├── package.json
├── tsconfig.json
└── README.md
```

### Build & Run

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Development with auto-reload
npm run dev

# Run built server
npm start
```

### Testing

```bash
# Compile TypeScript
npm run build

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js

# Verify JavaScript syntax
node -c dist/index.js
```

---

## Tool Annotations

The `drtrips_research` tool includes MCP annotations for client guidance:

```typescript
{
  readOnlyHint: true,        // Does not modify environment
  destructiveHint: false,    // Non-destructive operation
  idempotentHint: true,      // Safe to repeat with same args
  openWorldHint: true        // Interacts with external API
}
```

**Note**: These are hints, not security guarantees. Clients should not make security-critical decisions based solely on annotations.

---

## Use Cases

### ✅ When to Use

- **Current Events**: "Latest developments in AI regulation 2024"
- **Research**: "Quantum computing breakthroughs"
- **Travel Planning**: "Best destinations in Southeast Asia" (with travel expert prompt)
- **Market Analysis**: "Electric vehicle market trends" (with business analyst prompt)
- **Technical Research**: "Machine learning frameworks comparison" (with technical researcher prompt)
- **General Knowledge**: Any topic requiring up-to-date, cited information

### ❌ When NOT to Use

- **Calculations**: Use computational tools instead
- **Data Transformations**: Use data processing tools
- **Private Information**: Tool only searches public web
- **Historical Data**: Limited to information available online
- **Real-time Data**: Responses may have slight delays

---

## Troubleshooting

### Server won't start

1. Check Node.js version: `node --version` (must be ≥18)
2. Verify API key is set in `.env` file
3. Check for build errors: `npm run build`
4. Review logs in stderr output

### No citations in response

- Some queries may not return citations
- Try more specific queries
- Check if model supports citations (all Perplexity models do)

### Response truncated

- Query is too broad, try more specific search terms
- Use filters or constraints in your query
- Consider breaking into multiple smaller queries

### Slow responses

- Complex queries take longer (5-15 seconds average)
- Network latency may vary
- Consider using simpler queries or more specific terms

---

## API Costs & Rate Limits

### Pricing

Perplexity models on OpenRouter are billed per token:
- Check current pricing: [OpenRouter Pricing](https://openrouter.ai/pricing)
- Monitor usage in response metadata (`usage` object)
- Set up billing alerts in OpenRouter dashboard

### Rate Limits

- Limits enforced by OpenRouter/Perplexity
- Server returns helpful messages on rate limit (429)
- Suggestion: Wait a few seconds between requests

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Zod for input validation
- Add tests for new features
- Update documentation
- Follow existing code style

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/drtrips/research-mcp/issues)
- **Documentation**: This README
- **API Documentation**: [OpenRouter Docs](https://openrouter.ai/docs)
- **MCP Specification**: [Model Context Protocol](https://modelcontextprotocol.io)

---

## Changelog

### Version 1.0.2 (Current)

#### Documentation
- ✅ Professional README.md following MCP best practices
- ✅ Comprehensive documentation with 19 sections
- ✅ 4 detailed usage examples
- ✅ Complete error handling documentation
- ✅ Security considerations section
- ✅ Troubleshooting guide
- ✅ Use cases guide (when to use/not use)
- ✅ Contributing guidelines
- ✅ Development setup documentation

#### Improvements
- Enhanced README with badges and professional structure
- Better organized documentation for users and developers
- Clear setup instructions for all platforms (macOS, Windows, Linux)
- Comprehensive API documentation with TypeScript types

---

### Version 1.0.1

#### Features
- ✅ Dual response formats (Markdown/JSON)
- ✅ Enhanced input validation with Zod
- ✅ Character limit protection (25,000 chars)
- ✅ Actionable error messages
- ✅ Tool annotations (readOnly, destructive, idempotent, openWorld)
- ✅ Comprehensive tool description
- ✅ 10 evaluation test cases

#### Improvements
- Enhanced error handling with specific guidance
- Better input validation constraints
- Automatic response truncation with user guidance
- Professional documentation

#### Technical
- TypeScript strict mode enabled
- Proper MCP best practices implementation
- Modular architecture with clear separation of concerns

---

## Acknowledgments

- **Perplexity AI** for powerful search capabilities
- **OpenRouter** for unified API access
- **Model Context Protocol** for standardized LLM tool integration
- **Anthropic** for Claude and MCP ecosystem support

---

Made with ❤️ by DrTrips
