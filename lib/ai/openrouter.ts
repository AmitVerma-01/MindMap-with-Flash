import OpenAI from "openai";
import { getModelChain } from "./models";

let client: OpenAI | null = null;

export function getOpenRouterClient(): OpenAI {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not defined in environment variables");
  }

  if (!client) {
    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://mindmapwithflash.kodeeslabs.com",
        "X-Title": "MindMap with Flash",
      },
    });
  }

  return client;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CompletionResult {
  content: string;
  model: string;
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;

  const message = error.message.toLowerCase();
  return (
    message.includes("rate limit") ||
    message.includes("timeout") ||
    message.includes("503") ||
    message.includes("502") ||
    message.includes("429") ||
    message.includes("overloaded") ||
    message.includes("no response") ||
    message.includes("empty response")
  );
}

export async function completeWithFallback(
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<CompletionResult> {
  const models = getModelChain();

  if (models.length === 0) {
    throw new Error(
      "No AI models configured. Set OPENROUTER_MODEL_PRIMARY or OPENROUTER_MODEL_DEEPSEEK."
    );
  }

  const openai = getOpenRouterClient();
  const errors: string[] = [];

  for (const model of models) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 3000,
      });

      const content = completion.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error(`Empty response from ${model}`);
      }

      return { content, model };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      errors.push(`${model}: ${msg}`);
      console.warn(`[AI] Model failed (${model}):`, msg);

      if (!isRetryableError(error) && !msg.includes("parse")) {
        continue;
      }
    }
  }

  throw new Error(
    `All AI models failed. Tried: ${models.join(", ")}. Errors: ${errors.join(" | ")}`
  );
}
