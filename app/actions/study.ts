"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { applyReviewGrade, DEFAULT_REVIEW_STATE } from "@/lib/srs/sm2";
import { getStudyQueue, getUserByClerkId } from "@/lib/srs/queue";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/actions/types";
import { REVIEW_GRADES, type ReviewGrade, type StudyCard } from "@/types/study";

export async function getStudyDueCards(
  setId: string
): Promise<ActionResult<{ cards: StudyCard[]; setTitle: string }>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return actionError("Unauthorized");

  try {
    const user = await getUserByClerkId(clerkId);
    if (!user) return actionError("User not found");

    const set = await prisma.flashcardSet.findFirst({
      where: { id: setId, userId: user.id },
    });
    if (!set) return actionError("Flashcard set not found");

    const cards = await getStudyQueue(user.id, setId);
    return actionSuccess({ cards, setTitle: set.title });
  } catch (error) {
    console.error("getStudyDueCards:", error);
    return actionError("Failed to load study queue");
  }
}

export async function submitReview(input: {
  flashcardId: string;
  grade: ReviewGrade;
}): Promise<ActionResult> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return actionError("Unauthorized");

  const { flashcardId, grade } = input;
  if (!flashcardId || !REVIEW_GRADES.includes(grade)) {
    return actionError("Invalid review input");
  }

  try {
    const user = await getUserByClerkId(clerkId);
    if (!user) return actionError("User not found");

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        flashcardSet: { userId: user.id },
      },
    });
    if (!flashcard) return actionError("Flashcard not found");

    const existing = await prisma.cardReviewState.findUnique({
      where: {
        userId_flashcardId: { userId: user.id, flashcardId },
      },
    });

    const currentState = existing
      ? {
          easeFactor: existing.easeFactor,
          intervalDays: existing.intervalDays,
          repetitions: existing.repetitions,
        }
      : DEFAULT_REVIEW_STATE;

    const now = new Date();
    const updated = applyReviewGrade(currentState, grade, now);

    await prisma.cardReviewState.upsert({
      where: {
        userId_flashcardId: { userId: user.id, flashcardId },
      },
      create: {
        userId: user.id,
        flashcardId,
        easeFactor: updated.easeFactor,
        intervalDays: updated.intervalDays,
        repetitions: updated.repetitions,
        nextReviewAt: updated.nextReviewAt,
        lastReviewedAt: now,
      },
      update: {
        easeFactor: updated.easeFactor,
        intervalDays: updated.intervalDays,
        repetitions: updated.repetitions,
        nextReviewAt: updated.nextReviewAt,
        lastReviewedAt: now,
      },
    });

    revalidatePath("/dashboard");
    return actionSuccess(undefined);
  } catch (error) {
    console.error("submitReview:", error);
    return actionError("Failed to record review");
  }
}
