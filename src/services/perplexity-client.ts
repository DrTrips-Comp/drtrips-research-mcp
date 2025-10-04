import type { ResearchQuery, PerplexityResponse } from '../models/research-models.js';
import { PERPLEXITY_API_KEY, PERPLEXITY_BASE_URL, MODEL_USE } from '../config/settings.js';

export class PerplexityClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(apiKey: string, model: string) {
    if (!apiKey) {
      throw new Error('Perplexity API key not configured. Please set PERPLEXITY_API_KEY environment variable.');
    }
    this.apiKey = apiKey;
    this.baseUrl = PERPLEXITY_BASE_URL;
    this.model = model;
  }

  /**
   * Perform research query using Perplexity API
   */
  async research(input: ResearchQuery): Promise<string> {
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
  private formatResponse(data: PerplexityResponse, query: string): string {
    if (!data.choices || data.choices.length === 0) {
      return '❌ No response from Perplexity API';
    }

    const choice = data.choices[0];
    let content = choice.message.content;

    // Append citations if available
    if (data.citations && Array.isArray(data.citations) && data.citations.length > 0) {
      content += '\n\n📚 **Citations:**\n';
      data.citations.forEach((citation, index) => {
        content += `[${index + 1}] ${citation}\n`;
      });
    }

    // Build metadata array
    const metadata: Record<string, number>[] = [
      { input_token: data.usage.prompt_tokens },
      { output_token: data.usage.completion_tokens }
    ];

    // Add total_source if citations are available
    if (data.citations && Array.isArray(data.citations) && data.citations.length > 0) {
      metadata.push({ total_source: data.citations.length });
    }

    // Add metadata footer
    content += '\n\n---\n';
    content += `🔍 **Query:** ${query}\n`;
    content += `🤖 **Model:** ${data.model}\n`;
    content += `📊 **Metadata:** ${JSON.stringify(metadata)}\n`;
    content += `✅ **Finish Reason:** ${choice.finish_reason}`;

    return content;
  }
}

// Export singleton instance
export const perplexityClient = new PerplexityClient(PERPLEXITY_API_KEY, MODEL_USE);
