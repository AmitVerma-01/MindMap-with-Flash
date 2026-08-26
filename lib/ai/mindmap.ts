import { completeWithFallback } from "./openrouter";
import {
  MINDMAP_SYSTEM_PROMPT,
  buildMindMapFromSetPrompt,
  buildMindMapUserPrompt,
} from "./prompts";
import { parseMindMapResponse } from "./parse";
import type { MindMapTreeNode } from "@/types/mindmap";

export interface MindMapGenerationResult {
  tree: MindMapTreeNode;
  model: string;
}

export async function generateMindMap(input: {
  topic: string;
  extra?: string;
}): Promise<MindMapGenerationResult> {
  const userMessage = buildMindMapUserPrompt(input);

  const { content, model } = await completeWithFallback(
    [
      { role: "system", content: MINDMAP_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    { temperature: 0.6, maxTokens: 3000 }
  );

  const tree = parseMindMapResponse(content);
  return { tree, model };
}

export async function generateMindMapFromSet(
  topic: string,
  flashcards: Array<{ front: string; category?: string | null }>
): Promise<MindMapGenerationResult> {
  const userMessage = buildMindMapFromSetPrompt(topic, flashcards);

  const { content, model } = await completeWithFallback(
    [
      { role: "system", content: MINDMAP_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    { temperature: 0.5, maxTokens: 3500 }
  );

  const tree = parseMindMapResponse(content);
  return { tree, model };
}
