import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { countMindMapNodes } from "@/lib/ai/parse";
import { getUserByClerkId } from "@/lib/srs/queue";
import { prisma } from "@/lib/prisma";
import type { MindMapTreeNode } from "@/types/mindmap";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ mindMapSets: [] }, { status: 200 });
    }

    const mindMapSets = await prisma.mindMapSet.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        mindMapSets: mindMapSets.map((map) => ({
          id: map.id,
          title: map.title,
          topic: map.topic,
          flashcardSetId: map.flashcardSetId,
          createdAt: map.createdAt.toISOString(),
          updatedAt: map.updatedAt.toISOString(),
          nodeCount: countMindMapNodes(map.tree as unknown as MindMapTreeNode),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching mind map sets:", error);
    return NextResponse.json(
      { error: "Failed to fetch mind maps" },
      { status: 500 }
    );
  }
}
