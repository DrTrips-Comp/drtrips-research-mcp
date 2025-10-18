import { z } from 'zod';
/**
 * Response format options
 */
export declare enum ResponseFormat {
    MARKDOWN = "markdown",
    JSON = "json"
}
/**
 * Schema for Research Query
 * Enhanced with validation and response format support
 */
export declare const ResearchQuerySchema: z.ZodObject<{
    query: z.ZodString;
    systemprompt: z.ZodOptional<z.ZodString>;
    response_format: z.ZodDefault<z.ZodNativeEnum<typeof ResponseFormat>>;
}, "strict", z.ZodTypeAny, {
    query: string;
    response_format: ResponseFormat;
    systemprompt?: string | undefined;
}, {
    query: string;
    systemprompt?: string | undefined;
    response_format?: ResponseFormat | undefined;
}>;
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
