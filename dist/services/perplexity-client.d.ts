import type { ResearchQuery, ResearchResult } from '../models/research-models.js';
export declare class PerplexityClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly model;
    constructor(apiKey: string, model: string);
    /**
     * Perform research query using Perplexity API
     */
    research(input: ResearchQuery): Promise<ResearchResult>;
    /**
     * Format the Perplexity API response
     */
    private formatResponse;
}
export declare const perplexityClient: PerplexityClient;
