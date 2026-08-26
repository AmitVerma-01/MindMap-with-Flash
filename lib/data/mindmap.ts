import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { MindMapSetData, MindMapTreeNode } from "@/types/mindmap";

export async function getMindMapById(id: string): Promise<MindMapSetData | null> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return null;

  const mindMapSet = await prisma.mindMapSet.findFirst({
    where: { id, userId: user.id },
  });

  if (!mindMapSet) return null;

  return {
    id: mindMapSet.id,
    title: mindMapSet.title,
    topic: mindMapSet.topic,
    tree: mindMapSet.tree as unknown as MindMapTreeNode,
    flashcardSetId: mindMapSet.flashcardSetId,
    createdAt: mindMapSet.createdAt.toISOString(),
    updatedAt: mindMapSet.updatedAt.toISOString(),
  };
}
