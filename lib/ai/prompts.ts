export const FLASHCARD_SYSTEM_PROMPT = `You are an expert educational content creator specializing in high-quality flashcards for active recall and long-term retention.

CORE PRINCIPLES:
1. Each flashcard tests ONE concept only
2. Questions must be specific, unambiguous, and answerable
3. Answers should be concise yet complete (10-120 words)
4. Vary question types across the deck
5. Order cards from foundational → advanced within the set

QUESTION TYPES (use a mix):
- Definition, Application, Comparison, Example, Cause/Effect, Process, True/False style

CARD FIELDS:
- front: the question or prompt (5-25 words)
- back: the answer or explanation
- hint: optional subtle clue without giving away the answer (5-15 words)
- difficulty: "beginner" | "intermediate" | "advanced"
- category: short topic tag (1-3 words, e.g. "Syntax", "Theory")
- mnemonic: optional memory aid when helpful

OUTPUT FORMAT — return ONLY valid JSON, no markdown fences:
{
  "flashcard": [
    {
      "front": "Question here?",
      "back": "Answer here.",
      "hint": "Optional clue",
      "difficulty": "intermediate",
      "category": "Topic",
      "mnemonic": "Optional memory trick"
    }
  ]
}

RULES:
- Generate the requested number of cards
- No duplicate concepts
- No markdown in values
- Proper JSON escaping for quotes
- hint and mnemonic may be omitted if not useful`;

export function buildUserPrompt(input: {
  topic?: string;
  level?: string;
  extra?: string;
  counts?: string | number;
  ques?: string;
}): string {
  if (input.ques) {
    return `Create exactly 1 flashcard for this question: "${input.ques}"
Include hint and difficulty. Provide a clear, accurate answer.`;
  }

  const difficulty = input.level || "intermediate";
  const count = input.counts ?? 8;
  const context = input.extra?.trim()
    ? `\n\nFocus areas / additional context:\n${input.extra.trim()}`
    : "";

  return `Create exactly ${count} flashcards about: ${input.topic}
Difficulty level: ${difficulty}${context}

Requirements:
- Cover the most important concepts for this topic at the given level
- Use varied question types
- Each card must test a unique concept
- Include hints on at least half the cards`;
}

export const MINDMAP_SYSTEM_PROMPT = `You are an expert educator who creates clear hierarchical mind maps for learning.

OUTPUT FORMAT — return ONLY valid JSON, no markdown fences:
{
  "tree": {
    "id": "root",
    "label": "Central Topic",
    "children": [
      {
        "id": "node-1",
        "label": "Main Branch",
        "children": [
          { "id": "node-1-1", "label": "Sub-topic" }
        ]
      }
    ]
  }
}

RULES:
- Root node id must be "root"
- All node ids must be unique strings (use patterns like node-1, node-1-1, node-2)
- Labels: 2-8 words each, concise and educational
- Tree depth: 3-4 levels including root
- Total nodes: 15-30 (including root)
- Organize from broad concepts → specific details
- No markdown in labels
- Proper JSON escaping`;

export function buildMindMapUserPrompt(input: {
  topic: string;
  extra?: string;
}): string {
  const context = input.extra?.trim()
    ? `\n\nAdditional context:\n${input.extra.trim()}`
    : "";

  return `Create a mind map tree for the topic: ${input.topic}${context}

Requirements:
- Cover the most important concepts and sub-concepts
- Logical grouping with clear parent-child relationships
- Educational labels suitable for study`;
}

export function buildMindMapFromSetPrompt(
  topic: string,
  cards: Array<{ front: string; category?: string | null }>
): string {
  const cardList = cards
    .map((c, i) => `${i + 1}. [${c.category || "General"}] ${c.front}`)
    .join("\n");

  return `Create a mind map tree that organizes these flashcard concepts under the topic "${topic}":

${cardList}

Group related cards under shared branches. The root label should be the main topic.`;
}
