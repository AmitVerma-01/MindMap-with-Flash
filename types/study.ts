export type ReviewGrade = "again" | "hard" | "good" | "easy";

export interface CardReviewStateData {
  id: string;
  userId: string;
  flashcardId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string;
  lastReviewedAt: string | null;
}

export interface StudyCard {
  id: string;
  front: string;
  back: string;
  hint?: string | null;
  mnemonic?: string | null;
  category?: string | null;
  difficulty?: string | null;
  flashcardSetId: string;
  status: "due" | "new";
  reviewState?: CardReviewStateData | null;
}

export interface SetStudyStats {
  setId: string;
  due: number;
  new: number;
  mastered: number;
  total: number;
}

export const REVIEW_GRADES: ReviewGrade[] = ["again", "hard", "good", "easy"];

export const GRADE_LABELS: Record<ReviewGrade, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};
