import { completeWithFallback } from "./openrouter";
import { FLASHCARD_SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import { parseFlashcardResponse } from "./parse";
import type { Flashcard, FlashcardGenerationRequest } from "@/types/flashcard";

export interface GenerationResult {
  flashcard: Flashcard[];
  model: string;
  meta: {
    requestedCount: number;
    generatedCount: number;
    difficulty: string;
  };
}

export async function generateFlashcards(
  input: FlashcardGenerationRequest
): Promise<GenerationResult> {
  if (!input.topic && !input.ques) {
    throw new Error("Either topic or question must be provided");
  }

  const requestedCount = input.counts
    ? parseInt(String(input.counts), 10)
    : input.ques
      ? 1
      : 8;

  const userMessage = buildUserPrompt(input);

  const { content, model } = await completeWithFallback(
    [
      { role: "system", content: FLASHCARD_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    { temperature: 0.65, maxTokens: 3500 }
  );

  const flashcard = parseFlashcardResponse(content);

  return {
    flashcard,
    model,
    meta: {
      requestedCount: requestedCount || flashcard.length,
      generatedCount: flashcard.length,
      difficulty: input.level || "intermediate",
    },
  };
}
