export type FlashcardDifficulty = "beginner" | "intermediate" | "advanced";

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
  difficulty?: FlashcardDifficulty;
  category?: string;
  mnemonic?: string;
}

export interface FlashcardSet {
  id?: string;
  title: string;
  topic: string;
  flashcards: Flashcard[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FlashcardGenerationRequest {
  topic?: string;
  level?: FlashcardDifficulty;
  extra?: string;
  counts?: string | number;
  ques?: string;
}

export interface FlashcardGenerationResponse {
  flashcard: Flashcard[];
  model?: string;
  meta?: {
    requestedCount: number;
    generatedCount: number;
    difficulty: string;
  };
  credits?: {
    remaining: number;
    limit: number;
    plan: string;
  };
}

export const DIFFICULTY_OPTIONS: { value: FlashcardDifficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const CARD_COUNT_OPTIONS = [5, 8, 10, 12] as const;
