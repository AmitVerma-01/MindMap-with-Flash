import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST duplicate a flashcard set
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    const original = await prisma.flashcardSet.findFirst({
      where: { id, userId: user.id },
      include: { flashcards: true },
    });

    if (!original) {
      return NextResponse.json(
        { error: "Flashcard set not found" },
        { status: 404 }
      );
    }

    const duplicate = await prisma.flashcardSet.create({
      data: {
        title: `${original.title} (Copy)`,
        topic: original.topic,
        userId: user.id,
        flashcards: {
          create: original.flashcards.map((card) => ({
            front: card.front,
            back: card.back,
            hint: card.hint,
            mnemonic: card.mnemonic,
            category: card.category,
            difficulty: card.difficulty,
          })),
        },
      },
      include: { flashcards: true },
    });

    return NextResponse.json({ flashcardSet: duplicate }, { status: 201 });
  } catch (error) {
    console.error("Error duplicating flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to duplicate flashcard set" },
      { status: 500 }
    );
  }
}

// DELETE a flashcard set
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    // Verify ownership
    const flashcardSet = await prisma.flashcardSet.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!flashcardSet) {
      return NextResponse.json(
        { error: "Flashcard set not found" },
        { status: 404 }
      );
    }

    await prisma.flashcardSet.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to delete flashcard set" },
      { status: 500 }
    );
  }
}
