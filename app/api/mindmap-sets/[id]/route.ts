import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { Prisma } from "@/generated/prisma/client";
import { generateFlashcards } from "@/lib/ai/flashcards";
import { checkCredits, deductCredits } from "@/lib/credits";
import { getUserByClerkId } from "@/lib/srs/queue";
import { prisma } from "@/lib/prisma";
import type { MindMapTreeNode } from "@/types/mindmap";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const mindMapSet = await prisma.mindMapSet.findFirst({
      where: { id, userId: user.id },
    });

    if (!mindMapSet) {
      return NextResponse.json({ error: "Mind map not found" }, { status: 404 });
    }

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
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching mind map:", error);
    return NextResponse.json(
      { error: "Failed to fetch mind map" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const mindMapSet = await prisma.mindMapSet.findFirst({
      where: { id, userId: user.id },
    });

    if (!mindMapSet) {
      return NextResponse.json({ error: "Mind map not found" }, { status: 404 });
    }

    const body = await req.json();
    const { tree } = body as { tree?: MindMapTreeNode };

    if (!tree || typeof tree !== "object" || !tree.id || !tree.label) {
      return NextResponse.json(
        { error: "Valid tree is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.mindMapSet.update({
      where: { id },
      data: {
        tree: tree as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json(
      {
        mindMapSet: {
          id: updated.id,
          title: updated.title,
          topic: updated.topic,
          tree: updated.tree,
          flashcardSetId: updated.flashcardSetId,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating mind map:", error);
    return NextResponse.json(
      { error: "Failed to update mind map" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const mindMapSet = await prisma.mindMapSet.findFirst({
      where: { id, userId: user.id },
    });

    if (!mindMapSet) {
      return NextResponse.json({ error: "Mind map not found" }, { status: 404 });
    }

    await prisma.mindMapSet.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting mind map:", error);
    return NextResponse.json(
      { error: "Failed to delete mind map" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const mindMapSet = await prisma.mindMapSet.findFirst({
      where: { id, userId: user.id },
    });

    if (!mindMapSet) {
      return NextResponse.json({ error: "Mind map not found" }, { status: 404 });
    }

    const body = await req.json();
    const { nodeLabel, cardCount = 5 } = body as {
      nodeLabel?: string;
      cardCount?: number;
    };

    if (!nodeLabel?.trim()) {
      return NextResponse.json(
        { error: "nodeLabel is required" },
        { status: 400 }
      );
    }

    const count = Math.min(Math.max(1, cardCount), 12);
    const creditCheck = await checkCredits(clerkId, count);
    if (!creditCheck.allowed) {
      return NextResponse.json(
        { error: creditCheck.message || "Insufficient credits" },
        { status: 403 }
      );
    }

    const tree = mindMapSet.tree as unknown as MindMapTreeNode;
    const result = await generateFlashcards({
      topic: nodeLabel.trim(),
      extra: `This is a sub-topic of "${mindMapSet.topic}". Parent mind map root: ${tree.label}`,
      counts: count,
      level: "intermediate",
    });

    if (result.flashcard.length > 0) {
      await deductCredits(clerkId, result.flashcard.length);
    }

    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title: `${nodeLabel.trim()} — from ${mindMapSet.title}`,
        topic: nodeLabel.trim(),
        userId: user.id,
        flashcards: {
          create: result.flashcard.map((card) => ({
            front: card.front,
            back: card.back,
            hint: card.hint ?? null,
            mnemonic: card.mnemonic ?? null,
            category: card.category ?? null,
            difficulty: card.difficulty ?? null,
          })),
        },
      },
      include: { flashcards: true },
    });

    const updatedCheck = await checkCredits(clerkId, 0);

    return NextResponse.json(
      {
        flashcardSet,
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
    console.error("Error generating flashcards from node:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate flashcards";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
