import { z } from 'zod';

/**
 * Response format options
 */
export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

/**
 * Schema for Research Query
 * Enhanced with validation and response format support
 */
export const ResearchQuerySchema = z.object({
  query: z.string()
    .min(2, "Query must be at least 2 characters")
    .max(500, "Query must not exceed 500 characters")
    .describe('The research query or question to search for'),
  systemprompt: z.string()
    .max(2000, "System prompt must not exceed 2000 characters")
    .optional()
    .describe('Optional system prompt to customize the research behavior'),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

export type ResearchQuery = z.infer<typeof ResearchQuerySchema>;

/**
 * Response types from Perplexity API
 */
export interface PerplexityMessage {
  role: string;
  content: string;
  annotations?: Array<{
    type: string;
    url_citation?: {
      url: string;
      title: string;
      start_index: number;
      end_index: number;
    };
  }>;
}

export interface PerplexityChoice {
  index: number;
  finish_reason: string;
  message: PerplexityMessage;
  delta?: {
    role?: string;
    content?: string;
  };
}

export interface PerplexityUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  usage: PerplexityUsage;
  citations?: string[];
  object: string;
  choices: PerplexityChoice[];
}

export interface ResearchUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface ResearchMetadata {
  model: string;
  finish_reason: string;
  usage: ResearchUsage;
  citations: string[];
  total_sources: number;
}

export interface ResearchResult {
  text: string;
  metadata: ResearchMetadata;
}
