import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// DELETE a flashcard set
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    // Verify ownership
    const flashcardSet = await prisma.flashcardSet.findFirst({
      where: {
        id: params.id,
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
      where: { id: params.id },
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
