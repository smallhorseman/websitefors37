/**
 * Unified AI Client for Studio37
 * 
 * Provides consistent Gemini 2.0 Flash integration across all features:
 * - Chatbot conversations
 * - Blog post generation
 * - Image analysis & alt text
 * - Lead scoring & prioritization
 * - SEO content suggestions
 * - Visual content understanding
 */

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { createLogger } from "./logger";

const log = createLogger("lib/ai-client");

// Resolve default model from env with safe fallbacks (prefers stable Gemini 3 Pro)
const ENV_MODEL =
  process.env.GOOGLE_GENAI_MODEL ||
  process.env.GEMINI_MODEL ||
  process.env.AI_MODEL ||
  "gemini-3-pro";

// Known good fallbacks in descending preference
export const MODEL_FALLBACKS = [
  ENV_MODEL,
  // Stable primary
  "gemini-3-pro",
  // Preview variants (minor versioned and alias forms)
  "gemini-3.0-pro-preview",
  "gemini-3-pro-preview",
  // Prior generations
  "gemini-2.5-pro",
  "gemini-2.0-flash-exp",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
];

// Model configurations for different use cases
export const AI_MODELS = {
  // Default multimodal model
  FLASH: MODEL_FALLBACKS[0],
  // For vision tasks (Gemini 3 Pro Preview is multimodal as well)
  VISION: MODEL_FALLBACKS[0],
} as const;

export type AIModel = string;

interface GenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

// Preset configs for common scenarios
export const AI_CONFIGS = {
  // Creative content generation (blog posts, marketing copy)
  creative: {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 4096,
  },
  // Precise, factual responses (chatbot, support)
  precise: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  },
  // Structured data extraction (lead scoring, intent detection)
  structured: {
    temperature: 0.3,
    topP: 0.8,
    topK: 20,
    maxOutputTokens: 1024,
    responseMimeType: "application/json",
  },
  // Short, concise responses (alt text, titles, summaries)
  concise: {
    temperature: 0.5,
    topP: 0.8,
    topK: 30,
    maxOutputTokens: 512,
  },
} as const;

export type AIConfigPreset = keyof typeof AI_CONFIGS;

