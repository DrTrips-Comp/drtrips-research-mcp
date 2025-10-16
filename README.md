# DrTrips Research MCP

A TypeScript-based MCP (Model Context Protocol) server for research using Perplexity models via OpenRouter.

## Features

- **Perplexity via OpenRouter** - Targets `https://openrouter.ai/api/v1/chat/completions`
- **Customizable System Prompts** - Control research behavior with custom prompts
- **Model Configuration via Environment** - Set model in `.env` file
- **Citations Support** - Automatic citation extraction and formatting
- **Token Usage Tracking** - Monitor API usage with detailed metrics


## Configuration

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Configure your settings:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
MODEL_USE=perplexity/sonar
```

### Available Models

- `perplexity/sonar` (default) - Balanced quality and speed
- `perplexity/sonar-pro` - Higher quality responses
- `perplexity/sonar-reasoning` - Extended reasoning capabilities

Find additional model identifiers on OpenRouter: https://openrouter.ai/models

### With Claude Desktop

Add to your `claude_desktop_config.json`:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "drtrips-research": {
      "command": "npx",
      "args": ["drtrips-research-mcp"],
      "env": {
        "OPENROUTER_API_KEY": "your_api_key_here",
        "MODEL_USE": "perplexity/sonar"
      }
    }
  }
}
```

Claude Desktop runs the command from the directory containing your project, so make sure the repository has been built (`npm run build`) before launching it this way.

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

The tool returns a structured object with two main fields:

#### Text Field
The `text` field contains the formatted response including:
- Main research content with markdown formatting
- Citations section with numbered references
- Query summary footer with model info and finish reason

#### Metadata Field
The `metadata` field contains structured information:
- `model`: Model identifier used (e.g., "perplexity/sonar")
- `finish_reason`: Completion status (e.g., "stop")
- `usage`: Token usage statistics
  - `input_tokens`: Number of tokens in the request
  - `output_tokens`: Number of tokens in the response
  - `total_tokens`: Total tokens consumed
- `citations`: Array of source URLs
- `total_sources`: Count of citation sources

#### Example Response Object

