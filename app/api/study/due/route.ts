import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStudyQueue, getUserByClerkId } from "@/lib/srs/queue";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ cards: [] }, { status: 200 });
    }

    const setId = req.nextUrl.searchParams.get("setId");
    if (!setId) {
      return NextResponse.json(
        { error: "setId query parameter is required" },
        { status: 400 }
      );
    }

    const set = await import("@/lib/prisma").then(({ prisma }) =>
      prisma.flashcardSet.findFirst({
        where: { id: setId, userId: user.id },
      })
    );

    if (!set) {
      return NextResponse.json(
        { error: "Flashcard set not found" },
        { status: 404 }
      );
    }

    const cards = await getStudyQueue(user.id, setId);

    return NextResponse.json({ cards, setId, setTitle: set.title }, { status: 200 });
  } catch (error) {
    console.error("Error fetching due cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch study queue" },
      { status: 500 }
    );
  }
}
