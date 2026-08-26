import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/user";

export const dynamic = "force-dynamic";

// GET all flashcard sets for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ flashcardSets: [] }, { status: 200 });
    }

    const flashcardSets = await prisma.flashcardSet.findMany({
      where: { userId: user.id },
      include: {
        flashcards: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ flashcardSets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flashcard sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard sets" },
      { status: 500 }
    );
  }
}

// POST create a new flashcard set
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, topic, flashcards } = await req.json();

    if (!title || !topic || !flashcards || !Array.isArray(flashcards)) {
      return NextResponse.json(
        { error: "Missing required fields: title, topic, flashcards" },
        { status: 400 }
      );
    }

    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@temp.com`;
    const user = await ensureUser(userId, email);

    // Create flashcard set with flashcards
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title,
        topic,
        userId: user.id,
        flashcards: {
          create: flashcards.map(
            (card: {
              front: string;
              back: string;
              hint?: string;
              mnemonic?: string;
              category?: string;
              difficulty?: string;
            }) => ({
              front: card.front,
              back: card.back,
              hint: card.hint ?? null,
              mnemonic: card.mnemonic ?? null,
              category: card.category ?? null,
              difficulty: card.difficulty ?? null,
            })
          ),
        },
      },
      include: {
        flashcards: true,
      },
    });

    return NextResponse.json({ flashcardSet }, { status: 201 });
  } catch (error) {
    console.error("Error creating flashcard set:", error);
    return NextResponse.json(
      { error: "Failed to create flashcard set" },
      { status: 500 }
    );
  }
}
