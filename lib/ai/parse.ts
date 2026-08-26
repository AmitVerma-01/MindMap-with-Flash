import type { Flashcard } from "@/types/flashcard";

const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced"]);

function extractJsonObject(text: string): string {
  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\n?/, "").replace(/\n?```$/, "");
  }

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
}

function normalizeCard(raw: Record<string, unknown>): Flashcard | null {
  const front = typeof raw.front === "string" ? raw.front.trim() : "";
  const back = typeof raw.back === "string" ? raw.back.trim() : "";

  if (!front || !back) return null;

  const card: Flashcard = { front, back };

  if (typeof raw.hint === "string" && raw.hint.trim()) {
    card.hint = raw.hint.trim();
  }

  if (
    typeof raw.difficulty === "string" &&
    VALID_DIFFICULTIES.has(raw.difficulty.toLowerCase())
  ) {
    card.difficulty = raw.difficulty.toLowerCase() as Flashcard["difficulty"];
  }

  if (typeof raw.category === "string" && raw.category.trim()) {
    card.category = raw.category.trim();
  }

  if (typeof raw.mnemonic === "string" && raw.mnemonic.trim()) {
    card.mnemonic = raw.mnemonic.trim();
  }

  return card;
}

export function parseFlashcardResponse(content: string): Flashcard[] {
  const jsonText = extractJsonObject(content);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  const record = parsed as Record<string, unknown>;
  const rawCards = record.flashcard ?? record.flashcards ?? record.cards;

  if (!Array.isArray(rawCards)) {
    throw new Error("Invalid flashcard format: missing flashcard array");
  }

  const cards = rawCards
    .map((item) =>
      item && typeof item === "object"
        ? normalizeCard(item as Record<string, unknown>)
        : null
    )
    .filter((card): card is Flashcard => card !== null);

  if (cards.length === 0) {
    throw new Error("No valid flashcards in AI response");
  }

  return cards;
}