interface AIClientOptions {
  model?: AIModel;
  config?: GenerationConfig | AIConfigPreset;
  systemInstruction?: string;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Initialize AI client with custom options
 */
export function createAIClient(options: AIClientOptions = {}): GenerativeModel {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY or GEMINI_API_KEY environment variable");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Resolve config preset or use custom config
  const config = typeof options.config === "string" 
    ? AI_CONFIGS[options.config]
    : options.config || AI_CONFIGS.precise;

  const modelParams: any = {
    model: options.model || AI_MODELS.FLASH,
    generationConfig: config,
  };

  if (options.systemInstruction) {
    modelParams.systemInstruction = options.systemInstruction;
  }

  return genAI.getGenerativeModel(modelParams);
}

/**
 * Generate text with automatic retry and error handling
 */
export async function generateText(
  prompt: string,
  options: AIClientOptions = {}
): Promise<string> {
  const maxRetries = options.retries || 3;
  const retryDelay = options.retryDelayMs || 1000;
  
  let lastError: Error | null = null;
  
  // Try with progressive model fallbacks if the model is not available
  const candidates = [options.model || AI_MODELS.FLASH, ...MODEL_FALLBACKS].filter(
    (v, i, arr) => !!v && arr.indexOf(v) === i
  );

  for (const candidate of candidates) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const model = createAIClient({ ...options, model: candidate });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        if (!text) throw new Error("Empty response from AI");
        if (candidate !== (options.model || AI_MODELS.FLASH)) {
          log.info("Model fallback used", { candidate });
        }
        return text;
      } catch (error: any) {
        lastError = error;
        const errorMsg = String(error?.message || error || "");

        // If model not found/unsupported, break to next candidate immediately
        if (
          error?.status === 404 ||
          /model(.+)?not (found|available|supported)/i.test(errorMsg)
        ) {
          log.warn("Model unavailable, trying next fallback", { candidate, error: errorMsg });
          break; // move to next candidate
        }

        // Don't retry on certain errors
        if (
          errorMsg.includes("reported as leaked") ||
          errorMsg.includes("API key") ||
          (error.status === 403 && errorMsg.includes("Forbidden"))
        ) {
          log.error("API key issue detected", { error: errorMsg });
          throw new Error("API key configuration error. Please check Netlify environment variables.");
        }

        // Rate limit errors - wait longer
        if (error.status === 429 || errorMsg.includes("rate limit")) {
          const waitTime = retryDelay * Math.pow(2, attempt - 1);
          log.warn(`Rate limited, waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        // Server errors - retry with exponential backoff
        if (error.status >= 500 || errorMsg.includes("timeout")) {
          if (attempt < maxRetries) {
            const waitTime = retryDelay * Math.pow(2, attempt - 1);
            log.warn(`Server error, retrying in ${waitTime}ms (${attempt}/${maxRetries})`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }
        }

        // Other errors - fail immediately
        log.error("AI generation failed", { attempt, model: candidate, error: errorMsg });
        throw error;
      }
    }
  }

  throw lastError || new Error("AI generation failed after retries and fallbacks");
}

/**
 * Generate structured JSON output
 */
export async function generateJSON<T = any>(
  prompt: string,
  options: Omit<AIClientOptions, 'config'> = {}
): Promise<T> {
  const text = await generateText(prompt, {
    ...options,
    config: AI_CONFIGS.structured,
  });
  
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    log.error("Failed to parse JSON response", { text, error });
    throw new Error("Invalid JSON response from AI");
  }
}

/**
 * Analyze image and generate description
 */
export async function analyzeImage(
  imageData: string | Buffer,
  prompt: string,
  options: AIClientOptions = {}
): Promise<string> {
  const model = createAIClient({
    ...options,
    model: AI_MODELS.VISION,
    config: options.config || AI_CONFIGS.concise,
  });
  
  const imagePart = {
    inlineData: {
      data: Buffer.isBuffer(imageData) 
        ? imageData.toString('base64')
        : imageData,
      mimeType: "image/jpeg", // Default, can be overridden
    },
  };
  
  try {
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text().trim();
  } catch (error: any) {
    log.error("Image analysis failed", { error: error?.message });
    throw error;
  }
}

/**
 * Extract structured data from conversation
 */
export interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  budget?: string;
  eventDate?: string;
  intent?: string;
  urgency?: "low" | "medium" | "high";
  score?: number; // 0-100
}

export async function extractLeadData(
  conversationHistory: string,
  options: AIClientOptions = {}
): Promise<LeadData> {
  const prompt = `Analyze this customer conversation and extract structured lead information.

Conversation:
${conversationHistory}

Extract and return ONLY valid JSON with these fields (omit any you can't determine):
{
  "name": "customer's full name if mentioned",
  "email": "email address if provided",
  "phone": "phone number if provided",
  "service": "wedding|portrait|event|commercial|headshot",
  "budget": "mentioned budget or range",
  "eventDate": "mentioned date or timeline",
  "intent": "browsing|interested|ready-to-book",
  "urgency": "low|medium|high based on timeline and language",
  "score": 0-100 based on qualification (has contact info, clear intent, budget mentioned, etc)
}`;

  return generateJSON<LeadData>(prompt, options);
}

/**
 * Generate SEO-optimized content suggestions
 */
export interface SEOSuggestions {
  title: string;
  metaDescription: string;
  keywords: string[];
  headings: string[];
  improvements: string[];
}

export async function generateSEOSuggestions(
  content: string,
  targetKeyword: string,
  options: AIClientOptions = {}
): Promise<SEOSuggestions> {
  const prompt = `Analyze this content and provide SEO optimization suggestions for the target keyword: "${targetKeyword}"

Content:
${content.slice(0, 3000)}

Generate SEO suggestions as JSON:
{
  "title": "optimized title (50-60 chars, includes keyword)",
  "metaDescription": "compelling meta description (150-160 chars, includes keyword)",
  "keywords": ["primary keyword", "related keyword 1", "related keyword 2"],
  "headings": ["suggested H2 heading 1", "suggested H2 heading 2"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}`;

  return generateJSON<SEOSuggestions>(prompt, {
    ...options,
    config: AI_CONFIGS.creative,
  });
}

/**
 * Generate blog post with structured output
 */
export interface BlogPost {
  title: string;
  metaDescription: string;
  content: string;
  tags: string[];
  category: string;
  excerpt: string;
}

export async function generateBlogPost(
  topic: string,
  keywords: string[],
  wordCount: number = 1000,
  tone: string = "professional",
  options: AIClientOptions = {}
): Promise<BlogPost> {
  const prompt = `Write a comprehensive, SEO-optimized blog post about: ${topic}

Requirements:
- Target keywords: ${keywords.join(", ")}
- Word count: approximately ${wordCount} words
- Tone: ${tone}
- Include H2 and H3 headings for structure
- Write in an engaging, natural style
- Focus on photography business context (Studio37)
- Include actionable tips and insights

Return as JSON:
{
  "title": "compelling SEO title (50-60 chars)",
  "metaDescription": "meta description (150-160 chars)",
  "content": "full blog post content with markdown formatting",
  "tags": ["relevant", "tags", "for", "categorization"],
  "category": "wedding|portrait|business|tips|guides",
  "excerpt": "brief 2-sentence summary for preview"
}`;

  return generateJSON<BlogPost>(prompt, {
    ...options,
    config: AI_CONFIGS.creative,
  });
}

/**
 * Generate image alt text
 */
export async function generateAltText(
  imageUrl: string,
  context: {
    title?: string;
    category?: string;
    keywords?: string[];
  } = {},
  options: AIClientOptions = {}
): Promise<string> {
  const prompt = `Generate a descriptive, SEO-optimized alt text for this photography image.

Context:
${context.title ? `Title: ${context.title}` : ''}
${context.category ? `Category: ${context.category}` : ''}
${context.keywords?.length ? `Keywords: ${context.keywords.join(', ')}` : ''}

Requirements:
- Describe the image clearly and accurately
- Include relevant photography terms
- Optimize for SEO without keyword stuffing
- Keep under 125 characters
- Be specific and descriptive

Generate ONLY the alt text, no JSON or extra formatting.`;

  try {
    // Fetch image and convert to base64
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    return await analyzeImage(base64, prompt, options);
  } catch (error) {
    log.warn("Image fetch failed, generating from context only", { imageUrl });
    // Fallback to text-only generation
    return await generateText(prompt, options);
  }
}

export default {
  createAIClient,
  generateText,
  generateJSON,
  analyzeImage,
  extractLeadData,
  generateSEOSuggestions,
  generateBlogPost,
  generateAltText,
  AI_MODELS,
  AI_CONFIGS,
};
