import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateMindMap } from "@/lib/ai/mindmap";
import { countMindMapNodes } from "@/lib/ai/parse";
import { checkCredits, deductCredits } from "@/lib/credits";
import { ensureUser } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { MINDMAP_CREDIT_COST } from "@/types/mindmap";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic, extra, title } = body as {
      topic?: string;
      extra?: string;
      title?: string;
    };

    if (!topic?.trim()) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }

    const creditCheck = await checkCredits(clerkId, MINDMAP_CREDIT_COST);
    if (creditCheck.needsPlanSelection) {
      return NextResponse.json(
        {
          error: creditCheck.message || "Please select a plan to continue",
          needsPlanSelection: true,
        },
        { status: 402 }
      );
    }
    if (!creditCheck.allowed) {
      return NextResponse.json(
        { error: creditCheck.message || "Insufficient credits" },
        { status: 403 }
      );
    }

    const result = await generateMindMap({ topic: topic.trim(), extra });

    const user = await ensureUser(clerkId);
    const mindMapSet = await prisma.mindMapSet.create({
      data: {
        title: title?.trim() || topic.trim(),
        topic: topic.trim(),
        userId: user.id,
        tree: result.tree as unknown as Prisma.InputJsonValue,
      },
    });
    await deductCredits(clerkId, MINDMAP_CREDIT_COST);

    const updatedCheck = await checkCredits(clerkId, 0);

    return NextResponse.json(
      {
        mindMapSet: {
          id: mindMapSet.id,
          title: mindMapSet.title,
          topic: mindMapSet.topic,
          tree: mindMapSet.tree,
          flashcardSetId: mindMapSet.flashcardSetId,
          createdAt: mindMapSet.createdAt.toISOString(),
          updatedAt: mindMapSet.updatedAt.toISOString(),
          nodeCount: countMindMapNodes(result.tree),
        },
        model: result.model,
        credits: {
          remaining: updatedCheck.remaining,
          limit: updatedCheck.limit,
          plan: updatedCheck.plan,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating mind map:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate mind map";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
