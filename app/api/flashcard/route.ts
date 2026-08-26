import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkCredits, deductCredits } from "@/lib/credits";
import { generateFlashcards } from "@/lib/ai/flashcards";
import type { FlashcardGenerationRequest } from "@/types/flashcard";

export const dynamic = "force-dynamic";

function estimateCardCount(data: FlashcardGenerationRequest): number {
  if (data.ques) return 1;
  if (data.counts) {
    const parsed = parseInt(String(data.counts), 10);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  return 8;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to generate flashcards" },
        { status: 401 }
      );
    }

    const data: FlashcardGenerationRequest = await req.json();

    if (!data.topic && !data.ques) {
      return NextResponse.json(
        { error: "Either 'topic' or 'ques' field is required" },
        { status: 400 }
      );
    }

    const estimatedCards = estimateCardCount(data);
    const creditCheck = await checkCredits(userId, estimatedCards);

    if (creditCheck.needsPlanSelection) {
      return NextResponse.json(
        {
          error: creditCheck.message || "Please select a plan to continue",
          needsPlanSelection: true,
          redirectTo: "/pricing",
        },
        { status: 402 }
      );
    }

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: creditCheck.message || "Insufficient credits",
          remaining: creditCheck.remaining,
          limit: creditCheck.limit,
          plan: creditCheck.plan,
        },
        { status: 403 }
      );
    }

    const result = await generateFlashcards(data);
    const actualCards = result.flashcard.length;

    if (actualCards > 0) {
      await deductCredits(userId, actualCards);
    }

    const updatedCheck = await checkCredits(userId, 0);

    return NextResponse.json(
      {
        flashcard: result.flashcard,
        model: result.model,
        meta: result.meta,
        credits: {
          remaining: updatedCheck.remaining,
          limit: updatedCheck.limit,
          plan: updatedCheck.plan,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ msg: "Flashcard generation API is ready" });
}
