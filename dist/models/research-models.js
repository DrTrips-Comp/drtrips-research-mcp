import { z } from 'zod';
/**
 * Response format options
 */
export var ResponseFormat;
(function (ResponseFormat) {
    ResponseFormat["MARKDOWN"] = "markdown";
    ResponseFormat["JSON"] = "json";
})(ResponseFormat || (ResponseFormat = {}));
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
//# sourceMappingURL=research-models.js.map