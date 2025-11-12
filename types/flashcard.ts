export interface Flashcard {
  front: string;
  back: string;
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
  level?: string;
  extra?: string;
  counts?: string;
  ques?: string;
}

export interface FlashcardGenerationResponse {
  flashcard: Flashcard[];
}
