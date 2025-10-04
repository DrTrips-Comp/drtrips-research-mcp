import { z } from 'zod';

/**
 * Schema for Research Query
 * Simplified model with only query and systemprompt
 */
export const ResearchQuerySchema = z.object({
  query: z.string().min(1).describe('The research query or question to search for'),
  systemprompt: z.string().optional().describe('Optional system prompt to customize the research behavior')
});

export type ResearchQuery = z.infer<typeof ResearchQuerySchema>;

/**
 * Response types from Perplexity API
 */
export interface PerplexityMessage {
  role: string;
  content: string;
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
