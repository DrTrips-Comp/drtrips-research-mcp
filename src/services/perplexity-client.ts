import type { ResearchQuery, PerplexityResponse, ResearchResult } from '../models/research-models.js';
import { OPENROUTER_API_KEY, PERPLEXITY_BASE_URL, MODEL_USE } from '../config/settings.js';

export class PerplexityClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(apiKey: string, model: string) {
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.');
    }
    this.apiKey = apiKey;
    this.baseUrl = PERPLEXITY_BASE_URL;
    this.model = model;
  }

  /**
   * Perform research query using Perplexity API
   */
  async research(input: ResearchQuery): Promise<ResearchResult> {
    try {
      // Default system prompt if not provided
      const defaultSystemPrompt =
        "You are a helpful research assistant that provides accurate and up-to-date information. " +
        "Please provide comprehensive answers with relevant details and cite sources when possible.";

      const systemPrompt = input.systemprompt || defaultSystemPrompt;

      // Construct messages array
      const messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: input.query
        }
      ];

      // Make request to Perplexity API
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Perplexity API error: ${response.status} ${response.statusText}\n${errorText}`
        );
      }

      const data = await response.json() as PerplexityResponse;

      return this.formatResponse(data, input.query);

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unknown error occurred: ${String(error)}`);
    }
  }

  /**
   * Format the Perplexity API response
   */
  private formatResponse(data: PerplexityResponse, query: string): ResearchResult {
    // Handle both direct citations array and OpenRouter annotations format
    let citations: string[] = [];
    if (Array.isArray(data.citations)) {
      citations = data.citations;
    } else if (data.choices?.[0]?.message?.annotations) {
      // Extract citations from OpenRouter annotations
      citations = data.choices[0].message.annotations
        .filter((ann: any) => ann.type === 'url_citation')
        .map((ann: any) => ann.url_citation.url);
    }

    const usage = data.usage ?? {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    };

    if (!data.choices || data.choices.length === 0) {
      return {
        text: '❌ No response from Perplexity API',
        metadata: {
          model: data.model,
          finish_reason: 'no_response',
          usage: {
            input_tokens: usage.prompt_tokens ?? 0,
            output_tokens: usage.completion_tokens ?? 0,
            total_tokens: usage.total_tokens ?? ((usage.prompt_tokens ?? 0) + (usage.completion_tokens ?? 0))
          },
          citations: [],
          total_sources: 0
        }
      };
    }

    const choice = data.choices[0];
    let content = choice.message.content;

    // Append citations if available
    if (citations.length > 0) {
      content += '\n\n📚 **Citations:**\n';
      citations.forEach((citation, index) => {
        content += `[${index + 1}] ${citation}\n`;
      });
    }

    // Add metadata footer (presentation only)
    content += '\n\n---\n';
    content += `🔍 **Query:** ${query}\n`;
    content += `🤖 **Model:** ${data.model}\n`;
    content += `✅ **Finish Reason:** ${choice.finish_reason}`;

    const totalTokens = usage.total_tokens ?? ((usage.prompt_tokens ?? 0) + (usage.completion_tokens ?? 0));

    return {
      text: content,
      metadata: {
        model: data.model,
        finish_reason: choice.finish_reason ?? 'unknown',
        usage: {
          input_tokens: usage.prompt_tokens ?? 0,
          output_tokens: usage.completion_tokens ?? 0,
          total_tokens: totalTokens
        },
        citations,
        total_sources: citations.length
      }
    };
  }
}

// Export singleton instance
export const perplexityClient = new PerplexityClient(OPENROUTER_API_KEY, MODEL_USE);
