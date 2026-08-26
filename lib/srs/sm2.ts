import type { ReviewGrade } from "@/types/study";

export interface ReviewStateInput {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export interface ReviewStateOutput {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: Date;
}

const MIN_EASE = 1.3;
const MASTERED_INTERVAL_DAYS = 21;

export function isMastered(intervalDays: number, repetitions: number): boolean {
  return repetitions >= 3 && intervalDays >= MASTERED_INTERVAL_DAYS;
}

export function applyReviewGrade(
  state: ReviewStateInput,
  grade: ReviewGrade,
  now: Date = new Date()
): ReviewStateOutput {
  let { easeFactor, intervalDays, repetitions } = state;

  if (grade === "again") {
    repetitions = 0;
    intervalDays = 0;
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
    const nextReviewAt = new Date(now.getTime() + 60 * 1000);
    return { easeFactor, intervalDays, repetitions, nextReviewAt };
  }

  if (grade === "hard") {
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.15);
    if (repetitions === 0) {
      intervalDays = 1;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
    }
    repetitions += 1;
    const nextReviewAt = addDays(now, intervalDays);
    return { easeFactor, intervalDays, repetitions, nextReviewAt };
  }

  if (grade === "good") {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    }
    repetitions += 1;
    const nextReviewAt = addDays(now, intervalDays);
    return { easeFactor, intervalDays, repetitions, nextReviewAt };
  }

  // easy
  easeFactor = easeFactor + 0.15;
  if (repetitions === 0) {
    intervalDays = 4;
  } else {
    intervalDays = Math.max(1, Math.round(intervalDays * easeFactor * 1.3));
  }
  repetitions += 1;
  const nextReviewAt = addDays(now, intervalDays);
  return { easeFactor, intervalDays, repetitions, nextReviewAt };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const DEFAULT_REVIEW_STATE: ReviewStateInput = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
};
