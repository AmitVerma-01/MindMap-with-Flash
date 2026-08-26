import { auth } from "@clerk/nextjs/server";
import { countMindMapNodes } from "@/lib/ai/parse";
import { prisma } from "@/lib/prisma";
import { getAllSetStudyStats } from "@/lib/srs/queue";
import type { MindMapTreeNode } from "@/types/mindmap";
import type { SetStudyStats } from "@/types/study";

export interface SerializedFlashcardSet {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  flashcards: Array<{
    id: string;
    front: string;
    back: string;
    hint: string | null;
    mnemonic: string | null;
    category: string | null;
    difficulty: string | null;
  }>;
}

export interface MindMapListItem {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  nodeCount: number;
}

export interface DashboardData {
  flashcardSets: SerializedFlashcardSet[];
  studyStats: Record<string, SetStudyStats>;
  totalDue: number;
  totalNew: number;
  mindMapSets: MindMapListItem[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return {
      flashcardSets: [],
      studyStats: {},
      totalDue: 0,
      totalNew: 0,
      mindMapSets: [],
    };
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return {
      flashcardSets: [],
      studyStats: {},
      totalDue: 0,
      totalNew: 0,
      mindMapSets: [],
    };
  }

  const [flashcardSets, stats, mindMapSets] = await Promise.all([
    prisma.flashcardSet.findMany({
      where: { userId: user.id },
      include: { flashcards: true },
      orderBy: { createdAt: "desc" },
    }),
    getAllSetStudyStats(user.id),
    prisma.mindMapSet.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const studyStats: Record<string, SetStudyStats> = {};
  let totalDue = 0;
  let totalNew = 0;
  for (const stat of stats) {
    studyStats[stat.setId] = stat;
    totalDue += stat.due;
    totalNew += stat.new;
  }

  return {
    flashcardSets: flashcardSets.map((set) => ({
      id: set.id,
      title: set.title,
      topic: set.topic,
      createdAt: set.createdAt.toISOString(),
      flashcards: set.flashcards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        hint: card.hint,
        mnemonic: card.mnemonic,
        category: card.category,
        difficulty: card.difficulty,
      })),
    })),
    studyStats,
    totalDue,
    totalNew,
    mindMapSets: mindMapSets.map((map) => ({
      id: map.id,
      title: map.title,
      topic: map.topic,
      createdAt: map.createdAt.toISOString(),
      nodeCount: countMindMapNodes(map.tree as unknown as MindMapTreeNode),
    })),
  };
}

export async function getFlashcardSetOptions() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return [];

  const sets = await prisma.flashcardSet.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, topic: true },
    orderBy: { createdAt: "desc" },
  });

  return sets;
}