```json
{
  "text": "In 2024, AI experienced significant developments across various fields, including advancements in generative AI, mathematical reasoning, regulatory frameworks, and hardware improvements. Here are some of the key developments:\n\n## Generative AI and Creative Tools\n- **Google's ImageFX and MusicFX**: These tools were introduced early in 2024, enabling the creation of images and up-to-70-second audio clips from text prompts. Additionally, Google shared an early preview of MusicFX DJ, designed to enhance live music creation.\n- **Increased Adoption of Generative AI**: The use of generative AI in businesses grew significantly, with 71% of surveyed organizations using it in at least one business function by the end of 2024[4].\n\n## Mathematical Reasoning and Science\n- **AlphaGeometry and AlphaProof**: Google DeepMind unveiled AlphaGeometry, which solved complex geometry problems at a level comparable to a human Olympiad gold-medalist. The subsequent combination with AlphaGeometry 2 and AlphaProof solved 83% of historical International Mathematical Olympiad geometry problems[1].\n- **Advancements in Science**: AI is advancing science in fields like protein structure prediction, brain mapping, and flood forecasting. Quantum computing is being explored for predicting chemical reactivity, offering more accurate predictions than classical methods[1].\n\n## AI Regulation and Governance\n- **Regulatory Increase**: U.S. federal agencies introduced 59 AI-related regulations in 2024, more than double the number in 2023. Global cooperation on AI governance intensified, with frameworks focused on transparency and trustworthiness[2].\n- **Public Perception**: Sentiment towards AI varies globally, with optimism increasing in several countries, though there remains skepticism in places like the U.S. and Canada[2].\n\n## AI Hardware\n- **NVIDIA's Blackwell Series**: NVIDIA announced the Blackwell series of GPUs, promising vast performance improvements. However, the release faced delays due to design issues[7].\n- **Meta's LLaMA Updates**: Meta released updates to its LLaMA model, making it smaller and faster, enabling more sophisticated AI features on smaller devices[5].\n\n## AI in Business and Society\n- **Inclusive Digital Economy**: Efforts are being made to bridge digital divides and ensure digital spaces protect human rights[5].\n- **AI-Related Incidents**: Despite increased regulation, AI-related incidents are rising, emphasizing the need for standardized evaluations and safety measures[2].\n  \nThese developments highlight the rapid progress and integration of AI across multiple sectors in 2024, with ongoing challenges in regulation, safety, and societal acceptance.\n\n📚 **Citations:**\n[1] https://blog.google/technology/ai/google-ai-big-scientific-breakthroughs-2024/\n[2] https://hai.stanford.edu/ai-index/2025-ai-index-report\n[3] https://www.crescendo.ai/news/latest-ai-news-and-updates\n[4] https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai\n[5] https://www.trendmicro.com/en_us/research/25/a/top-ai-trends-from-2024-review.html\n[6] https://www.ibm.com/think/insights/artificial-intelligence-trends\n[7] https://iot-analytics.com/ai-2024-10-most-notable-stories/\n[8] https://altech.nd.edu/events-news/news/your-ai-update-april-2024/\n[9] https://aibreakthroughawards.com/2024-winners/\n[10] https://www.nu.edu/blog/ai-statistics-trends/\n[11] https://www.ironhack.com/us/blog/artificial-intelligence-breakthroughs-a-look-ahead-to-2024\n[12] https://hai.stanford.edu/ai-index/2024-ai-index-report\n[13] https://www.brainforge.ai/blog/the-7-most-groundbreaking-ai-breakthroughs-of-2024-that-are-reshaping-our-future\n\n\n---\n🔍 **Query:** What are the latest developments in AI in 2024?\n🤖 **Model:** perplexity/sonar\n✅ **Finish Reason:** stop",
  "metadata": {
    "model": "perplexity/sonar",
    "finish_reason": "stop",
    "usage": {
      "input_tokens": 40,
      "output_tokens": 521,
      "total_tokens": 561
    },
    "citations": [
      "https://blog.google/technology/ai/google-ai-big-scientific-breakthroughs-2024/",
      "https://hai.stanford.edu/ai-index/2025-ai-index-report",
      "https://www.crescendo.ai/news/latest-ai-news-and-updates",
      "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
      "https://www.trendmicro.com/en_us/research/25/a/top-ai-trends-from-2024-review.html",
      "https://www.ibm.com/think/insights/artificial-intelligence-trends",
      "https://iot-analytics.com/ai-2024-10-most-notable-stories/",
      "https://altech.nd.edu/events-news/news/your-ai-update-april-2024/",
      "https://aibreakthroughawards.com/2024-winners/",
      "https://www.nu.edu/blog/ai-statistics-trends/",
      "https://www.ironhack.com/us/blog/artificial-intelligence-breakthroughs-a-look-ahead-to-2024",
      "https://hai.stanford.edu/ai-index/2024-ai-index-report",
      "https://www.brainforge.ai/blog/the-7-most-groundbreaking-ai-breakthroughs-of-2024-that-are-reshaping-our-future"
    ],
    "total_sources": 13
  }
}
```

**Note:** The complete example above shows the actual MCP server output format. See `result.json` for the full raw response.

**Python (`apis/perplexity_api.py`):**
```python
PERPLEXITY_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
model = "perplexity/sonar"
```

**TypeScript (`src/config/settings.ts`):**
```typescript
PERPLEXITY_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'
MODEL_USE = process.env.MODEL_USE || 'perplexity/sonar'
```

## API Costs & Limits

Perplexity models on OpenRouter (as of 2024):
- Pricing varies per model request
- Check current pricing: https://openrouter.ai/pricing

Monitor your usage in the response metadata to track token consumption.

### Model Configuration
```bash
# Check available models in OpenRouter docs
# https://openrouter.ai/models?provider=perplexity
```

## License

MIT
