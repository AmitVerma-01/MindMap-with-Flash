import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { applyReviewGrade, DEFAULT_REVIEW_STATE } from "@/lib/srs/sm2";
import { getUserByClerkId } from "@/lib/srs/queue";
import { REVIEW_GRADES, type ReviewGrade } from "@/types/study";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { flashcardId, grade } = body as {
      flashcardId?: string;
      grade?: string;
    };

    if (!flashcardId || !grade) {
      return NextResponse.json(
        { error: "flashcardId and grade are required" },
        { status: 400 }
      );
    }

    if (!REVIEW_GRADES.includes(grade as ReviewGrade)) {
      return NextResponse.json(
        { error: "Invalid grade. Must be again, hard, good, or easy" },
        { status: 400 }
      );
    }

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: flashcardId,
        flashcardSet: { userId: user.id },
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.cardReviewState.findUnique({
      where: {
        userId_flashcardId: {
          userId: user.id,
          flashcardId,
        },
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
    const updated = applyReviewGrade(currentState, grade as ReviewGrade, now);

    const reviewState = await prisma.cardReviewState.upsert({
      where: {
        userId_flashcardId: {
          userId: user.id,
          flashcardId,
        },
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

    return NextResponse.json(
      {
        reviewState: {
          id: reviewState.id,
          flashcardId: reviewState.flashcardId,
          easeFactor: reviewState.easeFactor,
          intervalDays: reviewState.intervalDays,
          repetitions: reviewState.repetitions,
          nextReviewAt: reviewState.nextReviewAt.toISOString(),
          lastReviewedAt: reviewState.lastReviewedAt?.toISOString() ?? null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recording review:", error);
    return NextResponse.json(
      { error: "Failed to record review" },
      { status: 500 }
    );
  }
}
